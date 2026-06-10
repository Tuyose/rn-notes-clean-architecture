import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

type Variant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'body'
  | 'bodyMuted'
  | 'caption'
  | 'label';

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

const variantStyles: Record<Variant, object> = {
  display: {
    fontSize: typography.sizes.display,
    fontWeight: typography.weights.bold,
    lineHeight: typography.sizes.display * typography.lineHeights.tight,
    letterSpacing: -0.5,
  },
  h1: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    lineHeight: typography.sizes.xxxl * typography.lineHeights.tight,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.sizes.xxl * typography.lineHeights.snug,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.sizes.lg * typography.lineHeights.snug,
  },
  body: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.regular,
    lineHeight: typography.sizes.md * typography.lineHeights.relaxed,
  },
  bodyMuted: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.regular,
    lineHeight: typography.sizes.md * typography.lineHeights.relaxed,
  },
  caption: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.regular,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
  label: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.sizes.xs * typography.lineHeights.normal,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
};

export function AppText({
  variant = 'body',
  color,
  align = 'left',
  style,
  children,
  ...rest
}: AppTextProps) {
  const resolvedColor =
    color ?? (variant === 'bodyMuted' ? colors.gray500 : colors.gray900);

  return (
    <RNText
      style={[
        styles.base,
        variantStyles[variant],
        { color: resolvedColor, textAlign: align },
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
