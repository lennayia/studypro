import { Box, Typography, Paper, Slide } from '@mui/material';
import { WifiOff, Wifi } from 'lucide-react';
import { useOffline } from '../../hooks/useOffline';

/**
 * OfflineIndicator - Shows banner when app is offline
 *
 * Usage: Add to Layout component
 */
export const OfflineIndicator = () => {
  const { isOffline, isOnline } = useOffline();

  return (
    <>
      {/* Offline banner */}
      <Slide direction="down" in={isOffline} mountOnEnter unmountOnExit>
        <Paper
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            bgcolor: 'error.main',
            color: 'white',
            py: 1.5,
            px: 3,
            borderRadius: 0,
            boxShadow: 4,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
            }}
          >
            <WifiOff size={20} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Bez připojení k internetu
            </Typography>
            <Typography variant="caption">
              Některé funkce nemusí fungovat
            </Typography>
          </Box>
        </Paper>
      </Slide>

      {/* Online toast (briefly when connection restored) */}
      {/* You can add a success toast using NotificationContext here if needed */}
    </>
  );
};
