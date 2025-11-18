import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  TextField,
  Button,
  Collapse,
  Chip,
} from '@mui/material';
import { CheckCircle, Circle, Clock, Plus, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { LoadingSpinner, EmptyState } from '../../../shared/src/components/common';
import { formatDate } from '../../utils/helpers';

export const LessonList = ({ courseId }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingNew, setAddingNew] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [expandedLesson, setExpandedLesson] = useState(null);

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  const fetchLessons = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_number', { ascending: true });

      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (lesson) => {
    const newCompleteState = !lesson.is_completed;

    try {
      const { error } = await supabase
        .from('lessons')
        .update({
          is_completed: newCompleteState,
          completed_at: newCompleteState ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', lesson.id);

      if (error) throw error;

      // Update local state
      setLessons((prev) =>
        prev.map((l) =>
          l.id === lesson.id
            ? {
                ...l,
                is_completed: newCompleteState,
                completed_at: newCompleteState ? new Date().toISOString() : null,
              }
            : l
        )
      );

      // Update course progress
      await updateCourseProgress();
    } catch (error) {
      console.error('Error toggling lesson:', error);
    }
  };

  const updateCourseProgress = async () => {
    try {
      // Fetch updated lessons
      const { data: updatedLessons } = await supabase
        .from('lessons')
        .select('is_completed')
        .eq('course_id', courseId);

      if (!updatedLessons) return;

      const totalLessons = updatedLessons.length;
      const completedLessons = updatedLessons.filter((l) => l.is_completed).length;
      const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      // Update course
      await supabase
        .from('courses')
        .update({
          completed_lessons: completedLessons,
          total_lessons: totalLessons,
          progress_percentage: progressPercentage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', courseId);
    } catch (error) {
      console.error('Error updating course progress:', error);
    }
  };

  const handleAddLesson = async () => {
    if (!newLessonTitle.trim()) return;

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user) return;

      // Get max order number
      const maxOrder = lessons.length > 0 ? Math.max(...lessons.map((l) => l.order_number || 0)) : 0;

      const { data, error } = await supabase
        .from('lessons')
        .insert([
          {
            course_id: courseId,
            title: newLessonTitle,
            order_number: maxOrder + 1,
            is_completed: false,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setLessons((prev) => [...prev, data]);
      setNewLessonTitle('');
      setAddingNew(false);

      // Update course total lessons
      await updateCourseProgress();
    } catch (error) {
      console.error('Error adding lesson:', error);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Opravdu chceš smazat tuto lekci?')) return;

    try {
      const { error } = await supabase.from('lessons').delete().eq('id', lessonId);

      if (error) throw error;

      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
      await updateCourseProgress();
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  const handleUpdateNotes = async (lessonId, notes) => {
    try {
      const { error } = await supabase
        .from('lessons')
        .update({ notes, updated_at: new Date().toISOString() })
        .eq('id', lessonId);

      if (error) throw error;

      setLessons((prev) =>
        prev.map((l) => (l.id === lessonId ? { ...l, notes } : l))
      );
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  if (loading) return <LoadingSpinner size={40} />;

  const completedCount = lessons.filter((l) => l.is_completed).length;
  const totalCount = lessons.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Box>
      {/* Header Stats */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Lekce kurzu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {completedCount} z {totalCount} dokončeno ({progressPercent}%)
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Plus size={18} />}
          onClick={() => setAddingNew(true)}
        >
          Přidat lekci
        </Button>
      </Box>

      {/* Add New Lesson Form */}
      {addingNew && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Název lekce..."
            value={newLessonTitle}
            onChange={(e) => setNewLessonTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddLesson()}
            autoFocus
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" size="small" onClick={handleAddLesson}>
              Přidat
            </Button>
            <Button
              variant="text"
              size="small"
              onClick={() => {
                setAddingNew(false);
                setNewLessonTitle('');
              }}
            >
              Zrušit
            </Button>
          </Box>
        </Box>
      )}

      {/* Lessons List */}
      {lessons.length === 0 ? (
        <EmptyState
          title="Zatím žádné lekce"
          description="Začni přidáním první lekce do tohoto kurzu"
          actionLabel="Přidat první lekci"
          onAction={() => setAddingNew(true)}
        />
      ) : (
        <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
          {lessons.map((lesson, index) => (
            <Box key={lesson.id}>
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteLesson(lesson.id)}
                    size="small"
                  >
                    <Trash2 size={18} />
                  </IconButton>
                }
              >
                <ListItemButton
                  onClick={() => handleToggleComplete(lesson)}
                  dense
                  sx={{
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={lesson.is_completed}
                      tabIndex={-1}
                      disableRipple
                      icon={<Circle size={20} />}
                      checkedIcon={<CheckCircle size={20} color="#10b981" />}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: lesson.is_completed ? 'line-through' : 'none',
                            color: lesson.is_completed ? 'text.secondary' : 'text.primary',
                            fontWeight: lesson.is_completed ? 400 : 500,
                          }}
                        >
                          {index + 1}. {lesson.title}
                        </Typography>
                        {lesson.duration_minutes && (
                          <Chip
                            icon={<Clock size={12} />}
                            label={`${lesson.duration_minutes} min`}
                            size="small"
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      lesson.is_completed && lesson.completed_at
                        ? `Dokončeno ${formatDate(lesson.completed_at)}`
                        : null
                    }
                  />
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id);
                    }}
                  >
                    {expandedLesson === lesson.id ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </IconButton>
                </ListItemButton>
              </ListItem>

              {/* Expanded Notes Section */}
              <Collapse in={expandedLesson === lesson.id} timeout="auto" unmountOnExit>
                <Box sx={{ p: 2, pl: 9, bgcolor: 'grey.50' }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Poznámky k lekci
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    rows={3}
                    placeholder="Přidej poznámky k této lekci..."
                    value={lesson.notes || ''}
                    onChange={(e) => handleUpdateNotes(lesson.id, e.target.value)}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Collapse>
            </Box>
          ))}
        </List>
      )}
    </Box>
  );
};
