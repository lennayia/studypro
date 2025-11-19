import { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Chip,
  Stack,
  useTheme,
} from '@mui/material';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { useCourses } from '../../contexts/CourseContext';
import { getCategoryColor } from '../../theme/theme';

export const CalendarView = ({ onDateClick }) => {
  const theme = useTheme();
  const { courses } = useCourses();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysOfWeek = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

  // Get month data
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Mon = 0

  const daysInMonth = lastDay.getDate();

  // Get courses with deadlines in this month
  const coursesWithDeadlines = useMemo(() => {
    return courses.filter((course) => {
      if (!course.deadline) return false;
      const deadline = new Date(course.deadline);
      return deadline.getMonth() === month && deadline.getFullYear() === year;
    });
  }, [courses, month, year]);

  // Create map of date -> courses
  const deadlineMap = useMemo(() => {
    const map = {};
    coursesWithDeadlines.forEach((course) => {
      const day = new Date(course.deadline).getDate();
      if (!map[day]) map[day] = [];
      map[day].push(course);
    });
    return map;
  }, [coursesWithDeadlines]);

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Check if date is today
  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  // Check if deadline is soon (within 3 days)
  const isDeadlineSoon = (day) => {
    const date = new Date(year, month, day);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  };

  // Generate calendar days
  const calendarDays = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <Card sx={{ borderRadius: 4 }}>
      <CardContent>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CalendarIcon size={28} color="#6366f1" />
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {currentDate.toLocaleDateString('cs-CZ', {
                month: 'long',
                year: 'numeric',
              })}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <IconButton onClick={goToPreviousMonth} size="small">
              <ChevronLeft size={20} />
            </IconButton>
            <Chip
              label="Dnes"
              onClick={goToToday}
              size="small"
              sx={{ cursor: 'pointer' }}
            />
            <IconButton onClick={goToNextMonth} size="small">
              <ChevronRight size={20} />
            </IconButton>
          </Stack>
        </Stack>

        {/* Days of week header */}
        <Grid container spacing={1} sx={{ mb: 1 }}>
          {daysOfWeek.map((day) => (
            <Grid item xs={12 / 7} key={day}>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  fontWeight: 600,
                  color: 'text.secondary',
                }}
              >
                {day}
              </Typography>
            </Grid>
          ))}
        </Grid>

        {/* Calendar grid */}
        <Grid container spacing={1}>
          {calendarDays.map((day, index) => {
            const hasDeadlines = day && deadlineMap[day];
            const isTodayDate = day && isToday(day);
            const isUrgent = day && hasDeadlines && isDeadlineSoon(day);

            return (
              <Grid item xs={12 / 7} key={index}>
                <Box
                  onClick={() => day && onDateClick && onDateClick(new Date(year, month, day))}
                  sx={{
                    aspectRatio: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    cursor: day ? 'pointer' : 'default',
                    border: '1px solid',
                    borderColor: isTodayDate ? 'primary.main' : 'divider',
                    bgcolor: isTodayDate
                      ? 'primary.main'
                      : hasDeadlines
                      ? isUrgent
                        ? 'error.lighter'
                        : 'info.lighter'
                      : 'transparent',
                    '&:hover': day && {
                      bgcolor: (theme) =>
                        theme.palette.mode === 'dark'
                          ? 'rgba(255,255,255,0.05)'
                          : 'grey.100',
                    },
                    transition: 'all 0.2s',
                  }}
                >
                  {day && (
                    <>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isTodayDate ? 700 : 500,
                          color: isTodayDate
                            ? 'primary.contrastText'
                            : 'text.primary',
                        }}
                      >
                        {day}
                      </Typography>
                      {hasDeadlines && (
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            borderRadius: '50%',
                            bgcolor: isUrgent ? 'error.main' : 'info.main',
                            mt: 0.5,
                          }}
                        />
                      )}
                    </>
                  )}
                </Box>
              </Grid>
            );
          })}
        </Grid>

        {/* Upcoming deadlines */}
        {coursesWithDeadlines.length > 0 && (
          <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Deadliny v tomto měsíci ({coursesWithDeadlines.length})
            </Typography>
            <Stack spacing={1.5}>
              {coursesWithDeadlines
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
                .map((course) => {
                  const deadline = new Date(course.deadline);
                  const daysUntil = Math.ceil(
                    (deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                  );
                  const isUrgent = daysUntil >= 0 && daysUntil <= 3;

                  return (
                    <Box
                      key={course.id}
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: isUrgent ? 'error.main' : 'divider',
                        bgcolor: isUrgent
                          ? 'error.lighter'
                          : (theme) =>
                              theme.palette.mode === 'dark'
                                ? 'rgba(255,255,255,0.02)'
                                : 'grey.50',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {course.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {deadline.toLocaleDateString('cs-CZ', {
                            day: 'numeric',
                            month: 'short',
                          })}
                          {daysUntil >= 0 && ` • Za ${daysUntil} dní`}
                        </Typography>
                      </Box>
                      <Chip
                        label={course.category || 'Kurz'}
                        size="small"
                        sx={{
                          bgcolor: getCategoryColor(course.category),
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  );
                })}
            </Stack>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
