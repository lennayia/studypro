import { Box, Typography, Button } from '@mui/material';

export const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        textAlign: 'center',
        p: 4,
      }}
    >
      <Box sx={{ fontSize: '4rem', mb: 2, opacity: 0.5 }}>
        {icon}
      </Box>

      <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
        {title}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
        {description}
      </Typography>

      {actionLabel && onAction && (
        <Button
          variant="contained"
          size="large"
          onClick={onAction}
          sx={{ borderRadius: 3 }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};
