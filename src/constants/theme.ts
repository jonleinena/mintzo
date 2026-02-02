export const COLORS = {
  // Base
  background: '#FFFFFF',
  surface: '#FFFFFF',
  textPrimary: '#000000',
  textSecondary: '#64748B',
  border: '#000000',

  // Activity themes (pastels)
  cream: '#FEF3C7',
  mint: '#D1FAE5',
  gray: '#F3F4F6',
  indigo: '#E0E7FF',

  // Accents
  brand: '#7C3AED',
  brandLight: '#8B5CF6',
  success: '#4ADE80',
  gold: '#FCD34D',
  selected: '#93C5FD',

  // Exam orb colors
  orbBase: '#3B82F6',
  orbLight: '#60A5FA',
  orbLighter: '#93C5FD',
  orbSpeaking: '#8B5CF6',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
} as const;

export const SHADOWS = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  activeDrop: {
    shadowColor: '#7C3AED',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
} as const;
