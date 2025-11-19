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
import { ProfileSettings } from '../components/settings/ProfileSettings';
import { DataManagement } from '../components/settings/DataManagement';
import { PWASettings } from '../components/settings/PWASettings';

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
        <ProfileSettings />

        {/* PWA & Offline */}
        <PWASettings />

        {/* Data Management */}
        <DataManagement />

        {/* Odhlášení */}
        <Card sx={{ borderRadius: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Odhlásit se
            </Typography>

            <Button variant="outlined" color="error" onClick={signOut} size="large">
              Odhlásit se z aplikace
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};
