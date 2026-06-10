import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { colors, radius, spacing, typography } from '../theme';

/** Subtle tag color mapping — muted, not loud. */
const TAG_COLORS: Record<string, { text: string; bg: string }> = {
  'getting-started': { text: colors.primary, bg: colors.primarySurface },
  architecture: { text: colors.accentViolet, bg: colors.accentVioletSurface },
  'react-native': { text: colors.accentSky, bg: colors.accentSkySurface },
  planning: { text: colors.accentAmamber, bg: colors.accentAmberSurface },
  sprint: { text: colors.accentAmamber, bg: colors.accentAmberSurface },
  typescript: { text: colors.accentSky, bg: colors.accentSkySurface },
  validation: { text: colors.accentTeal, bg: colors.accentTealSurface },
  design: { text: colors.accentViolet, bg: colors.accentVioletSurface },
  meeting: { text: colors.accentRose, bg: colors.accentRoseSurface },
  work: { text: colors.gray600, bg: colors.gray100 },
  ideas: { text: colors.accentEmerald, bg: colors.accentEmeraldSurface },
  personal: { text: colors.accentTeal, bg: colors.accentTealSurface },
};

const DEFAULT_TAG_COLOR = { text: colors.gray500, bg: colors.gray100 };

interface AppBadgeProps {
  label: string;
  color?: string;
  backgroundColor?: string;
  onPress?: () => void;
  selected?: boolean;
}

export function AppBadge({
  label,
  color,
  backgroundColor,
  onPress,
  selected = false,
}: AppBadgeProps) {
  const tagColor = TAG_COLORS[label] ?? DEFAULT_TAG_COLOR;
  const resolvedText = selected ? colors.white : (color ?? tagColor.text);
  const resolvedBg = selected ? colors.gray800 : (backgroundColor ?? tagColor.bg);

  const content = (
    <View style={[styles.badge, { backgroundColor: resolvedBg }]}>
      <AppText variant="caption" color={resolvedText} style={styles.text}>
        {label}
      </AppText>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        accessibilityRole="button"
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs + 1,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.sizes.xs,
    fontWeight: '500',
  },
});
