import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { colors, radius, spacing, typography } from '../theme';

interface AppBadgeProps {
  label: string;
  color?: string;
  backgroundColor?: string;
}

export function AppBadge({
  label,
  color = colors.primary,
  backgroundColor,
}: AppBadgeProps) {
  const bgColor = backgroundColor ?? `${color}15`;

  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      <AppText variant="caption" color={color} style={styles.text}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.sizes.xs,
    fontWeight: '600',
  },
});
