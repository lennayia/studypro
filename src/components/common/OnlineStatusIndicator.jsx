import React from 'react';
import { Box, Chip, Tooltip } from '@mui/material';
import { Wifi, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

/**
 * OnlineStatusIndicator - Displays online/offline status badge
 * Shows in header to inform users of connection status
 */
export const OnlineStatusIndicator = () => {
  const { isOnline } = useOnlineStatus();

  if (isOnline) {
    // Don't show anything when online (default state)
    return null;
  }

  // Show prominent badge when offline
  return (
    <Tooltip title="Používáte cached data. Změny se synchronizují po obnovení připojení.">
      <Chip
        icon={<WifiOff size={16} />}
        label="Offline"
        size="small"
        sx={{
          bgcolor: 'warning.main',
          color: 'warning.contrastText',
          fontWeight: 600,
          animation: 'pulse 2s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': {
              opacity: 1,
            },
            '50%': {
              opacity: 0.7,
            },
          },
        }}
      />
    </Tooltip>
  );
};

/**
 * OnlineStatusDot - Minimal dot indicator for online/offline
 * Useful for compact spaces like mobile header
 */
export const OnlineStatusDot = () => {
  const { isOnline } = useOnlineStatus();

  return (
    <Tooltip title={isOnline ? 'Online' : 'Offline - používáte cached data'}>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          bgcolor: isOnline ? 'success.main' : 'warning.main',
          boxShadow: isOnline
            ? '0 0 8px rgba(76, 175, 80, 0.6)'
            : '0 0 8px rgba(255, 152, 0, 0.6)',
          animation: isOnline ? 'none' : 'pulse 2s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': {
              transform: 'scale(1)',
              opacity: 1,
            },
            '50%': {
              transform: 'scale(1.2)',
              opacity: 0.7,
            },
          },
        }}
      />
    </Tooltip>
  );
};

/**
 * ConnectionStatus - Full status display with details
 * Use in Settings or Dashboard for detailed connection info
 */
export const ConnectionStatus = () => {
  const { isOnline } = useOnlineStatus();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1.5,
        borderRadius: 1,
        bgcolor: isOnline ? 'success.light' : 'warning.light',
        color: isOnline ? 'success.dark' : 'warning.dark',
        border: 1,
        borderColor: isOnline ? 'success.main' : 'warning.main',
      }}
    >
      {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
      <Box>
        <Box sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
          {isOnline ? 'Online' : 'Offline režim'}
        </Box>
        <Box sx={{ fontSize: '0.75rem', opacity: 0.8 }}>
          {isOnline
            ? 'Připojeno k internetu'
            : 'Používáte cached data - změny se synchronizují po obnovení připojení'}
        </Box>
      </Box>
    </Box>
  );
};
