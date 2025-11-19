import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
  Slide,
} from '@mui/material';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/useOnlineStatus';

/**
 * PWAInstallPrompt - Banner promoting PWA installation
 * Shows when app is installable and user hasn't installed yet
 * Can be dismissed and respects user preference
 */
export const PWAInstallPrompt = () => {
  const { isInstallable, promptInstall } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user previously dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Show banner after 3 seconds delay
    if (isInstallable && !isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isDismissed]);

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) {
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!isInstallable || isDismissed || !isVisible) {
    return null;
  }

  return (
    <Slide direction="up" in={isVisible} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 70, sm: 20 },
          left: { xs: 10, sm: 20 },
          right: { xs: 10, sm: 'auto' },
          maxWidth: { xs: 'calc(100% - 20px)', sm: 400 },
          zIndex: 1300,
        }}
      >
        <Card
          elevation={8}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
          }}
        >
          <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
              <Box
                sx={{
                  p: 1,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  borderRadius: 1,
                  display: 'flex',
                }}
              >
                <Smartphone size={24} />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Nainstalujte StudyPro
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.95, mb: 2 }}>
                  Používejte StudyPro jako nativní aplikaci - rychlejší přístup a offline
                  podpora!
                </Typography>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleInstall}
                    startIcon={<Download size={16} />}
                    sx={{
                      bgcolor: 'white',
                      color: '#667eea',
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)',
                      },
                    }}
                  >
                    Nainstalovat
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    onClick={handleDismiss}
                    sx={{
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                      },
                    }}
                  >
                    Možná později
                  </Button>
                </Box>
              </Box>

              <IconButton
                size="small"
                onClick={handleDismiss}
                sx={{
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <X size={18} />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Slide>
  );
};

/**
 * PWAInstallButton - Compact button for Settings page
 * Shows install status and allows installation
 */
export const PWAInstallButton = () => {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();

  if (isInstalled) {
    return (
      <Button
        variant="outlined"
        disabled
        startIcon={<Download size={18} />}
        sx={{ textTransform: 'none' }}
      >
        Již nainstalováno
      </Button>
    );
  }

  if (!isInstallable) {
    return null;
  }

  return (
    <Button
      variant="contained"
      onClick={promptInstall}
      startIcon={<Download size={18} />}
      sx={{ textTransform: 'none' }}
    >
      Nainstalovat aplikaci
    </Button>
  );
};
