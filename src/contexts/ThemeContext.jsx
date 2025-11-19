import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../theme/lightTheme';
import { darkTheme } from '../theme/darkTheme';

const ThemeContext = createContext({});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Detekce systémové preference
  const getSystemPreference = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Inicializace z localStorage nebo systémové preference
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('studypro-theme-mode');
    if (savedMode === 'dark' || savedMode === 'light') {
      return savedMode;
    }
    // Auto-detect system preference
    return getSystemPreference();
  });

  // Persist do localStorage při změně
  useEffect(() => {
    localStorage.setItem('studypro-theme-mode', mode);
  }, [mode]);

  // Listener na změny systémové preference
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e) => {
      // Pouze pokud uživatel nemá manuálně nastavenou preferenci
      const savedMode = localStorage.getItem('studypro-theme-mode');
      if (!savedMode) {
        setMode(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);

  const value = {
    mode,
    toggleTheme,
    isDark: mode === 'dark',
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
