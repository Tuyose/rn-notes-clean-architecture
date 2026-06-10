import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { colors, spacing } from '../theme';

interface AppEmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function AppEmptyState({ title, description, action }: AppEmptyStateProps) {
  return (
    <View style={styles.container}>
      <AppText variant="h3" color={colors.gray500} align="center">
        {title}
      </AppText>
      {description && (
        <AppText variant="body" color={colors.gray400} align="center" style={styles.desc}>
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
  desc: {
    maxWidth: 240,
  },
  action: {
    marginTop: spacing.sm,
  },
});
