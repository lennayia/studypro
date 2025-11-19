import { useMediaQuery, useTheme } from '@mui/material';

/**
 * Custom hook for responsive design
 * Returns boolean flags for different breakpoints
 *
 * Usage:
 * const { isMobile, isTablet, isDesktop } = useResponsive();
 */
export const useResponsive = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    // Convenience flags
    isMobileOrTablet: isMobile || isTablet,
    isDesktopOrLarger: isDesktop || isLargeDesktop,
  };
};

/**
 * Hook for getting current breakpoint name
 * Returns: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 */
export const useBreakpoint = () => {
  const theme = useTheme();

  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  const isLg = useMediaQuery(theme.breakpoints.only('lg'));
  const isXl = useMediaQuery(theme.breakpoints.only('xl'));

  if (isXs) return 'xs';
  if (isSm) return 'sm';
  if (isMd) return 'md';
  if (isLg) return 'lg';
  if (isXl) return 'xl';

  return 'md'; // Default
};

/**
 * Hook for responsive values
 * Returns different values based on breakpoint
 *
 * Usage:
 * const columns = useResponsiveValue({ xs: 1, sm: 2, md: 3, lg: 4 });
 */
export const useResponsiveValue = (values) => {
  const breakpoint = useBreakpoint();
  return values[breakpoint] || values.md || values.sm || values.xs;
};
