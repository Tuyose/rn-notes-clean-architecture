import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Pressable, View } from 'react-native';
import { AppText } from './AppText';
import { colors, spacing, radius, typography } from '../theme';

interface AppToastProps {
  visible: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onDismiss: () => void;
  duration?: number;
}

/**
 * Minimal toast that slides up from the bottom.
 * Uses built-in Animated — no third-party library.
 */
export function AppToast({
  visible,
  message,
  actionLabel,
  onAction,
  onDismiss,
  duration = 4000,
}: AppToastProps) {
  const translateY = useRef(new Animated.Value(80)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Slide in
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss
      const timer = setTimeout(() => {
        hide();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  function hide() {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 80,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  }

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }], opacity }]}>
      <View style={styles.content}>
        <AppText variant="body" color={colors.white} style={styles.message}>
          {message}
        </AppText>
        {actionLabel && onAction && (
          <Pressable
            onPress={() => {
              onAction();
              hide();
            }}
            style={styles.actionButton}
          >
            <AppText variant="body" color={colors.primaryLight} style={styles.actionText}>
              {actionLabel}
            </AppText>
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing.xxl,
    left: spacing.md,
    right: spacing.md,
    zIndex: 1000,
    elevation: 10,
  },
  content: {
    backgroundColor: colors.gray900,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  message: {
    flex: 1,
    color: colors.white,
  },
  actionButton: {
    marginLeft: spacing.md,
    paddingVertical: spacing.xxs,
    paddingHorizontal: spacing.sm,
  },
  actionText: {
    color: colors.primaryLight,
    fontWeight: typography.weights.semibold,
  },
});
