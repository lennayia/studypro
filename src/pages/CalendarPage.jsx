import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Calendar as CalendarIcon, AlertCircle, Clock } from 'lucide-react';
import { CalendarView } from '../components/calendar/CalendarView';
import { useCourses } from '../contexts/CourseContext';
import { StatsCard } from '../../shared/src/components/common';

export const CalendarPage = () => {
  const { courses } = useCourses();
  const [selectedDate, setSelectedDate] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get courses for selected date
  const coursesOnDate = selectedDate
    ? courses.filter((course) => {
        if (!course.deadline) return false;
        const deadline = new Date(course.deadline);
        return (
          deadline.getDate() === selectedDate.getDate() &&
          deadline.getMonth() === selectedDate.getMonth() &&
          deadline.getFullYear() === selectedDate.getFullYear()
        );
      })
    : [];

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const coursesWithDeadline = courses.filter((course) => {
      if (!course.deadline) return false;
      const deadline = new Date(course.deadline);
      return (
        deadline.getDate() === date.getDate() &&
        deadline.getMonth() === date.getMonth() &&
        deadline.getFullYear() === date.getFullYear()
      );
    });

    if (coursesWithDeadline.length > 0) {
      setDialogOpen(true);
    }
  };

  // Get upcoming deadlines (next 7 days)
  const getUpcomingDeadlines = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    return courses
      .filter((course) => {
        if (!course.deadline) return false;
        const deadline = new Date(course.deadline);
        return deadline >= today && deadline <= nextWeek;
      })
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  };

  const upcomingDeadlines = getUpcomingDeadlines();

  // Get overdue courses
  const getOverdueCourses = () => {
    const today = new Date();
    return courses.filter((course) => {
      if (!course.deadline || course.status === 'completed') return false;
      const deadline = new Date(course.deadline);
      return deadline < today;
    });
  };

  const overdueCourses = getOverdueCourses();

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        📅 Kalendář deadlinů
      </Typography>

      <Grid container spacing={3}>
        {/* Stats */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <StatsCard
              icon={<CalendarIcon size={24} color="#6366f1" />}
              label="Nadcházející deadliny"
              value={upcomingDeadlines.length}
            />
            <StatsCard
              icon={<AlertCircle size={24} color="#ef4444" />}
              label="Prošlé deadliny"
              value={overdueCourses.length}
            />
            <StatsCard
              icon={<Clock size={24} color="#10b981" />}
              label="Celkem kurzů s deadline"
              value={courses.filter((c) => c.deadline).length}
            />
          </Stack>
        </Grid>

        {/* Calendar */}
        <Grid item xs={12} md={8}>
          <CalendarView onDateClick={handleDateClick} />
        </Grid>

        {/* Upcoming deadlines */}
        {upcomingDeadlines.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                  🔔 Nadcházející (7 dní)
                </Typography>
                <Stack spacing={2}>
                  {upcomingDeadlines.map((course) => {
                    const deadline = new Date(course.deadline);
                    const today = new Date();
                    const daysUntil = Math.ceil(
                      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                    );
                    const isUrgent = daysUntil <= 3;

                    return (
                      <Box
                        key={course.id}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: isUrgent ? 'error.main' : 'divider',
                          bgcolor: isUrgent ? 'error.lighter' : 'background.paper',
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {course.title}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="caption" color="text.secondary">
                            {deadline.toLocaleDateString('cs-CZ', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </Typography>
                          <Chip
                            label={`Za ${daysUntil} dní`}
                            size="small"
                            color={isUrgent ? 'error' : 'primary'}
                            variant="outlined"
                          />
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Overdue */}
        {overdueCourses.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 4 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: 'error.main' }}>
                  ⚠️ Prošlé deadliny
                </Typography>
                <Stack spacing={2}>
                  {overdueCourses.map((course) => {
                    const deadline = new Date(course.deadline);
                    const today = new Date();
                    const daysOverdue = Math.ceil(
                      (today.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24)
                    );

                    return (
                      <Box
                        key={course.id}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: 'error.main',
                          bgcolor: 'error.lighter',
                        }}
                      >
                        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {course.title}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="caption" color="text.secondary">
                            {deadline.toLocaleDateString('cs-CZ', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </Typography>
                          <Chip
                            label={`Prošlo před ${daysOverdue} dny`}
                            size="small"
                            color="error"
                          />
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Date detail dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedDate &&
            selectedDate.toLocaleDateString('cs-CZ', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {coursesOnDate.map((course) => (
              <Box
                key={course.id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.lecturer && `Lektor: ${course.lecturer}`}
                </Typography>
                <Chip
                  label={course.category || 'Kurz'}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Zavřít</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
