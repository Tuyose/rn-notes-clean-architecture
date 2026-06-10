import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { colors, radius, spacing, typography } from '../theme';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const AppInput = forwardRef<TextInput, AppInputProps>(
  ({ label, error, style, ...rest }, ref) => {
    return (
      <View style={styles.container}>
        {label && (
          <AppText variant="label" color={colors.gray600} style={styles.label}>
            {label}
          </AppText>
        )}
        <TextInput
          ref={ref}
          style={[styles.input, error && styles.inputError, style]}
          placeholderTextColor={colors.gray400}
          {...rest}
        />
        {error && (
          <AppText variant="caption" color={colors.error} style={styles.error}>
            {error}
          </AppText>
        )}
      </View>
    );
  },
);

AppInput.displayName = 'AppInput';

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.md,
    color: colors.gray900,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    marginTop: spacing.xs,
  },
});
