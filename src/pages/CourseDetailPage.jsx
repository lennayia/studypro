import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  IconButton,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import {
  CoursesPageIcon,
  EditActionIcon,
  DeleteActionIcon,
  PlayActionIcon,
  UserMetaIcon,
  CalendarMetaIcon,
  PriceMetaIcon,
} from '../../shared/src/components/icons';
import { ChevronLeft } from 'lucide-react';
import { useCourses } from '../contexts/CourseContext';
import { LoadingSpinner, StatsCard } from '../../shared/src/components/common';
import { LessonList } from '../components/courses/LessonList';
import { CourseNotes } from '../components/courses/CourseNotes';
import {
  getCourseTypeLabel,
  getCourseStatusLabel,
  formatDate,
  getDeadlineStatus,
  getCategoryColor,
  getStatusColor,
  formatPrice,
} from '../utils/helpers';

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

export const CourseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, loading, updateCourse, deleteCourse } = useCourses();
  const [currentTab, setCurrentTab] = useState(0);

  if (loading) return <LoadingSpinner size={60} message="Načítám detail kurzu..." />;

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" gutterBottom>
          Kurz nenalezen
        </Typography>
        <Button onClick={() => navigate('/courses')} sx={{ mt: 2 }}>
          Zpět na kurzy
        </Button>
      </Box>
    );
  }

  const handleDelete = async () => {
    if (window.confirm(`Opravdu chceš smazat kurz "${course.title}"?`)) {
      const result = await deleteCourse(course.id);
      if (result.success) {
        navigate('/courses');
      }
    }
  };

  const handleEdit = () => {
    navigate('/courses'); // V budoucnu otevře edit dialog
  };

  const deadlineStatus = getDeadlineStatus(course.access_until);
  const categoryColor = getCategoryColor(course.category);
  const statusColor = getStatusColor(course.status);

  const progressPercentage = course.progress_percentage || 0;
  const completedLessons = course.completed_lessons || 0;
  const totalLessons = course.total_lessons || 0;

  return (
    <Box>
      {/* Back Button */}
      <Button
        startIcon={<ChevronLeft size={20} />}
        onClick={() => navigate('/courses')}
        sx={{ mb: 3 }}
      >
        Zpět na kurzy
      </Button>

      {/* Cover Section */}
      <Card sx={{ mb: 3 }}>
        <Box
          sx={{
            height: 240,
            background: course.cover_image_url
              ? `url(${course.cover_image_url})`
              : `linear-gradient(135deg, ${categoryColor}dd 0%, ${categoryColor} 100%)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            p: 3,
          }}
        >
          {/* Actions */}
          <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
            <IconButton
              onClick={handleEdit}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': { bgcolor: 'white' },
              }}
            >
              <EditActionIcon />
            </IconButton>
            <IconButton
              onClick={handleDelete}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                '&:hover': { bgcolor: 'white' },
              }}
            >
              <DeleteActionIcon />
            </IconButton>
          </Box>

          {/* Status Badge */}
          <Chip
            label={getCourseStatusLabel(course.status)}
            sx={{
              bgcolor: statusColor,
              color: 'white',
              fontWeight: 600,
              fontSize: '0.875rem',
              height: 32,
            }}
          />
        </Box>

        <CardContent sx={{ pt: 3 }}>
          {/* Title & Category */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
              <CoursesPageIcon />
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {course.title}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              {course.category && (
                <Chip
                  label={course.category}
                  sx={{
                    bgcolor: categoryColor + '20',
                    color: categoryColor,
                    fontWeight: 500,
                  }}
                />
              )}
              <Chip label={getCourseTypeLabel(course.course_type)} variant="outlined" />
            </Box>

            {course.description && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {course.description}
              </Typography>
            )}
          </Box>

          {/* Metadata */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {course.instructor && (
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <UserMetaIcon />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Lektor
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {course.instructor}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {course.access_until && (
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarMetaIcon />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Přístup do
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color={deadlineStatus ? `${deadlineStatus.color}.main` : 'inherit'}
                    >
                      {formatDate(course.access_until)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {course.price && (
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PriceMetaIcon />
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Cena
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatPrice(course.price, course.currency)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>

          {/* Progress */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                Celkový pokrok
              </Typography>
              <Typography variant="body2" fontWeight={700} color="primary">
                {Math.round(progressPercentage)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progressPercentage}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: 'grey.200',
                '& .MuiLinearProgress-bar': {
                  bgcolor: statusColor,
                  borderRadius: 4,
                },
              }}
            />
            {totalLessons > 0 && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {completedLessons} z {totalLessons} lekcí dokončeno
              </Typography>
            )}
          </Box>

          {/* Action Button */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            startIcon={<PlayActionIcon />}
            sx={{ mb: 2 }}
          >
            {course.status === 'not_started' ? 'Začít studovat' : 'Pokračovat ve studiu'}
          </Button>

          {/* Platform & URL */}
          {(course.platform || course.url) && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              {course.platform && (
                <Typography variant="caption" color="text.secondary">
                  Platforma: {course.platform}
                </Typography>
              )}
              {course.url && (
                <Typography
                  variant="caption"
                  color="primary"
                  component="a"
                  href={course.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: 'none' }}
                >
                  Přejít na kurz →
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Dokončeno"
            value={`${completedLessons}/${totalLessons}`}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Pokrok"
            value={`${Math.round(progressPercentage)}%`}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Priorita"
            value={course.priority || 0}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Status"
            value={getCourseStatusLabel(course.status)}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentTab}
            onChange={(e, newValue) => setCurrentTab(newValue)}
            aria-label="course detail tabs"
          >
            <Tab label="Lekce" />
            <Tab label="Poznámky" />
            <Tab label="Statistiky" />
          </Tabs>
        </Box>

        <CardContent>
          <TabPanel value={currentTab} index={0}>
            <LessonList courseId={course.id} />
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <CourseNotes courseId={course.id} />
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <Typography variant="body2" color="text.secondary">
              Statistiky kurzu - v přípravě
            </Typography>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
};
