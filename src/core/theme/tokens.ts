/**
 * Design tokens for the Notes app.
 *
 * Calm productivity palette. Not a SaaS dashboard.
 * Warm neutrals, muted accents, minimal shadow.
 */

export const colors = {
  // Neutrals — warm gray family
  white: '#FFFFFF',
  black: '#000000',
  gray50: '#FAFAF9',
  gray100: '#F5F5F4',
  gray150: '#EEEDEB',
  gray200: '#E7E5E4',
  gray300: '#D6D3D1',
  gray400: '#A8A29E',
  gray500: '#78716C',
  gray600: '#57534E',
  gray700: '#44403C',
  gray800: '#292524',
  gray900: '#1C1917',

  // Brand — muted indigo, not electric
  primary: '#6366F1',
  primaryLight: '#A5B4FC',
  primarySurface: '#F0F0FF',
  primaryDark: '#4F46E5',

  // Accent — soft, desaturated tag colors
  accentTeal: '#0F766E',
  accentTealSurface: '#F0FDFA',
  accentAmamber: '#B45309',
  accentAmberSurface: '#FFFBEB',
  accentRose: '#BE123C',
  accentRoseSurface: '#FFF1F2',
  accentSky: '#0369A1',
  accentSkySurface: '#F0F9FF',
  accentViolet: '#6D28D9',
  accentVioletSurface: '#F5F3FF',
  accentEmerald: '#047857',
  accentEmeraldSurface: '#ECFDF5',

  // Semantic
  success: '#16A34A',
  warning: '#D97706',
  error: '#DC2626',

  // Surfaces — clean, subtle layering
  background: '#FAFAF9',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#F5F5F4',
  border: '#E7E5E4',
  borderLight: '#F0EFED',
  divider: '#EEEDEB',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
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
    xxxl: 28,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.2,
    snug: 1.3,
    normal: 1.5,
    relaxed: 1.6,
  },
} as const;

export const radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
} as const;

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
} as const;
