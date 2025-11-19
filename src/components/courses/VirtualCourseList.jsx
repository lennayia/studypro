import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Box, Card, CardContent, Typography, Chip, LinearProgress, Stack, Avatar } from '@mui/material';
import { BookOpen, Clock, Target } from 'lucide-react';
import { format } from 'date-fns';
import { cs } from 'date-fns/locale';

/**
 * Virtualized course list for better performance with large datasets
 * Only renders visible items + small buffer
 */
export const VirtualCourseList = ({ courses, onCourseClick, itemHeight = 140 }) => {
  const STATUS_LABELS = {
    not_started: { label: 'Nezačato', color: 'default' },
    in_progress: { label: 'Probíhá', color: 'primary' },
    completed: { label: 'Dokončeno', color: 'success' },
    paused: { label: 'Pozastaveno', color: 'warning' },
  };

  const PRIORITY_COLORS = {
    1: '#ef4444', // red
    2: '#f97316', // orange
    3: '#eab308', // yellow
    4: '#84cc16', // lime
    5: '#22c55e', // green
  };

  // Row renderer
  const Row = ({ index, style }) => {
    const course = courses[index];

    return (
      <div style={style}>
        <Box sx={{ px: 2, py: 1 }}>
          <Card
            sx={{
              borderRadius: 3,
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 3,
                borderColor: 'primary.main',
              },
            }}
            onClick={() => onCourseClick && onCourseClick(course)}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="flex-start">
                {/* Priority Avatar */}
                <Avatar
                  sx={{
                    bgcolor: PRIORITY_COLORS[course.priority] || 'grey.400',
                    width: 48,
                    height: 48,
                    fontWeight: 700,
                  }}
                >
                  {course.priority || '?'}
                </Avatar>

                {/* Course Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {/* Title & Status */}
                  <Stack direction="row" justifyContent="space-between" alignItems="start" sx={{ mb: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                      }}
                    >
                      {course.title}
                    </Typography>
                    <Chip
                      label={STATUS_LABELS[course.status]?.label || course.status}
                      color={STATUS_LABELS[course.status]?.color || 'default'}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Stack>

                  {/* Lecturer & Category */}
                  <Stack direction="row" spacing={2} sx={{ mb: 1.5 }}>
                    {course.lecturer && (
                      <Typography variant="body2" color="text.secondary">
                        👨‍🏫 {course.lecturer}
                      </Typography>
                    )}
                    {course.category && (
                      <Chip label={course.category} size="small" variant="outlined" />
                    )}
                  </Stack>

                  {/* Progress Bar */}
                  <Box sx={{ mb: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Pokrok
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {course.progress_percentage || 0}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={course.progress_percentage || 0}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>

                  {/* Meta Info */}
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    {course.estimated_hours && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Clock size={14} color="#9ca3af" />
                        <Typography variant="caption" color="text.secondary">
                          {course.estimated_hours}h
                        </Typography>
                      </Box>
                    )}
                    {course.deadline && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Target size={14} color="#9ca3af" />
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(course.deadline), 'd. MMM yyyy', { locale: cs })}
                        </Typography>
                      </Box>
                    )}
                    {course.course_type && (
                      <Chip label={course.course_type} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                    )}
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </div>
    );
  };

  // Empty state
  if (!courses || courses.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <BookOpen size={64} color="#d1d5db" />
        <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
          Žádné kurzy nenalezeny
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', minHeight: 400 }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={courses.length}
            itemSize={itemHeight}
            width={width}
            overscanCount={3} // Render 3 extra items above and below viewport
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </Box>
  );
};
