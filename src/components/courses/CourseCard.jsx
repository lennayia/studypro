import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import {
  MoreActionIcon,
  EditActionIcon,
  DeleteActionIcon,
  PlayActionIcon,
  CalendarMetaIcon,
  UserMetaIcon,
  PriceMetaIcon,
} from '../../../shared/src/components/icons';
import { useState } from 'react';
import {
  getCourseTypeLabel,
  getCourseStatusLabel,
  formatDate,
  getDeadlineStatus,
  getCategoryColor,
  getStatusColor,
  formatPrice,
} from '../../utils/helpers';

export const CourseCard = ({ course, onClick, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    handleMenuClose();
    onEdit(course);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    handleMenuClose();
    onDelete(course);
  };

  const deadlineStatus = getDeadlineStatus(course.access_until);
  const categoryColor = getCategoryColor(course.category);
  const statusColor = getStatusColor(course.status);

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      {/* Cover Image or Gradient */}
      <Box
        sx={{
          height: 140,
          background: course.cover_image_url
            ? `url(${course.cover_image_url})`
            : `linear-gradient(135deg, ${categoryColor}dd 0%, ${categoryColor} 100%)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'flex-end',
          p: 2,
          position: 'relative',
        }}
      >
        {/* More Menu */}
        <IconButton
          onClick={handleMenuOpen}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': { bgcolor: 'white' },
          }}
          size="small"
        >
          <MoreActionIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleEdit}>
            <ListItemIcon>
              <EditActionIcon />
            </ListItemIcon>
            Upravit
          </MenuItem>
          <MenuItem onClick={handleDelete}>
            <ListItemIcon>
              <DeleteActionIcon />
            </ListItemIcon>
            Smazat
          </MenuItem>
        </Menu>

        {/* Status Badge */}
        <Chip
          size="small"
          label={getCourseStatusLabel(course.status)}
          sx={{
            bgcolor: statusColor,
            color: 'white',
            fontWeight: 600,
          }}
        />
      </Box>

      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Title & Category */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600, lineHeight: 1.3 }}>
            {course.title}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
            {course.category && (
              <Chip
                size="small"
                label={course.category}
                sx={{
                  bgcolor: categoryColor + '20',
                  color: categoryColor,
                  fontWeight: 500,
                  fontSize: '0.7rem',
                }}
              />
            )}
            <Chip
              size="small"
              label={getCourseTypeLabel(course.course_type)}
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          </Box>

          {course.instructor && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <UserMetaIcon />
              <Typography variant="caption" color="text.secondary">
                {course.instructor}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Progress */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Pokrok
            </Typography>
            <Typography variant="caption" fontWeight={600}>
              {Math.round(course.progress_percentage || 0)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={course.progress_percentage || 0}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                bgcolor: statusColor,
              },
            }}
          />
          {course.total_lessons > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {course.completed_lessons || 0} z {course.total_lessons} lekcí
            </Typography>
          )}
        </Box>

        {/* Deadline */}
        {deadlineStatus && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <CalendarMetaIcon />
            <Typography variant="caption" color={`${deadlineStatus.color}.main`} fontWeight={600}>
              Přístup: {deadlineStatus.text}
            </Typography>
          </Box>
        )}

        {/* Price */}
        {course.price && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PriceMetaIcon />
            <Typography variant="caption" color="text.secondary">
              {formatPrice(course.price, course.currency)}
            </Typography>
          </Box>
        )}

        {/* Play Button */}
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: 'primary.main',
              fontWeight: 600,
              fontSize: '0.875rem',
            }}
          >
            <PlayActionIcon />
            {course.status === 'not_started' ? 'Začít studovat' : 'Pokračovat'}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
