import React, { forwardRef } from 'react';
import { TextInput, TextInputProps, View, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { colors, radius, spacing, typography } from '../theme';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  /** Visual style variant. */
  variant?: 'default' | 'search';
}

export const AppInput = forwardRef<TextInput, AppInputProps>(
  ({ label, error, variant = 'default', style, ...rest }, ref) => {
    return (
      <View style={styles.container}>
        {label && (
          <AppText variant="label" color={colors.gray500} style={styles.label}>
            {label}
          </AppText>
        )}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            variantStyles[variant],
            error && styles.inputError,
            style,
          ]}
          placeholderTextColor={colors.gray400}
          {...rest}
        />
        {error && (
          <AppText variant="caption" color={colors.error} style={styles.errorText}>
            {error}
          </AppText>
        )}
      </View>
    );
  },
);

AppInput.displayName = 'AppInput';

const variantStyles = StyleSheet.create({
  default: {},
  search: {
    backgroundColor: colors.surfaceMuted,
    borderWidth: 0,
    borderRadius: radius.lg,
  },
});

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    marginBottom: spacing.xxs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: typography.sizes.md,
    color: colors.gray900,
    backgroundColor: colors.surface,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    marginTop: spacing.xxs,
  },
});
