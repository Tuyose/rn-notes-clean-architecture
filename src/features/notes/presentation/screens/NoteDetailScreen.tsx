import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  AppText,
  AppButton,
  AppBadge,
  AppCard,
  AppEmptyState,
  AppScreen,
  ScreenHeader,
} from '../../../../core/design-system';
import { colors, spacing } from '../../../../core/theme';
import { useNotesStore } from '../store';

export function NoteDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedNote, loading, error, loadNoteById, archiveNote, deleteNote } =
    useNotesStore();

  React.useEffect(() => {
    if (id) {
      loadNoteById(id);
    }
  }, [id, loadNoteById]);

  const handleArchive = useCallback(async () => {
    if (!id) return;
    Alert.alert(
      selectedNote?.isArchived ? 'Unarchive Note' : 'Archive Note',
      selectedNote?.isArchived
        ? 'Move this note back to your active list?'
        : 'Move this note to the archive?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: selectedNote?.isArchived ? 'Unarchive' : 'Archive',
          onPress: async () => {
            await archiveNote(id);
          },
        },
      ],
    );
  }, [id, archiveNote, selectedNote?.isArchived]);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    Alert.alert('Delete Note', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteNote(id);
          router.back();
        },
      },
    ]);
  }, [id, deleteNote, router]);

  if (loading) {
    return (
      <AppScreen>
        <View style={styles.center}>
          <AppText variant="body" color={colors.gray500}>
            Loading…
          </AppText>
        </View>
      </AppScreen>
    );
  }

  if (error) {
    return (
      <AppScreen>
        <AppEmptyState
          icon="⚠️"
          title="Error"
          description={error}
          action={<AppButton title="Go Back" onPress={() => router.back()} />}
        />
      </AppScreen>
    );
  }

  if (!selectedNote) {
    return (
      <AppScreen>
        <AppEmptyState
          icon="🔍"
          title="Note not found"
          action={<AppButton title="Go Back" onPress={() => router.back()} />}
        />
      </AppScreen>
    );
  }

  const createdDate = new Date(selectedNote.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const updatedDate = new Date(selectedNote.updatedAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <AppScreen>
      <ScreenHeader title={selectedNote.title} onBack={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Status + Tags */}
        <View style={styles.badges}>
          {selectedNote.isArchived && (
            <AppBadge label="Archived" color={colors.gray500} />
          )}
          {selectedNote.tags.map((tag) => (
            <AppBadge key={tag} label={tag} />
          ))}
        </View>

        {/* Body */}
        <AppCard variant="default" style={styles.bodyCard}>
          <AppText variant="body" style={styles.body}>
            {selectedNote.body}
          </AppText>
        </AppCard>

        {/* Metadata */}
        <AppCard variant="flat" style={styles.metaCard}>
          <View style={styles.metaRow}>
            <AppText variant="label" color={colors.gray500}>
              Created
            </AppText>
            <AppText variant="caption" color={colors.gray600}>
              {createdDate}
            </AppText>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaRow}>
            <AppText variant="label" color={colors.gray500}>
              Updated
            </AppText>
            <AppText variant="caption" color={colors.gray600}>
              {updatedDate}
            </AppText>
          </View>
        </AppCard>

        {/* Actions */}
        <View style={styles.actions}>
          <AppButton
            title={selectedNote.isArchived ? 'Unarchive' : 'Archive'}
            variant="secondary"
            onPress={handleArchive}
            style={styles.actionButton}
          />
          <AppButton
            title="Delete"
            variant="danger"
            onPress={handleDelete}
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  bodyCard: {
    marginBottom: spacing.md,
  },
  body: {
    lineHeight: 24,
  },
  metaCard: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
