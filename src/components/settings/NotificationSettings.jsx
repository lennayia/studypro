import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  Stack,
  Button,
  Alert,
  AlertTitle,
  Divider,
  FormControlLabel,
  Chip,
} from '@mui/material';
import { Bell, BellOff, CheckCircle, AlertCircle } from 'lucide-react';
import {
  requestNotificationPermission,
  getNotificationStatus,
  areNotificationsEnabled,
  sendNotification,
} from '../../utils/notifications';

export const NotificationSettings = () => {
  const [notificationStatus, setNotificationStatus] = useState(getNotificationStatus());
  const [settings, setSettings] = useState({
    deadlineReminders: true,
    studyReminders: true,
    milestoneNotifications: true,
    streakReminders: true,
  });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notificationSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationStatus(getNotificationStatus());

    if (granted) {
      // Send a test notification
      sendNotification('Notifikace aktivovány! 🎉', {
        body: 'Teď budeš dostávat upomínky a oznámení ze StudyPro.',
      });
    }
  };

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    // Save to localStorage
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings));
  };

  const handleTestNotification = () => {
    if (areNotificationsEnabled()) {
      sendNotification('Test notifikace! ✅', {
        body: 'Tvoje notifikace fungují správně. Výborně!',
      });
    }
  };

  const getStatusChip = () => {
    switch (notificationStatus) {
      case 'granted':
        return (
          <Chip
            icon={<CheckCircle size={16} />}
            label="Povoleno"
            color="success"
            size="small"
          />
        );
      case 'denied':
        return (
          <Chip
            icon={<AlertCircle size={16} />}
            label="Zakázáno"
            color="error"
            size="small"
          />
        );
      case 'default':
        return (
          <Chip
            icon={<AlertCircle size={16} />}
            label="Nevyžádáno"
            color="warning"
            size="small"
          />
        );
      case 'unsupported':
        return (
          <Chip
            icon={<AlertCircle size={16} />}
            label="Nepodporováno"
            color="default"
            size="small"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card sx={{ borderRadius: 4 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Bell size={24} color="#6366f1" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notifikace
            </Typography>
          </Box>
          {getStatusChip()}
        </Stack>

        {/* Permission Status */}
        {notificationStatus === 'unsupported' && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <AlertTitle>Prohlížeč nepodporuje notifikace</AlertTitle>
            Tvůj prohlížeč nepodporuje webové notifikace. Zvol moderní prohlížeč jako Chrome,
            Firefox nebo Edge.
          </Alert>
        )}

        {notificationStatus === 'denied' && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Notifikace jsou zakázány</AlertTitle>
            Povolil jsi notifikace v nastavení prohlížeče. Najdeš to v nastavení webu.
          </Alert>
        )}

        {notificationStatus === 'default' && (
          <Alert severity="info" sx={{ mb: 3 }} icon={<Bell size={20} />}>
            <AlertTitle>Povol notifikace</AlertTitle>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Aktivuj notifikace, abys dostal upomínky na deadliny, studijní připomínky a
              oznámení o milnících.
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<Bell size={16} />}
              onClick={handleEnableNotifications}
            >
              Povolit notifikace
            </Button>
          </Alert>
        )}

        {notificationStatus === 'granted' && (
          <>
            <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircle size={20} />}>
              <AlertTitle>Notifikace jsou aktivní!</AlertTitle>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Budeš dostávat oznámení podle svých nastavení níže.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                onClick={handleTestNotification}
              >
                Test notifikace
              </Button>
            </Alert>

            <Divider sx={{ mb: 3 }} />

            {/* Notification Settings */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
              Typy notifikací
            </Typography>

            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.deadlineReminders}
                    onChange={(e) =>
                      handleSettingChange('deadlineReminders', e.target.checked)
                    }
                    disabled={notificationStatus !== 'granted'}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Upomínky na deadliny</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Dostaneš upozornění 24 hodin a 3 dny před deadlinem kurzu
                    </Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.studyReminders}
                    onChange={(e) =>
                      handleSettingChange('studyReminders', e.target.checked)
                    }
                    disabled={notificationStatus !== 'granted'}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Studijní připomínky</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Denní upomínka na studium pro udržení streaku
                    </Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.milestoneNotifications}
                    onChange={(e) =>
                      handleSettingChange('milestoneNotifications', e.target.checked)
                    }
                    disabled={notificationStatus !== 'granted'}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Oznámení o milnících</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Upozornění při dosažení 50%, 75% a 100% pokroku v kurzu
                    </Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.streakReminders}
                    onChange={(e) =>
                      handleSettingChange('streakReminders', e.target.checked)
                    }
                    disabled={notificationStatus !== 'granted'}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Upomínky na streak</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Připomenutí pokud hrozí ztráta tvého studijního streaku
                    </Typography>
                  </Box>
                }
              />
            </Stack>
          </>
        )}

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'info.lighter',
            border: '1px solid',
            borderColor: 'info.main',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
            💡 Tip:
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Notifikace ti pomohou zůstat na správné cestě a nezapomenout na důležité deadliny!
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
