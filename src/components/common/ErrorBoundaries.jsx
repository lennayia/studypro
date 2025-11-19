import { Component } from 'react';
import { Box, Button, Card, CardContent, Typography, Stack } from '@mui/material';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Generic Error Boundary Component
 * Catches JavaScript errors anywhere in child component tree
 * Displays fallback UI instead of crashing the whole app
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console (in production, send to error tracking service)
    console.error('Error Boundary caught error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // TODO: Send to error tracking service (Sentry, LogRocket, etc.)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            p: 3,
            bgcolor: 'background.default',
          }}
        >
          <Card sx={{ maxWidth: 600, borderRadius: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Stack spacing={3} alignItems="center">
                {/* Icon */}
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'error.lighter',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AlertTriangle size={40} color="#ef4444" />
                </Box>

                {/* Title */}
                <Typography variant="h5" sx={{ fontWeight: 700, textAlign: 'center' }}>
                  Něco se pokazilo
                </Typography>

                {/* Message */}
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center' }}>
                  Omlouváme se, ale došlo k neočekávané chybě. Zkuste prosím obnovit stránku.
                </Typography>

                {/* Error details (only in development) */}
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'error.lighter',
                      width: '100%',
                      maxHeight: 200,
                      overflow: 'auto',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}
                    >
                      {this.state.error.toString()}
                    </Typography>
                  </Box>
                )}

                {/* Actions */}
                <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                  <Button
                    variant="outlined"
                    onClick={this.handleGoHome}
                    startIcon={<Home size={18} />}
                    fullWidth
                  >
                    Domů
                  </Button>
                  <Button
                    variant="contained"
                    onClick={this.handleReset}
                    startIcon={<RefreshCw size={18} />}
                    fullWidth
                  >
                    Zkusit znovu
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      );
    }

    return this.props.children;
  }
}

/**
 * Section Error Boundary - smaller fallback for page sections
 * Use this to wrap individual sections so errors don't crash whole page
 */
export class SectionErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Section Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            bgcolor: 'error.lighter',
            border: '1px solid',
            borderColor: 'error.main',
          }}
        >
          <Stack spacing={2} alignItems="center">
            <AlertTriangle size={32} color="#ef4444" />
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              {this.props.fallbackMessage || 'Sekce se nepodařilo načíst'}
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => this.setState({ hasError: false })}
            >
              Zkusit znovu
            </Button>
          </Stack>
        </Box>
      );
    }

    return this.props.children;
  }
}
