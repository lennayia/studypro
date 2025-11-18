import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { LocalFireDepartment as FireIcon } from '@mui/icons-material';
import { getStreakEmoji } from '../../utils/helpers';

export const StreakDisplay = ({ currentStreak, longestStreak, lastActivityDate }) => {
  const streakPercentage = longestStreak > 0 ? (currentStreak / longestStreak) * 100 : 0;

  return (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
        color: 'white',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FireIcon sx={{ fontSize: 40 }} />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {currentStreak} {getStreakEmoji(currentStreak)}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Dnů v řadě
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            Tvůj rekord: {longestStreak} dní
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={Math.min(streakPercentage, 100)}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'rgba(255, 255, 255, 0.2)',
            '& .MuiLinearProgress-bar': {
              bgcolor: 'white',
              borderRadius: 4,
            },
          }}
        />

        {currentStreak === 0 && (
          <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.9 }}>
            💡 Začni studovat a rozjeď svou šňůru!
          </Typography>
        )}

        {currentStreak >= 7 && (
          <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.9 }}>
            🎉 Skvělá práce! Udržuj tempo!
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
