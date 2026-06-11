import React, { useEffect, useMemo } from 'react';
import { Modal, Pressable, StyleSheet, View, Animated, Dimensions } from 'react-native';
import { AppText, AppButton } from '../../../../core/design-system';
import { colors, spacing, radius } from '../../../../core/theme';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface NoteActionMenuProps {
  visible: boolean;
  noteTitle: string;
  isArchived: boolean;
  onArchive: () => void;
  onDelete: () => void;
  onClose: () => void;
}

/**
 * Bottom-sheet style action menu for note actions.
 *
 * Backdrop fades in place (opacity only).
 * Sheet slides up from the bottom (translateY).
 * Both use separate Animated values so they don't move together.
 */
export function NoteActionMenu({
  visible,
  noteTitle,
  isArchived,
  onArchive,
  onDelete,
  onClose,
}: NoteActionMenuProps) {
  const backdropOpacity = useMemo(() => new Animated.Value(0), []);
  const sheetTranslate = useMemo(() => new Animated.Value(SCREEN_HEIGHT), []);

  useEffect(() => {
    if (visible) {
      // Fade in backdrop + slide up sheet in parallel
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(sheetTranslate, {
          toValue: 0,
          damping: 20,
          stiffness: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Fade out backdrop + slide down sheet in parallel
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslate, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, backdropOpacity, sheetTranslate]);

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onClose}>
      {/* Backdrop — fades in place, does not slide */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={styles.backdropPress} onPress={onClose} />
      </Animated.View>

      {/* Sheet — slides up independently */}
      <Animated.View
        style={[styles.sheetContainer, { transform: [{ translateY: sheetTranslate }] }]}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <AppText variant="caption" color={colors.gray400} style={styles.title}>
            {noteTitle}
          </AppText>

          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.actionRow,
                pressed && styles.actionRowPressed,
              ]}
              onPress={() => {
                onClose();
                onArchive();
              }}
            >
              <AppText variant="body" color={colors.gray700}>
                {isArchived ? 'Unarchive' : 'Archive'}
              </AppText>
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              style={({ pressed }) => [
                styles.actionRow,
                pressed && styles.actionRowPressed,
              ]}
              onPress={() => {
                onClose();
                onDelete();
              }}
            >
              <AppText variant="body" color={colors.error}>
                Delete
              </AppText>
            </Pressable>
          </View>

          <View style={styles.cancelRow}>
            <AppButton title="Cancel" variant="secondary" fullWidth onPress={onClose} />
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  backdropPress: {
    flex: 1,
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.gray300,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  title: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  actions: {
    marginHorizontal: spacing.md,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  actionRow: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  actionRowPressed: {
    backgroundColor: colors.gray200,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
  },
  cancelRow: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
});
