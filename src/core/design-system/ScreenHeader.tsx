import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { AppText } from './AppText';
import { colors, spacing, typography } from '../theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  /** Show a back button on the left. */
  onBack?: () => void;
  /** Right-side action element (button, icon, etc). */
  rightAction?: React.ReactNode;
}

/**
 * Consistent screen header used across all screens.
 *
 * Layout: optional back button | title + subtitle | optional right action.
 * Safe area is handled by the parent AppScreen — this component only
 * handles visual spacing and hierarchy.
 */
export function ScreenHeader({
  title,
  subtitle,
  onBack,
  rightAction,
}: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {onBack && (
          <Pressable
            onPress={onBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <AppText variant="body" color={colors.primary} style={styles.backArrow}>
              ‹
            </AppText>
          </Pressable>
        )}
        <View style={styles.titleBlock}>
          <AppText variant="h1" numberOfLines={1}>
            {title}
          </AppText>
          {subtitle && (
            <AppText variant="body" color={colors.gray500} style={styles.subtitle}>
              {subtitle}
            </AppText>
          )}
        </View>
        {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: spacing.sm,
    padding: spacing.xs,
    marginLeft: -spacing.xs, // compensate visual weight
  },
  backArrow: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.regular,
    lineHeight: typography.sizes.xxxl,
    color: colors.primary,
  },
  titleBlock: {
    flex: 1,
  },
  subtitle: {
    marginTop: 2,
  },
  rightAction: {
    marginLeft: spacing.sm,
  },
});
