import { Box, Card, CardContent, Typography, Grid, Chip, LinearProgress, Stack } from '@mui/material';
import { Trophy, Lock, Check } from 'lucide-react';
import { useGamification } from '../../contexts/GamificationContext';
import { ACHIEVEMENT_DEFINITIONS } from '../../utils/achievementTriggers';

export const AchievementsList = () => {
  const { achievements } = useGamification();

  // Get unlocked achievement IDs
  const unlockedIds = achievements
    .filter((a) => a.unlocked_at)
    .map((a) => a.achievement_id);

  const totalAchievements = Object.keys(ACHIEVEMENT_DEFINITIONS).length;
  const unlockedCount = unlockedIds.length;
  const progress = Math.round((unlockedCount / totalAchievements) * 100);

  const getAchievementIcon = (key) => {
    const icons = {
      first_course: '📚',
      five_courses: '📚',
      ten_courses: '📚',
      first_completion: '✅',
      five_completions: '✅',
      ten_completions: '✅',
      streak_7: '🔥',
      streak_30: '🔥',
      streak_100: '🔥',
      first_session: '⏱️',
      marathon: '🏃',
      early_bird: '🐦',
      night_owl: '🦉',
      points_100: '⭐',
      points_500: '⭐',
      points_1000: '⭐',
      first_goal: '🎯',
      goal_achiever: '🎯',
      perfectionist: '💯',
      speed_demon: '⚡',
    };
    return icons[key] || '🏆';
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Trophy size={24} color="#6366f1" />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Achievementy
        </Typography>
        <Chip
          label={`${unlockedCount}/${totalAchievements}`}
          color="primary"
          size="small"
          sx={{ ml: 'auto' }}
        />
      </Box>

      {/* Progress */}
      <Card sx={{ mb: 3, borderRadius: 3, bgcolor: 'background.default' }}>
        <CardContent>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Celkový pokrok
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {progress}%
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
          </Stack>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <Grid container spacing={2}>
        {Object.entries(ACHIEVEMENT_DEFINITIONS).map(([key, achievement]) => {
          const isUnlocked = unlockedIds.includes(achievement.id);
          const unlockedAchievement = achievements.find((a) => a.achievement_id === achievement.id);

          return (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: isUnlocked ? 'success.main' : 'divider',
                  bgcolor: isUnlocked ? 'success.lighter' : 'background.paper',
                  position: 'relative',
                  transition: 'all 0.2s',
                  filter: isUnlocked ? 'none' : 'grayscale(0.8) opacity(0.6)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                }}
              >
                <CardContent>
                  {/* Status Icon */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: isUnlocked ? 'success.main' : 'grey.300',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    {isUnlocked ? <Check size={18} /> : <Lock size={18} />}
                  </Box>

                  {/* Icon */}
                  <Box
                    sx={{
                      fontSize: 48,
                      textAlign: 'center',
                      mb: 2,
                    }}
                  >
                    {getAchievementIcon(key)}
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 1,
                      textAlign: 'center',
                      fontSize: '1rem',
                    }}
                  >
                    {achievement.message}
                  </Typography>

                  {/* Unlocked Date */}
                  {isUnlocked && unlockedAchievement?.unlocked_at && (
                    <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', display: 'block' }}>
                      Odemčeno: {new Date(unlockedAchievement.unlocked_at).toLocaleDateString('cs-CZ')}
                    </Typography>
                  )}

                  {/* Locked State */}
                  {!isUnlocked && (
                    <Chip
                      label="Zamčeno"
                      size="small"
                      sx={{
                        mt: 1,
                        width: '100%',
                        bgcolor: 'grey.200',
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Empty State */}
      {achievements.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Trophy size={64} color="#d1d5db" />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Začni studovat a odemkni achievementy!
          </Typography>
        </Box>
      )}
    </Box>
  );
};
