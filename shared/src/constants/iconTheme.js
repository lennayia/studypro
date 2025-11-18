/**
 * Icon Theme - Centrální konfigurace barev a velikostí ikon
 *
 * Použití v ProApp ekosystému pro konzistentní design
 *
 * @created 18.11.2025
 */

/**
 * Barvy ikon - Sémantické pojmenování
 */
export const ICON_COLORS = {
  // Primární barvy
  primary: '#6366f1',      // Modrá - hlavní akce, kurzy, logo
  secondary: '#8b5cf6',    // Fialová - statistiky, odznaky

  // Statusové barvy
  success: '#10b981',      // Zelená - dokončeno, deadlines
  warning: '#f97316',      // Oranžová - streaks, aktivita
  error: '#ef4444',        // Červená - chyby, upozornění
  info: '#3b82f6',         // Světle modrá - informace

  // Speciální barvy
  golden: '#eab308',       // Zlatá - trofeje, úspěchy
  pink: '#ec4899',         // Růžová - cíle, targety

  // Neutrální
  neutral: '#6b7280',      // Šedá - obecné ikony
  white: '#ffffff',        // Bílá - ikony na tmavém pozadí
  black: '#000000',        // Černá - ikony na světlém pozadí
};

/**
 * Velikosti ikon - Konzistentní scale
 */
export const ICON_SIZES = {
  xs: 12,     // Extra small - inline s textem
  sm: 14,     // Small - detaily, metadata
  md: 16,     // Medium - standardní ikony v textu
  base: 18,   // Base - default pro button ikony
  lg: 20,     // Large - feature ikony
  xl: 22,     // Extra large - sekce nadpisy
  '2xl': 24,  // 2XL - hlavní akce
  '3xl': 28,  // 3XL - page nadpisy
  '4xl': 40,  // 4XL - velké dekorativní
  '5xl': 48,  // 5XL - logo
  '6xl': 64,  // 6XL - empty states
};

/**
 * Sémantické mapování - co kde použít
 */
export const SEMANTIC_ICON_STYLES = {
  // Hlavní nadpisy stránek
  pageTitle: {
    size: ICON_SIZES['3xl'],
    color: ICON_COLORS.primary,
  },

  // Sekce nadpisy
  sectionTitle: {
    size: ICON_SIZES.xl,
    color: ICON_COLORS.secondary,
  },

  // Feature list ikony
  feature: {
    size: ICON_SIZES.lg,
    color: ICON_COLORS.primary,
  },

  // Button ikony
  button: {
    size: ICON_SIZES.base,
    color: 'inherit', // Zdědí barvu od buttonu
  },

  // Metadata ikony (autor, cena, datum)
  metadata: {
    size: ICON_SIZES.sm,
    color: ICON_COLORS.neutral,
  },

  // Empty state ikony
  emptyState: {
    size: ICON_SIZES['6xl'],
    color: ICON_COLORS.primary,
  },

  // Logo
  logo: {
    size: ICON_SIZES['5xl'],
    color: ICON_COLORS.primary,
  },

  // Navigation ikony
  navigation: {
    size: ICON_SIZES.lg,
    color: ICON_COLORS.neutral,
  },

  // Gamifikace - streaks
  streak: {
    size: ICON_SIZES['4xl'],
    color: ICON_COLORS.warning,
  },

  // Gamifikace - trofeje
  trophy: {
    size: ICON_SIZES['3xl'],
    color: ICON_COLORS.golden,
  },

  // Cíle
  goal: {
    size: ICON_SIZES.xl,
    color: ICON_COLORS.pink,
  },
};

/**
 * Helper funkce pro rychlé získání stylu
 */
export const getIconStyle = (semantic) => {
  return SEMANTIC_ICON_STYLES[semantic] || SEMANTIC_ICON_STYLES.button;
};
