import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from 'react-native';
import { AppText } from './AppText';
import { colors, radius, spacing, typography } from '../theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'soft';
type Size = 'xs' | 'sm' | 'md' | 'lg';

interface AppButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const variantStyles: Record<
  Variant,
  { base: ViewStyle; text: string; pressed: ViewStyle }
> = {
  primary: {
    base: { backgroundColor: colors.primary },
    text: colors.white,
    pressed: { backgroundColor: colors.primaryDark },
  },
  secondary: {
    base: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    text: colors.gray700,
    pressed: { backgroundColor: colors.gray50 },
  },
  ghost: {
    base: { backgroundColor: 'transparent' },
    text: colors.primary,
    pressed: { backgroundColor: colors.primarySurface },
  },
  danger: {
    base: { backgroundColor: colors.error },
    text: colors.white,
    pressed: { backgroundColor: '#DC2626' },
  },
  soft: {
    base: { backgroundColor: colors.primarySurface },
    text: colors.primary,
    pressed: { backgroundColor: '#E0E7FF' },
  },
};

const sizeStyles: Record<
  Size,
  { paddingVertical: number; paddingHorizontal: number; fontSize: number }
> = {
  xs: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    fontSize: typography.sizes.xs,
  },
  sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    fontSize: typography.sizes.sm,
  },
  md: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    fontSize: typography.sizes.md,
  },
  lg: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: typography.sizes.lg,
  },
};

export function AppButton({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...rest
}: AppButtonProps) {
  const vStyle = variantStyles[variant];
  const sStyle = sizeStyles[size];

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        vStyle.base,
        {
          paddingVertical: sStyle.paddingVertical,
          paddingHorizontal: sStyle.paddingHorizontal,
        },
        disabled && styles.disabled,
        pressed && !disabled && vStyle.pressed,
        fullWidth && styles.fullWidth,
        style,
      ]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={vStyle.text} size="small" />
      ) : (
        <AppText
          variant="label"
          color={vStyle.text}
          style={{ fontSize: sStyle.fontSize, textTransform: 'none', letterSpacing: 0 }}
        >
          {title}
        </AppText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
});
