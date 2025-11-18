import { Box, Typography, Card, CardContent, Button, Divider } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export const SettingsPage = () => {
  const { profile, signOut } = useAuth();

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        ⚙️ Nastavení
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Profil
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Jméno
            </Typography>
            <Typography variant="body1">{profile?.full_name}</Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">{profile?.email}</Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Celkem bodů
            </Typography>
            <Typography variant="body1">{profile?.total_points || 0}</Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Aktuální streak
            </Typography>
            <Typography variant="body1">{profile?.current_streak || 0} dní</Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Button
            variant="outlined"
            color="error"
            onClick={signOut}
          >
            Odhlásit se
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};
