import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  MenuItem,
  Chip,
} from '@mui/material';
import { Plus, Edit, Trash2, FileText, Link as LinkIcon, BookMarked, Tag } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { LoadingSpinner, EmptyState } from '../../../shared/src/components/common';
import { formatDate } from '../../utils/helpers';
import { RichTextEditor, MarkdownPreview } from '../notes/RichTextEditor';

const NOTE_TYPES = [
  { value: 'general', label: 'Obecné', icon: FileText, color: '#6366f1' },
  { value: 'summary', label: 'Shrnutí', icon: BookMarked, color: '#8b5cf6' },
  { value: 'link', label: 'Odkaz', icon: LinkIcon, color: '#10b981' },
];

export const CourseNotes = ({ courseId }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingNew, setAddingNew] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    content: '',
    note_type: 'general',
  });

  useEffect(() => {
    fetchNotes();
  }, [courseId]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('course_notes')
        .select('*')
        .eq('course_id', courseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.content.trim()) return;

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user) return;

      if (editingNote) {
        // Update existing note
        const { error } = await supabase
          .from('course_notes')
          .update({
            content: formData.content,
            note_type: formData.note_type,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingNote.id);

        if (error) throw error;

        setNotes((prev) =>
          prev.map((n) =>
            n.id === editingNote.id
              ? { ...n, content: formData.content, note_type: formData.note_type }
              : n
          )
        );
      } else {
        // Create new note
        const { data, error } = await supabase
          .from('course_notes')
          .insert([
            {
              course_id: courseId,
              user_id: user.user.id,
              content: formData.content,
              note_type: formData.note_type,
            },
          ])
          .select()
          .single();

        if (error) throw error;

        setNotes((prev) => [data, ...prev]);
      }

      // Reset form
      setFormData({ content: '', note_type: 'general' });
      setAddingNew(false);
      setEditingNote(null);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setFormData({
      content: note.content,
      note_type: note.note_type || 'general',
    });
    setAddingNew(true);
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm('Opravdu chceš smazat tuto poznámku?')) return;

    try {
      const { error } = await supabase.from('course_notes').delete().eq('id', noteId);

      if (error) throw error;

      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleCancel = () => {
    setAddingNew(false);
    setEditingNote(null);
    setFormData({ content: '', note_type: 'general' });
  };

  const getNoteTypeInfo = (type) => {
    return NOTE_TYPES.find((t) => t.value === type) || NOTE_TYPES[0];
  };

  if (loading) return <LoadingSpinner size={40} />;

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Poznámky ke kurzu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {notes.length} {notes.length === 1 ? 'poznámka' : notes.length < 5 ? 'poznámky' : 'poznámek'}
          </Typography>
        </Box>
        {!addingNew && (
          <Button
            variant="outlined"
            startIcon={<Plus size={18} />}
            onClick={() => setAddingNew(true)}
          >
            Přidat poznámku
          </Button>
        )}
      </Box>

      {/* Add/Edit Form */}
      {addingNew && (
        <Card sx={{ mb: 3, bgcolor: 'grey.50' }}>
          <CardContent>
            <Typography variant="subtitle2" gutterBottom>
              {editingNote ? 'Upravit poznámku' : 'Nová poznámka'}
            </Typography>

            <TextField
              select
              fullWidth
              size="small"
              label="Typ poznámky"
              value={formData.note_type}
              onChange={(e) => setFormData({ ...formData, note_type: e.target.value })}
              sx={{ mb: 2 }}
            >
              {NOTE_TYPES.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <type.icon size={16} />
                    {type.label}
                  </Box>
                </MenuItem>
              ))}
            </TextField>

            <RichTextEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="Napiš svou poznámku s Markdown podporou..."
              minHeight={200}
            />
            <Box sx={{ height: 16 }} />

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="contained" onClick={handleSubmit}>
                {editingNote ? 'Uložit' : 'Přidat poznámku'}
              </Button>
              <Button variant="text" onClick={handleCancel}>
                Zrušit
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Notes List */}
      {notes.length === 0 ? (
        <EmptyState
          title="Zatím žádné poznámky"
          description="Začni psát poznámky k tomuto kurzu"
          actionLabel="Přidat první poznámku"
          onAction={() => setAddingNew(true)}
        />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {notes.map((note) => {
            const typeInfo = getNoteTypeInfo(note.note_type);
            const TypeIcon = typeInfo.icon;

            return (
              <Card key={note.id} variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Chip
                      icon={<TypeIcon size={14} />}
                      label={typeInfo.label}
                      size="small"
                      sx={{
                        bgcolor: typeInfo.color + '20',
                        color: typeInfo.color,
                        fontWeight: 500,
                      }}
                    />
                    <Box>
                      <IconButton size="small" onClick={() => handleEdit(note)}>
                        <Edit size={16} />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(note.id)}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <MarkdownPreview content={note.content} />
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    {formatDate(note.created_at)}
                    {note.updated_at && note.updated_at !== note.created_at && (
                      <> • Upraveno {formatDate(note.updated_at)}</>
                    )}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
