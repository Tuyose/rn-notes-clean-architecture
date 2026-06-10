import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { AppText } from './AppText';
import { colors, spacing, typography } from '../theme';

interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

/**
 * Minimal screen header. Title on left, optional right action.
 * Back chevron is subtle and non-dominant.
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
            <AppText style={styles.backChevron}>‹</AppText>
          </Pressable>
        )}
        {title ? (
          <View style={styles.titleBlock}>
            <AppText variant="h3" numberOfLines={1}>
              {title}
            </AppText>
            {subtitle && (
              <AppText variant="caption" color={colors.gray400} style={styles.subtitle}>
                {subtitle}
              </AppText>
            )}
          </View>
        ) : (
          <View style={styles.spacer} />
        )}
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
    justifyContent: 'space-between',
  },
  backButton: {
    padding: spacing.xs,
    marginRight: spacing.sm,
  },
  backChevron: {
    fontSize: typography.sizes.xxl,
    color: colors.gray500,
    fontWeight: '300',
    lineHeight: typography.sizes.xxl,
  },
  titleBlock: {
    flex: 1,
  },
  subtitle: {
    marginTop: spacing.xxs,
  },
  spacer: {
    flex: 1,
  },
  rightAction: {},
});
