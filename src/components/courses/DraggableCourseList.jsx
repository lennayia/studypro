import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  IconButton,
  Avatar,
  useTheme,
  alpha,
} from '@mui/material';
import { GripVertical, X } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { getCategoryColor } from '../../theme/theme';

// Sortable Item Component
const SortableCourseItem = ({ course }) => {
  const theme = useTheme();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: course.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const statusLabels = {
    not_started: 'Nezačato',
    in_progress: 'Probíhá',
    completed: 'Dokončeno',
    paused: 'Pozastaveno',
  };

  const statusColors = {
    not_started: 'default',
    in_progress: 'primary',
    completed: 'success',
    paused: 'warning',
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 2,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        cursor: isDragging ? 'grabbing' : 'grab',
        bgcolor: isDragging
          ? alpha(theme.palette.primary.main, 0.05)
          : 'background.paper',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: theme.shadows[2],
        },
        transition: 'all 0.2s',
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          {/* Drag Handle */}
          <Box
            {...attributes}
            {...listeners}
            sx={{
              cursor: 'grab',
              color: 'text.secondary',
              '&:active': { cursor: 'grabbing' },
              '&:hover': { color: 'primary.main' },
              transition: 'color 0.2s',
            }}
          >
            <GripVertical size={24} />
          </Box>

          {/* Priority Badge */}
          <Avatar
            sx={{
              width: 40,
              height: 40,
              bgcolor: 'primary.main',
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {course.priority}
          </Avatar>

          {/* Course Info */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {course.title}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
              {course.category && (
                <Chip
                  label={course.category}
                  size="small"
                  sx={{
                    bgcolor: getCategoryColor(course.category),
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              )}
              <Chip
                label={statusLabels[course.status] || course.status}
                size="small"
                color={statusColors[course.status] || 'default'}
                variant="outlined"
              />
              {course.lecturer && (
                <Chip
                  label={course.lecturer}
                  size="small"
                  variant="outlined"
                />
              )}
            </Stack>
          </Box>

          {/* Progress */}
          {course.progress_percentage !== undefined && (
            <Box sx={{ textAlign: 'right', minWidth: 60 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {course.progress_percentage}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                pokrok
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export const DraggableCourseList = ({ courses: initialCourses, onReorder, onClose }) => {
  const [courses, setCourses] = useState(initialCourses);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setCourses((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Update priorities based on new order (1-based)
        const updatedCourses = newOrder.map((course, index) => ({
          ...course,
          priority: index + 1,
        }));

        // Call onReorder callback with updated courses
        if (onReorder) {
          onReorder(updatedCourses);
        }

        return updatedCourses;
      });
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            Přeuspořádat priority
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Přetáhni kurzy pro změnu jejich priority. První kurz = priorita 1.
          </Typography>
        </Box>
        {onClose && (
          <IconButton onClick={onClose}>
            <X size={24} />
          </IconButton>
        )}
      </Box>

      {/* Draggable List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={courses.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {courses.map((course) => (
            <SortableCourseItem key={course.id} course={course} />
          ))}
        </SortableContext>
      </DndContext>

      {/* Info */}
      <Box
        sx={{
          mt: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: 'info.lighter',
          border: '1px solid',
          borderColor: 'info.main',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          💡 Tip:
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Priority se automaticky ukládají při přesunutí kurzu. Kurz na první pozici má
          prioritu 1 (nejvyšší).
        </Typography>
      </Box>
    </Box>
  );
};
