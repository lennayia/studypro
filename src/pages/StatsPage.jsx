import { Box, Typography, Grid, Card, CardContent, Stack, Chip, LinearProgress, Divider } from '@mui/material';
import { TrendingUp, Target, Clock, Award, AlertCircle, CheckCircle } from 'lucide-react';
import { useGamification } from '../contexts/GamificationContext';
import { useCourses } from '../contexts/CourseContext';
import { ProgressChart } from '../components/dashboard/ProgressChart';
import { formatDuration } from '../utils/helpers';
import { StatsCard } from '../../shared/src/components/common';

export const StatsPage = () => {
  const { studySessions } = useGamification();
  const { courses } = useCourses();

  // Celkový čas strávený studiem
  const totalMinutes = studySessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);

  // Data pro graf (poslední měsíc)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const dateStr = date.toISOString().split('T')[0];

    const sessionsOnDay = studySessions.filter((s) => s.session_date === dateStr);
    const totalMinutes = sessionsOnDay.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);

    return {
      name: date.getDate().toString(),
      value: totalMinutes,
    };
  });

  // Kategorie kurzů
  const categoryData = {};
  courses.forEach((course) => {
    const cat = course.category || 'Jiné';
    categoryData[cat] = (categoryData[cat] || 0) + 1;
  });

  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  // Advanced Statistics

  // 1. Completion Rate
  const completedCourses = courses.filter((c) => c.status === 'completed').length;
  const completionRate = courses.length > 0 ? Math.round((completedCourses / courses.length) * 100) : 0;

  // 2. Status Distribution
  const statusDistribution = {
    not_started: courses.filter((c) => c.status === 'not_started').length,
    in_progress: courses.filter((c) => c.status === 'in_progress').length,
    completed: courses.filter((c) => c.status === 'completed').length,
    paused: courses.filter((c) => c.status === 'paused').length,
  };

  const statusChartData = [
    { name: 'Nezačato', value: statusDistribution.not_started, fill: '#94a3b8' },
    { name: 'Probíhá', value: statusDistribution.in_progress, fill: '#6366f1' },
    { name: 'Dokončeno', value: statusDistribution.completed, fill: '#10b981' },
    { name: 'Pozastaveno', value: statusDistribution.paused, fill: '#f59e0b' },
  ].filter((item) => item.value > 0);

  // 3. Priority Distribution
  const priorityDistribution = {
    high: courses.filter((c) => (c.priority || 0) >= 4).length,
    medium: courses.filter((c) => (c.priority || 0) >= 2 && (c.priority || 0) < 4).length,
    low: courses.filter((c) => (c.priority || 0) < 2).length,
  };

  const priorityChartData = [
    { name: 'Vysoká', value: priorityDistribution.high, fill: '#ef4444' },
    { name: 'Střední', value: priorityDistribution.medium, fill: '#f59e0b' },
    { name: 'Nízká', value: priorityDistribution.low, fill: '#10b981' },
  ].filter((item) => item.value > 0);

  // 4. Deadline Tracking
  const today = new Date();
  const upcomingDeadlines = courses.filter((c) => {
    if (!c.deadline) return false;
    const deadline = new Date(c.deadline);
    return deadline >= today && deadline <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  }).length;

  const overdueDeadlines = courses.filter((c) => {
    if (!c.deadline || c.status === 'completed') return false;
    const deadline = new Date(c.deadline);
    return deadline < today;
  }).length;

  // 5. Average Progress
  const avgProgress = courses.length > 0
    ? Math.round(courses.reduce((sum, c) => sum + (c.progress_percentage || 0), 0) / courses.length)
    : 0;

  // 6. Top Performing Courses (by progress)
  const topCourses = courses
    .filter((c) => c.status !== 'completed')
    .sort((a, b) => (b.progress_percentage || 0) - (a.progress_percentage || 0))
    .slice(0, 5);

  // 7. Study Session Stats
  const avgSessionDuration = studySessions.length > 0
    ? Math.round(totalMinutes / studySessions.length)
    : 0;

  // 8. Best Day of Week
  const dayStats = {};
  studySessions.forEach((session) => {
    const day = new Date(session.session_date).getDay();
    dayStats[day] = (dayStats[day] || 0) + (session.duration_minutes || 0);
  });

  const bestDay = Object.entries(dayStats).sort((a, b) => b[1] - a[1])[0];
  const dayNames = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
  const bestDayName = bestDay ? dayNames[parseInt(bestDay[0])] : 'N/A';

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        📊 Pokročilé statistiky
      </Typography>

      {/* Primary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<Clock size={24} color="#6366f1" />}
            label="Celkový čas studia"
            value={formatDuration(totalMinutes)}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<Target size={24} color="#10b981" />}
            label="Míra dokončení"
            value={`${completionRate}%`}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<TrendingUp size={24} color="#f59e0b" />}
            label="Průměrný pokrok"
            value={`${avgProgress}%`}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            icon={<Award size={24} color="#ec4899" />}
            label="Nejlepší den"
            value={bestDayName}
          />
        </Grid>
      </Grid>

      {/* Secondary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom sx={{ fontSize: 14 }}>
                Studijních sezení
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {studySessions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography color="text.secondary" gutterBottom sx={{ fontSize: 14 }}>
                Průměr na sezení
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {formatDuration(avgSessionDuration)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <AlertCircle size={20} color="#f59e0b" />
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  Nadcházející deadliny
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {upcomingDeadlines}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                <AlertCircle size={20} color="#ef4444" />
                <Typography color="text.secondary" sx={{ fontSize: 14 }}>
                  Prošlé deadliny
                </Typography>
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                {overdueDeadlines}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Row 1 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <ProgressChart
            title="📈 Studijní aktivita (30 dní)"
            data={last30Days}
            type="area"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <ProgressChart
            title="📊 Kurzy podle statusu"
            data={statusChartData}
            type="pie"
          />
        </Grid>
      </Grid>

      {/* Charts Row 2 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <ProgressChart
            title="📚 Kurzy podle kategorií"
            data={categoryChartData}
            type="bar"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ProgressChart
            title="🎯 Distribuce priorit"
            data={priorityChartData}
            type="pie"
          />
        </Grid>
      </Grid>

      {/* Top Performing Courses */}
      {topCourses.length > 0 && (
        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              🏆 Top kurzy podle pokroku
            </Typography>
            <Stack spacing={2}>
              {topCourses.map((course, index) => (
                <Box key={course.id}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                      <Chip
                        label={`#${index + 1}`}
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 700, minWidth: 40 }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {course.title}
                        </Typography>
                        {course.category && (
                          <Typography variant="caption" color="text.secondary">
                            {course.category}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', minWidth: 60, textAlign: 'right' }}>
                      {course.progress_percentage || 0}%
                    </Typography>
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={course.progress_percentage || 0}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  {index < topCourses.length - 1 && <Divider sx={{ mt: 2 }} />}
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
