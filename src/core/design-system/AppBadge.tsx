import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { colors, radius, spacing, typography } from '../theme';

/** Map tag names to accent colors for visual variety. */
const TAG_COLORS: Record<string, { text: string; bg: string }> = {
  'getting-started': { text: colors.primary, bg: colors.primarySurface },
  architecture: { text: colors.accentViolet, bg: colors.accentVioletSurface },
  'react-native': { text: colors.accentSky, bg: colors.accentSkySurface },
  planning: { text: colors.accentAmber, bg: colors.accentAmberSurface },
  sprint: { text: colors.accentAmber, bg: colors.accentAmberSurface },
  typescript: { text: colors.accentSky, bg: colors.accentSkySurface },
  validation: { text: colors.accentTeal, bg: colors.accentTealSurface },
  design: { text: colors.accentViolet, bg: colors.accentVioletSurface },
  meeting: { text: colors.accentRose, bg: colors.accentRoseSurface },
  work: { text: colors.primary, bg: colors.primarySurface },
  ideas: { text: colors.accentEmerald, bg: colors.accentEmeraldSurface },
  personal: { text: colors.accentTeal, bg: colors.accentTealSurface },
};

const DEFAULT_TAG_COLOR = { text: colors.gray600, bg: colors.gray100 };

interface AppBadgeProps {
  label: string;
  color?: string;
  backgroundColor?: string;
  /** When true, the badge is tappable. */
  onPress?: () => void;
  /** Visual state for filter chips. */
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
  const resolvedBg = selected ? colors.primary : (backgroundColor ?? tagColor.bg);

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
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs + 1,
    borderRadius: radius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: typography.sizes.xs,
    fontWeight: '600',
  },
});
