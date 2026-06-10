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
  /** Use the larger display style for the title. */
  large?: boolean;
}

/**
 * Consistent screen header used across all screens.
 */
export function ScreenHeader({
  title,
  subtitle,
  onBack,
  rightAction,
  large = false,
}: ScreenHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {onBack && (
          <Pressable
            onPress={onBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <AppText style={styles.backChevron}>‹</AppText>
          </Pressable>
        )}
        {rightAction && <View style={styles.rightAction}>{rightAction}</View>}
      </View>
      <View style={styles.titleBlock}>
        <AppText variant={large ? 'display' : 'h1'}>{title}</AppText>
        {subtitle && (
          <AppText variant="body" color={colors.gray400} style={styles.subtitle}>
            {subtitle}
          </AppText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  backChevron: {
    fontSize: typography.sizes.xxxl,
    color: colors.primary,
    fontWeight: '300',
    lineHeight: typography.sizes.xxxl,
  },
  rightAction: {},
  titleBlock: {},
  subtitle: {
    marginTop: spacing.xs,
  },
});
