import { useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Chip, LinearProgress, Button, IconButton } from '@mui/material';
import {
  GoalsPageIcon,
  StarDisplayIcon,
  AchievementsSectionIcon,
  GoalsSectionIcon,
  AddButtonIcon,
  EditActionIcon,
  DeleteActionIcon,
} from '../../shared/src/components/icons';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import { LoadingSpinner } from '../../shared/src/components/common';
import { GoalForm } from '../components/goals/GoalForm';
import { getLevelFromPoints, getStreakEmoji, formatDate } from '../utils/helpers';

export const GoalsPage = () => {
  const { profile } = useAuth();
  const { achievements, userAchievements, goals, loading, createGoal, updateGoal, deleteGoal } = useGamification();
  const [formOpen, setFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  if (loading) return <LoadingSpinner size={60} message="Načítám úspěchy..." />;

  const level = getLevelFromPoints(profile?.total_points || 0);
  const unlockedAchievementIds = new Set(userAchievements.map((ua) => ua.achievement_id));

  const handleCreateGoal = async (data) => {
    const result = await createGoal(data);
    if (result.success) {
      setFormOpen(false);
    }
  };

  const handleUpdateGoal = async (data) => {
    const result = await updateGoal(editingGoal.id, data);
    if (result.success) {
      setFormOpen(false);
      setEditingGoal(null);
    }
  };

  const handleDeleteGoal = async (goal) => {
    if (window.confirm(`Opravdu chceš smazat cíl "${goal.title}"?`)) {
      await deleteGoal(goal.id);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingGoal(null);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <GoalsPageIcon />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Cíle & Úspěchy
        </Typography>
      </Box>

      {/* Level Card */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)', color: 'white' }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 700, mb: 1 }}>
                  {level}
                </Typography>
                <Typography variant="h6">Level</Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                  <StarDisplayIcon fill="currentColor" />
                  {profile?.total_points || 0}
                </Typography>
                <Typography variant="body1">Celkem bodů</Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {profile?.current_streak || 0} {getStreakEmoji(profile?.current_streak || 0)}
                </Typography>
                <Typography variant="body1">Dnů v řadě</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Rekord: {profile?.longest_streak || 0} dní
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <AchievementsSectionIcon />
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Odznaky ({userAchievements.length}/{achievements.length})
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {achievements.map((achievement) => {
            const isUnlocked = unlockedAchievementIds.has(achievement.id);

            return (
              <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                <Card
                  sx={{
                    opacity: isUnlocked ? 1 : 0.5,
                    border: isUnlocked ? 2 : 0,
                    borderColor: 'primary.main',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 2 }}>
                      <Box
                        sx={{
                          fontSize: '3rem',
                          filter: isUnlocked ? 'none' : 'grayscale(100%)',
                        }}
                      >
                        {achievement.icon}
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 600 }}>
                          {achievement.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {achievement.description}
                        </Typography>

                        <Chip
                          size="small"
                          label={`${achievement.points} bodů`}
                          color={isUnlocked ? 'primary' : 'default'}
                        />

                        {isUnlocked && (
                          <Chip
                            size="small"
                            label="✓ Odemčeno"
                            color="success"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Goals */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <GoalsSectionIcon />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Moje cíle
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddButtonIcon />}
            onClick={() => setFormOpen(true)}
          >
            Přidat cíl
          </Button>
        </Box>

        {goals.length > 0 ? (
          <Grid container spacing={2}>
            {goals.map((goal) => {
              const progress = goal.target_value > 0
                ? (goal.current_value / goal.target_value) * 100
                : 0;

              return (
                <Grid item xs={12} md={6} key={goal.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                          {goal.title}
                        </Typography>
                        <Box>
                          <IconButton size="small" onClick={() => handleEdit(goal)}>
                            <EditActionIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDeleteGoal(goal)}>
                            <DeleteActionIcon />
                          </IconButton>
                        </Box>
                      </Box>

                      {goal.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {goal.description}
                        </Typography>
                      )}

                      <Box sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Pokrok
                          </Typography>
                          <Typography variant="caption" fontWeight={600}>
                            {goal.current_value} / {goal.target_value}
                          </Typography>
                        </Box>

                        <LinearProgress
                          variant="determinate"
                          value={Math.min(progress, 100)}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                        {goal.deadline && (
                          <Typography variant="caption" color="text.secondary">
                            Deadline: {formatDate(goal.deadline)}
                          </Typography>
                        )}

                        <Chip
                          size="small"
                          label={goal.status === 'active' ? 'Aktivní' : goal.status === 'completed' ? 'Dokončeno' : 'Zrušeno'}
                          color={goal.status === 'active' ? 'primary' : goal.status === 'completed' ? 'success' : 'default'}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 6 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Zatím žádné cíle
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Přidej si studijní cíle a motivuj se k jejich splnění!
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddButtonIcon />}
                onClick={() => setFormOpen(true)}
              >
                Přidat první cíl
              </Button>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Goal Form Dialog */}
      <GoalForm
        open={formOpen}
        onClose={handleCloseForm}
        onSubmit={editingGoal ? handleUpdateGoal : handleCreateGoal}
        initialData={editingGoal}
      />
    </Box>
  );
};
