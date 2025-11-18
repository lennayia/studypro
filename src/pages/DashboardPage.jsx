import { Grid, Box, Typography, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, CheckCircle, TrendingUp, Percent, Plus } from 'lucide-react';
import { useCourses } from '../contexts/CourseContext';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import { LoadingSpinner, StatsCard, EmptyState } from '../../shared/src/components/common';
import { StreakDisplay } from '../components/dashboard/StreakDisplay';
import { ProgressChart } from '../components/dashboard/ProgressChart';
import { CourseCard } from '../components/courses/CourseCard';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { courses, loading } = useCourses();
  const { studySessions } = useGamification();

  if (loading) return <LoadingSpinner size={60} message="Načítám tvůj dashboard..." />;

  // Statistiky
  const totalCourses = courses.length;
  const completedCourses = courses.filter((c) => c.status === 'completed').length;
  const inProgressCourses = courses.filter((c) => c.status === 'in_progress').length;
  const avgProgress =
    courses.length > 0
      ? Math.round(courses.reduce((sum, c) => sum + (c.progress_percentage || 0), 0) / courses.length)
      : 0;

  // Aktivní kurzy (top 3)
  const activeCourses = courses
    .filter((c) => c.status === 'in_progress')
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, 3);

  // Data pro graf (poslední týden)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];

    const sessionsOnDay = studySessions.filter((s) => s.session_date === dateStr);
    const totalMinutes = sessionsOnDay.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);

    return {
      name: ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'][date.getDay()],
      value: totalMinutes,
    };
  });

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Vítej zpět, {profile?.full_name?.split(' ')[0]}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Pojďme se podívat na tvůj studijní pokrok
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Celkem kurzů"
            value={totalCourses}
            icon={<GraduationCap size={24} />}
            color="primary"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Dokončeno"
            value={completedCourses}
            icon={<CheckCircle size={24} />}
            color="success"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Probíhá"
            value={inProgressCourses}
            icon={<TrendingUp size={24} />}
            color="info"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Průměrný pokrok"
            value={`${avgProgress}%`}
            icon={<Percent size={24} />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Streak & Chart */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StreakDisplay
            currentStreak={profile?.current_streak || 0}
            longestStreak={profile?.longest_streak || 0}
            lastActivityDate={profile?.last_activity_date}
          />
        </Grid>

        <Grid item xs={12} md={8}>
          <ProgressChart
            title="📊 Tvoje studijní aktivita (poslední týden)"
            data={last7Days}
            type="area"
            dataKey="value"
          />
        </Grid>
      </Grid>

      {/* Active Courses */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            🔥 Aktivní kurzy
          </Typography>
          <Button
            variant="contained"
            startIcon={<Plus size={20} />}
            onClick={() => navigate('/courses')}
          >
            Přidat kurz
          </Button>
        </Box>

        {activeCourses.length > 0 ? (
          <Grid container spacing={3}>
            {activeCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course.id}>
                <CourseCard
                  course={course}
                  onClick={() => navigate(`/courses/${course.id}`)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card>
            <CardContent>
              <EmptyState
                icon="📚"
                title="Žádné aktivní kurzy"
                description="Začni studovat! Přidej svůj první kurz a rozjeď svou studijní kariéru."
                actionLabel="Přidat kurz"
                onAction={() => navigate('/courses')}
              />
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            ⚡ Rychlé akce
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/courses')}
                sx={{ py: 2 }}
              >
                📚 Všechny kurzy
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/goals')}
                sx={{ py: 2 }}
              >
                🎯 Moje cíle
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/stats')}
                sx={{ py: 2 }}
              >
                📊 Statistiky
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate('/settings')}
                sx={{ py: 2 }}
              >
                ⚙️ Nastavení
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
