import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import {
  Wifi,
  WifiOff,
  Download,
  Trash2,
  RefreshCw,
  HardDrive,
  CheckCircle,
} from 'lucide-react';
import {
  useOnlineStatus,
  usePWAInstall,
  useServiceWorker,
} from '../../hooks/useOnlineStatus';
import { ConnectionStatus } from '../common/OnlineStatusIndicator';

/**
 * PWASettings - Settings section for PWA features
 * Shows online status, install prompt, cache management
 */
export const PWASettings = () => {
  const { isOnline } = useOnlineStatus();
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const { isServiceWorkerReady, serviceWorkerStatus, updateServiceWorker, clearCache } =
    useServiceWorker();

  return (
    <Card sx={{ borderRadius: 4 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Offline & Instalace
        </Typography>

        <Stack spacing={3}>
          {/* Connection Status */}
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, fontWeight: 600 }}
            >
              Stav připojení
            </Typography>
            <ConnectionStatus />
          </Box>

          <Divider />

          {/* PWA Installation */}
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, fontWeight: 600 }}
            >
              Instalace aplikace
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.default',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Download size={20} color={isInstalled ? '#4caf50' : '#666'} />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {isInstalled ? 'Aplikace nainstalována' : 'Nainstalovat aplikaci'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isInstalled
                      ? 'StudyPro je nainstalována jako PWA'
                      : 'Používejte StudyPro jako nativní aplikaci'}
                  </Typography>
                </Box>
              </Box>

              {isInstalled ? (
                <Chip
                  icon={<CheckCircle size={16} />}
                  label="Nainstalováno"
                  color="success"
                  size="small"
                />
              ) : isInstallable ? (
                <Button
                  variant="contained"
                  size="small"
                  onClick={promptInstall}
                  startIcon={<Download size={16} />}
                >
                  Nainstalovat
                </Button>
              ) : (
                <Chip label="Není k dispozici" size="small" variant="outlined" />
              )}
            </Box>

            {!isInstalled && !isInstallable && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 1, ml: 1 }}
              >
                💡 Tip: Instalace je dostupná v Chrome, Edge a Safari na iOS
              </Typography>
            )}
          </Box>

          <Divider />

          {/* Service Worker & Cache */}
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, fontWeight: 600 }}
            >
              Cache & Offline podpora
            </Typography>

            {/* Service Worker Status */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.default',
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <HardDrive
                  size={20}
                  color={isServiceWorkerReady ? '#4caf50' : '#666'}
                />
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Service Worker
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {serviceWorkerStatus === 'ready' && 'Aktivní - offline podpora zapnuta'}
                    {serviceWorkerStatus === 'checking' && 'Kontrola...'}
                    {serviceWorkerStatus === 'not-supported' && 'Není podporováno'}
                    {serviceWorkerStatus === 'updated' && 'Nová verze dostupná'}
                  </Typography>
                </Box>
              </Box>

              <Chip
                label={
                  serviceWorkerStatus === 'ready'
                    ? 'Aktivní'
                    : serviceWorkerStatus === 'updated'
                    ? 'Aktualizace'
                    : 'Neaktivní'
                }
                color={isServiceWorkerReady ? 'success' : 'default'}
                size="small"
              />
            </Box>

            {/* Cache Management Buttons */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={updateServiceWorker}
                startIcon={<RefreshCw size={16} />}
                disabled={!isServiceWorkerReady}
                sx={{ flex: 1 }}
              >
                Zkontrolovat aktualizace
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={clearCache}
                startIcon={<Trash2 size={16} />}
                disabled={!isServiceWorkerReady}
                color="warning"
                sx={{ flex: 1 }}
              >
                Vymazat cache
              </Button>
            </Stack>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 1.5, ml: 1 }}
            >
              ℹ️ Cache obsahuje data pro offline použití. Vymazání může pomoci s
              problémy, ale sníží rychlost načítání.
            </Typography>
          </Box>

          {/* Offline Info */}
          {!isOnline && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'warning.light',
                color: 'warning.dark',
                display: 'flex',
                gap: 1,
              }}
            >
              <WifiOff size={20} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Offline režim aktivní
                </Typography>
                <Typography variant="caption">
                  Používáte cached data. Změny se synchronizují po obnovení připojení.
                </Typography>
              </Box>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
