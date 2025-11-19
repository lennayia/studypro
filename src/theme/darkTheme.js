import { createTheme } from '@mui/material/styles';

// Tmavé téma pro StudyPro
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#818cf8', // Světlejší indigo pro tmavý režim
      light: '#a5b4fc',
      dark: '#6366f1',
      contrastText: '#fff',
    },
    secondary: {
      main: '#f472b6', // Světlejší pink pro tmavý režim
      light: '#f9a8d4',
      dark: '#ec4899',
      contrastText: '#fff',
    },
    success: {
      main: '#34d399', // Světlejší zelená
      light: '#6ee7b7',
      dark: '#10b981',
      lighter: '#064e3b',
    },
    warning: {
      main: '#fbbf24', // Světlejší oranžová
      light: '#fcd34d',
      dark: '#f59e0b',
    },
    error: {
      main: '#f87171', // Světlejší červená
      light: '#fca5a5',
      dark: '#ef4444',
    },
    info: {
      main: '#60a5fa', // Světlejší modrá
      light: '#93c5fd',
      dark: '#3b82f6',
      lighter: '#1e3a8a',
    },
    background: {
      default: '#0f172a', // Tmavě modrošedá
      paper: '#1e293b', // Světlejší než default
    },
    text: {
      primary: '#f1f5f9', // Světle šedá
      secondary: '#94a3b8', // Střední šedá
    },
    divider: '#334155',
    // Custom barvy pro gamifikaci (upraveno pro tmavý režim)
    gamification: {
      gold: '#fcd34d',
      silver: '#cbd5e1',
      bronze: '#fbbf24',
      streak: '#fb923c',
      points: '#a78bfa',
    },
    // Barvy pro kategorie kurzů (světlejší varianty)
    categories: {
      programming: '#60a5fa',
      design: '#f472b6',
      business: '#34d399',
      language: '#fbbf24',
      science: '#a78bfa',
      art: '#f87171',
      health: '#2dd4bf',
      other: '#94a3b8',
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
    '0px 2px 1px -1px rgba(0,0,0,0.4),0px 1px 1px 0px rgba(0,0,0,0.28),0px 1px 3px 0px rgba(0,0,0,0.24)',
    '0px 3px 1px -2px rgba(0,0,0,0.4),0px 2px 2px 0px rgba(0,0,0,0.28),0px 1px 5px 0px rgba(0,0,0,0.24)',
    '0px 3px 3px -2px rgba(0,0,0,0.4),0px 3px 4px 0px rgba(0,0,0,0.28),0px 1px 8px 0px rgba(0,0,0,0.24)',
    '0px 2px 4px -1px rgba(0,0,0,0.4),0px 4px 5px 0px rgba(0,0,0,0.28),0px 1px 10px 0px rgba(0,0,0,0.24)',
    '0px 3px 5px -1px rgba(0,0,0,0.4),0px 5px 8px 0px rgba(0,0,0,0.28),0px 1px 14px 0px rgba(0,0,0,0.24)',
    '0px 3px 5px -1px rgba(0,0,0,0.4),0px 6px 10px 0px rgba(0,0,0,0.28),0px 1px 18px 0px rgba(0,0,0,0.24)',
    '0px 4px 5px -2px rgba(0,0,0,0.4),0px 7px 10px 1px rgba(0,0,0,0.28),0px 2px 16px 1px rgba(0,0,0,0.24)',
    '0px 5px 5px -3px rgba(0,0,0,0.4),0px 8px 10px 1px rgba(0,0,0,0.28),0px 3px 14px 2px rgba(0,0,0,0.24)',
    '0px 5px 6px -3px rgba(0,0,0,0.4),0px 9px 12px 1px rgba(0,0,0,0.28),0px 3px 16px 2px rgba(0,0,0,0.24)',
    '0px 6px 6px -3px rgba(0,0,0,0.4),0px 10px 14px 1px rgba(0,0,0,0.28),0px 4px 18px 3px rgba(0,0,0,0.24)',
    '0px 6px 7px -4px rgba(0,0,0,0.4),0px 11px 15px 1px rgba(0,0,0,0.28),0px 4px 20px 3px rgba(0,0,0,0.24)',
    '0px 7px 8px -4px rgba(0,0,0,0.4),0px 12px 17px 2px rgba(0,0,0,0.28),0px 5px 22px 4px rgba(0,0,0,0.24)',
    '0px 7px 8px -4px rgba(0,0,0,0.4),0px 13px 19px 2px rgba(0,0,0,0.28),0px 5px 24px 4px rgba(0,0,0,0.24)',
    '0px 7px 9px -4px rgba(0,0,0,0.4),0px 14px 21px 2px rgba(0,0,0,0.28),0px 5px 26px 4px rgba(0,0,0,0.24)',
    '0px 8px 9px -5px rgba(0,0,0,0.4),0px 15px 22px 2px rgba(0,0,0,0.28),0px 6px 28px 5px rgba(0,0,0,0.24)',
    '0px 8px 10px -5px rgba(0,0,0,0.4),0px 16px 24px 2px rgba(0,0,0,0.28),0px 6px 30px 5px rgba(0,0,0,0.24)',
    '0px 8px 11px -5px rgba(0,0,0,0.4),0px 17px 26px 2px rgba(0,0,0,0.28),0px 6px 32px 5px rgba(0,0,0,0.24)',
    '0px 9px 11px -5px rgba(0,0,0,0.4),0px 18px 28px 2px rgba(0,0,0,0.28),0px 7px 34px 6px rgba(0,0,0,0.24)',
    '0px 9px 12px -6px rgba(0,0,0,0.4),0px 19px 29px 2px rgba(0,0,0,0.28),0px 7px 36px 6px rgba(0,0,0,0.24)',
    '0px 10px 13px -6px rgba(0,0,0,0.4),0px 20px 31px 3px rgba(0,0,0,0.28),0px 8px 38px 7px rgba(0,0,0,0.24)',
    '0px 10px 13px -6px rgba(0,0,0,0.4),0px 21px 33px 3px rgba(0,0,0,0.28),0px 8px 40px 7px rgba(0,0,0,0.24)',
    '0px 10px 14px -6px rgba(0,0,0,0.4),0px 22px 35px 3px rgba(0,0,0,0.28),0px 8px 42px 7px rgba(0,0,0,0.24)',
    '0px 11px 14px -7px rgba(0,0,0,0.4),0px 23px 36px 3px rgba(0,0,0,0.28),0px 9px 44px 8px rgba(0,0,0,0.24)',
    '0px 11px 15px -7px rgba(0,0,0,0.4),0px 24px 38px 3px rgba(0,0,0,0.28),0px 9px 46px 8px rgba(0,0,0,0.24)',
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
            boxShadow: '0px 4px 12px rgba(129, 140, 248, 0.4)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 12px rgba(129, 140, 248, 0.4)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 4px 12px rgba(0,0,0,0.4)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0px 8px 24px rgba(0,0,0,0.6)',
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
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Odstranit default gradient v tmavém režimu
        },
      },
    },
  },
});
