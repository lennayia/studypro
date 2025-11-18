import { createTheme } from '@mui/material/styles';

// Barevné, moderní, motivující téma pro StudyPro
export const theme = createTheme({
  palette: {
    primary: {
      main: '#6366f1', // Indigo - hlavní barva
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ec4899', // Pink - akcenty
      light: '#f472b6',
      dark: '#db2777',
      contrastText: '#fff',
    },
    success: {
      main: '#10b981', // Zelená - úspěchy
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b', // Oranžová - upozornění
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444', // Červená - chyby
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#3b82f6', // Modrá - informace
      light: '#60a5fa',
      dark: '#2563eb',
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
    },
    // Custom barvy pro gamifikaci
    gamification: {
      gold: '#fbbf24',
      silver: '#e5e7eb',
      bronze: '#d97706',
      streak: '#f97316',
      points: '#8b5cf6',
    },
    // Barvy pro kategorie kurzů
    categories: {
      programming: '#3b82f6',
      design: '#ec4899',
      business: '#10b981',
      language: '#f59e0b',
      science: '#8b5cf6',
      art: '#ef4444',
      health: '#14b8a6',
      other: '#6b7280',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 8px rgba(0,0,0,0.1)',
    '0px 8px 16px rgba(0,0,0,0.1)',
    '0px 12px 24px rgba(0,0,0,0.15)',
    '0px 16px 32px rgba(0,0,0,0.15)',
    '0px 20px 40px rgba(0,0,0,0.2)',
    '0px 24px 48px rgba(0,0,0,0.2)',
    // ... další shadows
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '10px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(99, 102, 241, 0.3)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(99, 102, 241, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 8px 24px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 8,
        },
      },
    },
  },
});

// Helper funkce pro barvy kategorií
export const getCategoryColor = (category) => {
  const colors = {
    programming: '#3b82f6',
    programování: '#3b82f6',
    design: '#ec4899',
    business: '#10b981',
    language: '#f59e0b',
    jazyk: '#f59e0b',
    science: '#8b5cf6',
    věda: '#8b5cf6',
    art: '#ef4444',
    umění: '#ef4444',
    health: '#14b8a6',
    zdraví: '#14b8a6',
    school: '#6b7280',
    škola: '#6b7280',
  };

  return colors[category?.toLowerCase()] || '#6b7280';
};

// Helper funkce pro barvy statusu
export const getStatusColor = (status) => {
  const colors = {
    not_started: '#6b7280',
    in_progress: '#3b82f6',
    completed: '#10b981',
    paused: '#f59e0b',
    expired: '#ef4444',
  };

  return colors[status] || '#6b7280';
};

// Helper funkce pro prioritu
export const getPriorityColor = (priority) => {
  const colors = {
    0: '#6b7280', // nízká
    1: '#f59e0b', // střední
    2: '#ef4444', // vysoká
  };

  return colors[priority] || '#6b7280';
};
