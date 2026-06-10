import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

interface AppScreenProps {
  children: React.ReactNode;
  /** Override the default background color. */
  backgroundColor?: string;
  /** Remove the default horizontal padding. */
  noHorizontalPadding?: boolean;
  /** Remove the default vertical padding. */
  noVerticalPadding?: boolean;
  style?: ViewStyle;
}

/**
 * Standard screen wrapper that respects safe area insets on all edges.
 *
 * Every screen in the app should be wrapped in this component to prevent
 * content from colliding with the status bar, notch, or home indicator.
 */
export function AppScreen({
  children,
  backgroundColor = colors.background,
  noHorizontalPadding = false,
  noVerticalPadding = false,
  style,
}: AppScreenProps) {
  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
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
