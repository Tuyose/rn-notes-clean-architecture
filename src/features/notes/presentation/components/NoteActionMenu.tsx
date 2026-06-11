import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { AppText, AppButton } from '../../../../core/design-system';
import { colors, spacing, radius } from '../../../../core/theme';

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
 * Uses React Native Modal — no third-party library.
 */
export function NoteActionMenu({
  visible,
  noteTitle,
  isArchived,
  onArchive,
  onDelete,
  onClose,
}: NoteActionMenuProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
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
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
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
