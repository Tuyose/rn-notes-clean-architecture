import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { colors, spacing, radius } from '../theme';

interface AppEmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  action?: React.ReactNode;
}

export function AppEmptyState({ title, description, icon, action }: AppEmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {icon && <AppText style={styles.icon}>{icon}</AppText>}
      </View>
      <View style={styles.textBlock}>
        <AppText variant="h2" color={colors.gray800} align="center">
          {title}
        </AppText>
        {description && (
          <AppText
            variant="body"
            color={colors.gray400}
            align="center"
            style={styles.description}
          >
            {description}
          </AppText>
        )}
      </View>
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: radius.xxl,
    backgroundColor: colors.primarySurface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 32,
  },
  textBlock: {
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  description: {
    maxWidth: 260,
  },
  action: {},
});
