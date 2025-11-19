import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Stack,
} from '@mui/material';
import { Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { NotificationSettings } from '../components/settings/NotificationSettings';

export const SettingsPage = () => {
  const { profile, signOut } = useAuth();
  const { mode, toggleTheme, isDark } = useTheme();

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
        ⚙️ Nastavení
      </Typography>

      <Stack spacing={3}>
        {/* Vzhled */}
        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Vzhled
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {isDark ? (
                  <Moon size={24} color="#a78bfa" />
                ) : (
                  <Sun size={24} color="#fbbf24" />
                )}
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Tmavý režim
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isDark ? 'Zapnuto' : 'Vypnuto'} • Automatická detekce systému
                  </Typography>
                </Box>
              </Box>

              <FormControlLabel
                control={<Switch checked={isDark} onChange={toggleTheme} />}
                label=""
              />
            </Box>
          </CardContent>
        </Card>

        {/* Notifikace */}
        <NotificationSettings />

        {/* Profil */}
        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Profil
            </Typography>

            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Jméno
                </Typography>
                <Typography variant="body1">{profile?.full_name}</Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{profile?.email}</Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Celkem bodů
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {profile?.total_points || 0}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Aktuální streak
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'warning.main' }}>
                  {profile?.current_streak || 0} dní 🔥
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Účet */}
        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Účet
            </Typography>

            <Button variant="outlined" color="error" onClick={signOut}>
              Odhlásit se
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};
