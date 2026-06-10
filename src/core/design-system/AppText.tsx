import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

type Variant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
  align?: 'left' | 'center' | 'right';
  children: React.ReactNode;
}

const variantStyles: Record<Variant, object> = {
  h1: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    lineHeight: typography.sizes.xxxl * typography.lineHeights.tight,
  },
  h2: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.sizes.xxl * typography.lineHeights.tight,
  },
  h3: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold,
    lineHeight: typography.sizes.xl * typography.lineHeights.tight,
  },
  body: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.regular,
    lineHeight: typography.sizes.md * typography.lineHeights.normal,
  },
  caption: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.regular,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
};

export function AppText({
  variant = 'body',
  color = colors.gray900,
  align = 'left',
  style,
  children,
  ...rest
}: AppTextProps) {
  return (
    <RNText
      style={[styles.base, variantStyles[variant], { color, textAlign: align }, style]}
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
