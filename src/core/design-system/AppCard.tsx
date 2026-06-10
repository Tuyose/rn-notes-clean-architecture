import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { colors, radius, spacing } from '../theme';

type Variant = 'default' | 'flat' | 'tinted';

interface AppCardProps extends ViewProps {
  children: React.ReactNode;
  padded?: boolean;
  variant?: Variant;
}

export function AppCard({
  children,
  padded = true,
  variant = 'default',
  style,
  ...rest
}: AppCardProps) {
  return (
    <View
      style={[styles.card, variantStyles[variant], padded && styles.padded, style]}
      {...rest}
    >
      {children}
    </View>
  );
}

const variantStyles: Record<Variant, object> = {
  default: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  flat: {
    backgroundColor: colors.surfaceMuted,
  },
  tinted: {
    backgroundColor: colors.surfaceMuted,
  },
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
  },
  padded: {
    padding: spacing.md,
  },
});
