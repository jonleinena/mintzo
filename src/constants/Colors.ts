// Mintzo color palette - dark theme focused
export const colors = {
  // Primary (Indigo)
  primary: {
    DEFAULT: '#6366F1',
    50: '#EEEEFF',
    100: '#E0E1FF',
    200: '#C7C8FE',
    300: '#A5A7FC',
    400: '#8385F9',
    500: '#6366F1',
    600: '#4F51E5',
    700: '#3F41CF',
    800: '#3435A8',
    900: '#2E2F85',
  },
  // Secondary (Emerald for success, XP, streaks)
  secondary: {
    DEFAULT: '#10B981',
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },
  // Dark theme backgrounds
  background: {
    DEFAULT: '#0F172A',
    secondary: '#1E293B',
  },
  surface: {
    DEFAULT: '#1E293B',
    secondary: '#334155',
  },
  // Text colors
  text: {
    primary: '#F8FAFC',
    secondary: '#CBD5E1',
    muted: '#94A3B8',
  },
  // Exam level colors
  exam: {
    b2: '#3B82F6',
    c1: '#8B5CF6',
    c2: '#EC4899',
  },
  // Status colors
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
};

// Theme configuration for React Navigation
const tintColor = colors.primary.DEFAULT;

export default {
  light: {
    text: colors.text.primary,
    background: colors.background.DEFAULT,
    tint: tintColor,
    tabIconDefault: colors.text.muted,
    tabIconSelected: tintColor,
  },
  dark: {
    text: colors.text.primary,
    background: colors.background.DEFAULT,
    tint: tintColor,
    tabIconDefault: colors.text.muted,
    tabIconSelected: tintColor,
  },
};
