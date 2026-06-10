import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

interface AppScreenProps {
  children: React.ReactNode;
  backgroundColor?: string;
  noHorizontalPadding?: boolean;
  noVerticalPadding?: boolean;
  style?: ViewStyle;
}

export function AppScreen({
  children,
  backgroundColor = colors.background,
  noHorizontalPadding = false,
  noVerticalPadding = false,
  style,
}: AppScreenProps) {
  return (
    <SafeAreaView
      edges={['top', 'bottom', 'left', 'right']}
      style={[
        styles.base,
        { backgroundColor },
        !noHorizontalPadding && styles.horizontalPadding,
        !noVerticalPadding && styles.verticalPadding,
        style,
      ]}
    >
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
  horizontalPadding: {
    paddingHorizontal: spacing.md,
  },
  verticalPadding: {
    paddingTop: spacing.sm,
  },
});
