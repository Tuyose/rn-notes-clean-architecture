import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { colors, spacing } from '../theme';

interface AppEmptyStateProps {
  title: string;
  description?: string;
  icon?: string;
  action?: React.ReactNode;
}

export function AppEmptyState({ title, description, icon, action }: AppEmptyStateProps) {
  return (
    <View style={styles.container}>
      {icon && <AppText style={styles.icon}>{icon}</AppText>}
      <AppText variant="h3" color={colors.gray700} align="center">
        {title}
      </AppText>
      {description && (
        <AppText variant="body" color={colors.gray500} align="center">
          {description}
        </AppText>
      )}
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
    gap: spacing.sm,
  },
  icon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  action: {
    marginTop: spacing.md,
  },
});
