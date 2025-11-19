import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  Alert,
  AlertTitle,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Chip,
} from '@mui/material';
import { Download, Upload, Trash2, Database, AlertTriangle } from 'lucide-react';
import { useCourses } from '../../contexts/CourseContext';
import { useGamification } from '../../contexts/GamificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../utils/supabase';

export const DataManagement = () => {
  const { courses } = useCourses();
  const { studySessions, achievements } = useGamification();
  const { profile, signOut } = useAuth();

  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Export all data to JSON
  const handleExportData = async () => {
    setExporting(true);
    setError(null);

    try {
      const exportData = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        profile: {
          full_name: profile?.full_name,
          email: profile?.email,
          bio: profile?.bio,
          total_points: profile?.total_points,
          current_streak: profile?.current_streak,
          longest_streak: profile?.longest_streak,
        },
        courses: courses,
        studySessions: studySessions,
        achievements: achievements,
      };

      // Create blob and download
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `studypro-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess('Data byla úspěšně exportována!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Export error:', err);
      setError('Chyba při exportu dat: ' + err.message);
    } finally {
      setExporting(false);
    }
  };

  // Export courses to CSV
  const handleExportCSV = () => {
    try {
      const headers = [
        'title',
        'lecturer',
        'category',
        'status',
        'priority',
        'deadline',
        'description',
        'progress_percentage',
        'estimated_hours',
        'course_type',
      ];

      const rows = courses.map((course) => [
        course.title || '',
        course.lecturer || '',
        course.category || '',
        course.status || '',
        course.priority || 0,
        course.deadline || '',
        course.description || '',
        course.progress_percentage || 0,
        course.estimated_hours || '',
        course.course_type || '',
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row) =>
          row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `studypro-courses-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccess('CSV bylo úspěšně exportováno!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('CSV export error:', err);
      setError('Chyba při exportu CSV: ' + err.message);
    }
  };

  // Import data from JSON
  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImporting(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importData = JSON.parse(e.target.result);

        // Validate data structure
        if (!importData.version || !importData.courses) {
          throw new Error('Neplatný formát souboru');
        }

        // Note: Import would require recreating all courses, sessions, etc.
        // This is a simplified version - in production you'd want to:
        // 1. Show preview of data to import
        // 2. Allow user to select what to import
        // 3. Handle conflicts/duplicates
        // 4. Batch insert with proper error handling

        setSuccess(
          `Nalezeno ${importData.courses.length} kurzů k importu. Import dat je momentálně ve vývoji.`
        );
        setTimeout(() => setSuccess(null), 5000);
      } catch (err) {
        console.error('Import error:', err);
        setError('Chyba při importu dat: ' + err.message);
      } finally {
        setImporting(false);
      }
    };

    reader.readAsText(file);
  };

  // Delete all user data
  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError(null);

    try {
      // Delete user data in order (respecting foreign keys)
      // 1. Delete study sessions
      await supabase.from('study_sessions').delete().eq('user_id', profile.id);

      // 2. Delete course lessons
      const { data: userCourses } = await supabase
        .from('courses')
        .select('id')
        .eq('user_id', profile.id);

      if (userCourses && userCourses.length > 0) {
        const courseIds = userCourses.map((c) => c.id);
        await supabase.from('course_lessons').delete().in('course_id', courseIds);
        await supabase.from('course_notes').delete().in('course_id', courseIds);
      }

      // 3. Delete courses
      await supabase.from('courses').delete().eq('user_id', profile.id);

      // 4. Delete goals
      await supabase.from('goals').delete().eq('user_id', profile.id);

      // 5. Delete achievements
      await supabase.from('user_achievements').delete().eq('user_id', profile.id);

      // 6. Delete profile
      await supabase.from('profiles').delete().eq('id', profile.id);

      // 7. Sign out
      await signOut();
    } catch (err) {
      console.error('Delete account error:', err);
      setError('Chyba při mazání účtu: ' + err.message);
      setDeleting(false);
    }
  };

  const dataStats = {
    courses: courses.length,
    sessions: studySessions.length,
    achievements: achievements.filter((a) => a.unlocked_at).length,
  };

  return (
    <Card sx={{ borderRadius: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Database size={24} color="#6366f1" />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Správa dat
          </Typography>
        </Box>

        {/* Messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        {/* Data Stats */}
        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            bgcolor: 'background.default',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Tvoje data
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Chip label={`${dataStats.courses} kurzů`} color="primary" />
            <Chip label={`${dataStats.sessions} sezení`} color="info" />
            <Chip label={`${dataStats.achievements} achievementů`} color="success" />
          </Stack>
        </Box>

        <Stack spacing={3}>
          {/* Export Section */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Export dat
            </Typography>

            <Stack spacing={2}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Download size={20} />}
                onClick={handleExportData}
                disabled={exporting}
              >
                {exporting ? 'Exportuji...' : 'Exportovat všechna data (JSON)'}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                startIcon={<Download size={20} />}
                onClick={handleExportCSV}
                disabled={courses.length === 0}
              >
                Exportovat kurzy (CSV)
              </Button>

              <Alert severity="info" sx={{ fontSize: 14 }}>
                <Typography variant="body2">
                  Export obsahuje všechny tvoje kurzy, studijní sezení, achievementy a profil.
                  Data jsou ve formátu JSON a můžeš je později naimportovat zpět.
                </Typography>
              </Alert>
            </Stack>
          </Box>

          <Divider />

          {/* Import Section */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Import dat
            </Typography>

            <Button
              variant="outlined"
              fullWidth
              component="label"
              startIcon={<Upload size={20} />}
              disabled={importing}
            >
              {importing ? 'Importuji...' : 'Importovat data (JSON)'}
              <input
                type="file"
                hidden
                accept=".json"
                onChange={handleImportData}
              />
            </Button>

            {importing && <LinearProgress sx={{ mt: 2 }} />}

            <Alert severity="warning" sx={{ mt: 2, fontSize: 14 }}>
              <Typography variant="body2">
                Import dat je ve vývoji. Aktuálně můžeš importovat pouze kurzy přes CSV import
                na stránce Kurzy.
              </Typography>
            </Alert>
          </Box>

          <Divider />

          {/* Delete Account Section */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'error.main' }}>
              Nebezpečná zóna
            </Typography>

            <Alert severity="error" sx={{ mb: 2 }}>
              <AlertTitle>Smazat účet</AlertTitle>
              Tato akce je nevratná. Všechna tvoje data budou permanentně smazána.
            </Alert>

            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<Trash2 size={20} />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Smazat můj účet a všechna data
            </Button>
          </Box>
        </Stack>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => !deleting && setDeleteDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AlertTriangle size={24} color="#ef4444" />
            Opravdu chceš smazat svůj účet?
          </DialogTitle>
          <DialogContent>
            <Alert severity="error" sx={{ mb: 2 }}>
              <AlertTitle>Varování!</AlertTitle>
              Tato akce je nevratná. Budou smazána všechna tvoje data:
            </Alert>

            <Stack spacing={1} sx={{ pl: 2 }}>
              <Typography variant="body2">• {dataStats.courses} kurzů</Typography>
              <Typography variant="body2">• {dataStats.sessions} studijních sezení</Typography>
              <Typography variant="body2">• {dataStats.achievements} achievementů</Typography>
              <Typography variant="body2">• Profil a všechna nastavení</Typography>
            </Stack>

            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                💡 Tip: Před smazáním si raději exportuj svá data, kdyby ses rozhodl vrátit.
              </Typography>
            </Alert>

            {deleting && <LinearProgress sx={{ mt: 2 }} />}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
              Zrušit
            </Button>
            <Button
              onClick={handleDeleteAccount}
              color="error"
              variant="contained"
              disabled={deleting}
            >
              {deleting ? 'Mažu...' : 'Ano, smazat vše'}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};
