/**
 * Design tokens for the Notes app.
 *
 * Single source of truth for all visual constants.
 * Keep tokens flat and primitive — semantic mapping lives in the theme hook.
 */

export const colors = {
  // Neutrals — expanded for softer surfaces and muted text
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#FAFBFC',
  gray100: '#F4F5F7',
  gray150: '#ECEEF1',
  gray200: '#E1E4E8',
  gray300: '#CDD2DA',
  gray400: '#9AA2B1',
  gray500: '#6E7A8A',
  gray600: '#4E5A6B',
  gray700: '#374150',
  gray800: '#1F2A37',
  gray900: '#111827',

  // Brand — warmer indigo-violet
  primary: '#6366F1',
  primaryLight: '#A5B4FC',
  primarySurface: '#EEF2FF',
  primaryDark: '#4338CA',

  // Accent — muted tag colors
  accentTeal: '#0D9488',
  accentTealSurface: '#F0FDFA',
  accentAmber: '#D97706',
  accentAmberSurface: '#FFFBEB',
  accentRose: '#E11D48',
  accentRoseSurface: '#FFF1F2',
  accentSky: '#0284C7',
  accentSkySurface: '#F0F9FF',
  accentViolet: '#7C3AED',
  accentVioletSurface: '#F5F3FF',
  accentEmerald: '#059669',
  accentEmeraldSurface: '#ECFDF5',

  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  // Surface — softer backgrounds
  background: '#F7F8FA',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#F4F5F7',
  border: '#E8EAEE',
  borderLight: '#F0F1F4',
  divider: '#ECEEF1',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const typography = {
  sizes: {
    xxs: 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    display: 34,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.65,
  },
} as const;

export const radius = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 24,
  full: 9999,
} as const;

export const shadows = {
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
  },
} as const;
