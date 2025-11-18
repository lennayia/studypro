import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { useGamification } from '../contexts/GamificationContext';
import { useCourses } from '../contexts/CourseContext';
import { ProgressChart } from '../components/dashboard/ProgressChart';
import { formatDuration } from '../utils/helpers';

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

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        📊 Statistiky
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Celkový čas studia
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {formatDuration(totalMinutes)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Studijních sezení
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {studySessions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Průměr na sezení
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {studySessions.length > 0
                  ? formatDuration(Math.round(totalMinutes / studySessions.length))
                  : '0 min'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Kategorií
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {Object.keys(categoryData).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ProgressChart
            title="📈 Studijní aktivita (30 dní)"
            data={last30Days}
            type="area"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <ProgressChart
            title="📚 Kurzy podle kategorií"
            data={categoryChartData}
            type="bar"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
