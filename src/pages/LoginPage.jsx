import { Box, Button, Typography, Container, Paper, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import {
  LogoIcon,
  CoursesFeatureIcon,
  StatsFeatureIcon,
  GoalsFeatureIcon,
  StreakFeatureIcon,
  DeadlineFeatureIcon,
  LoginButtonIcon,
} from '../../shared/src/components/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {
  const { signInWithGoogle, error, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect po přihlášení
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 6,
            borderRadius: 4,
            textAlign: 'center',
          }}
        >
          {/* Logo & Title */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
            <LogoIcon />
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              StudyPro
            </Typography>
          </Box>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Tvůj osobní studijní parťák
          </Typography>

          {/* Features */}
          <Box sx={{ mb: 4, textAlign: 'left' }}>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CoursesFeatureIcon />
              <Typography variant="body1">
                Sleduj všechny své kurzy na jednom místě
              </Typography>
            </Box>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <StatsFeatureIcon />
              <Typography variant="body1">
                Vizualizuj svůj pokrok v reálném čase
              </Typography>
            </Box>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <GoalsFeatureIcon />
              <Typography variant="body1">
                Stanovuj si cíle a dosahuj jich
              </Typography>
            </Box>
            <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <StreakFeatureIcon />
              <Typography variant="body1">
                Sbírej body, odznaky a buduj streak
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <DeadlineFeatureIcon />
              <Typography variant="body1">
                Nezmeškej žádný deadline
              </Typography>
            </Box>
          </Box>

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Login Button */}
          <Button
            fullWidth
            size="large"
            variant="contained"
            startIcon={<LoginButtonIcon />}
            onClick={handleGoogleSignIn}
            disabled={loading}
            sx={{
              py: 2,
              fontSize: '1.1rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
              },
            }}
          >
            {loading ? 'Přihlašování...' : 'Přihlásit se přes Google'}
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3 }}>
            Přihlášením souhlasíš s používáním cookies a zpracováním osobních údajů
          </Typography>
        </Paper>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" sx={{ color: 'white', opacity: 0.9 }}>
            © 2025 StudyPro • Made with ❤️ for learners
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};
