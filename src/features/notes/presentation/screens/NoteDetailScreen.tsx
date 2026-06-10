import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  AppText,
  AppButton,
  AppBadge,
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
      selectedNote?.isArchived ? 'Unarchive' : 'Archive',
      selectedNote?.isArchived ? 'Move back to active notes?' : 'Move to archive?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: selectedNote?.isArchived ? 'Unarchive' : 'Archive',
          onPress: () => archiveNote(id),
        },
      ],
    );
  }, [id, archiveNote, selectedNote?.isArchived]);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    Alert.alert('Delete', 'This cannot be undone.', [
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
          <AppText variant="caption" color={colors.gray400}>
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
          title="Something went wrong"
          description={error}
          action={<AppButton title="Go Back" onPress={() => router.back()} size="sm" />}
        />
      </AppScreen>
    );
  }

  if (!selectedNote) {
    return (
      <AppScreen>
        <AppEmptyState
          title="Note not found"
          action={<AppButton title="Go Back" onPress={() => router.back()} size="sm" />}
        />
      </AppScreen>
    );
  }

  const updatedDate = new Date(selectedNote.updatedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <AppScreen>
      <ScreenHeader onBack={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <AppText variant="h1" style={styles.title}>
          {selectedNote.title}
        </AppText>

        {/* Tags */}
        {selectedNote.tags.length > 0 && (
          <View style={styles.tags}>
            {selectedNote.tags.map((tag) => (
              <AppBadge key={tag} label={tag} />
            ))}
          </View>
        )}

        {/* Body */}
        <AppText variant="body" style={styles.body}>
          {selectedNote.body}
        </AppText>

        {/* Metadata */}
        <View style={styles.meta}>
          <AppText variant="caption" color={colors.gray400}>
            Updated {updatedDate}
            {selectedNote.isArchived ? ' · Archived' : ''}
          </AppText>
        </View>

        {/* Actions — subtle, secondary */}
        <View style={styles.actions}>
          <AppButton
            title={selectedNote.isArchived ? 'Unarchive' : 'Archive'}
            variant="ghost"
            size="sm"
            onPress={handleArchive}
          />
          <View style={styles.actionDivider} />
          <AppButton title="Delete" variant="danger" size="sm" onPress={handleDelete} />
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
  title: {
    marginBottom: spacing.sm,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  body: {
    lineHeight: 26,
    color: colors.gray700,
    marginBottom: spacing.xl,
  },
  meta: {
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  actionDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.border,
  },
});
