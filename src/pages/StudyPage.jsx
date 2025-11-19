import { Box, Typography, Grid, Card, CardContent, Stack, Chip } from '@mui/material';
import { Clock, Calendar, TrendingUp, Award } from 'lucide-react';
import { StudyTimer } from '../components/study/StudyTimer';
import { useStudySession } from '../contexts/StudySessionContext';
import { StatsCard } from '../../shared/src/components/common';

export const StudyPage = () => {
  const { sessions, getTodayStudyTime, getWeekStudyTime } = useStudySession();

  const todayMinutes = getTodayStudyTime();
  const weekMinutes = getWeekStudyTime();

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Recent sessions (last 10)
  const recentSessions = sessions.filter((s) => s.duration_minutes).slice(0, 10);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        ⏱️ Studijní timer
      </Typography>

      <Grid container spacing={3}>
        {/* Timer */}
        <Grid item xs={12} md={6}>
          <StudyTimer />
        </Grid>

        {/* Stats */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <StatsCard
              icon={<Clock size={24} color="#6366f1" />}
              label="Dnes"
              value={formatDuration(todayMinutes)}
            />
            <StatsCard
              icon={<Calendar size={24} color="#10b981" />}
              label="Tento týden"
              value={formatDuration(weekMinutes)}
            />
            <StatsCard
              icon={<TrendingUp size={24} color="#8b5cf6" />}
              label="Celkem sessions"
              value={sessions.length}
            />
            <StatsCard
              icon={<Award size={24} color="#f59e0b" />}
              label="Body za studium"
              value={Math.floor(weekMinutes / 5)}
            />
          </Stack>
        </Grid>

        {/* Recent sessions */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                📚 Poslední sessions
              </Typography>

              {recentSessions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    Zatím žádné studijní sessions. Začni svůj první timer výše! 🚀
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={2}>
                  {recentSessions.map((session) => (
                    <Box
                      key={session.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                          bgcolor: (theme) =>
                            theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'grey.50',
                        },
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {session.courses?.title || 'Obecné studium'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(session.start_time).toLocaleDateString('cs-CZ', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Typography>
                          {session.notes && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              {session.notes}
                            </Typography>
                          )}
                        </Box>
                        <Chip
                          label={formatDuration(session.duration_minutes)}
                          color="primary"
                          variant="outlined"
                          size="small"
                          icon={<Clock size={14} />}
                        />
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
