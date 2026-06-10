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
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: radius.xl,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  icon: {
    fontSize: 36,
  },
  action: {
    marginTop: spacing.md,
  },
});
