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
    Alert.alert('Archive Note', 'Are you sure you want to archive this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Archive',
        onPress: async () => {
          await archiveNote(id);
        },
      },
    ]);
  }, [id, archiveNote]);

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
            Loading...
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

  const createdDate = new Date(selectedNote.createdAt).toLocaleDateString();
  const updatedDate = new Date(selectedNote.updatedAt).toLocaleDateString();

  return (
    <AppScreen noVerticalPadding>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <AppButton
            title="← Back"
            variant="ghost"
            size="sm"
            onPress={() => router.back()}
          />
        </View>

        <AppText variant="h1" style={styles.title}>
          {selectedNote.title}
        </AppText>

        {selectedNote.isArchived && <AppBadge label="Archived" color={colors.gray500} />}

        {selectedNote.tags.length > 0 && (
          <View style={styles.tags}>
            {selectedNote.tags.map((tag) => (
              <AppBadge key={tag} label={tag} />
            ))}
          </View>
        )}

        <AppCard style={styles.bodyCard}>
          <AppText variant="body" style={styles.body}>
            {selectedNote.body}
          </AppText>
        </AppCard>

        <View style={styles.meta}>
          <AppText variant="caption" color={colors.gray500}>
            Created: {createdDate}
          </AppText>
          <AppText variant="caption" color={colors.gray500}>
            Updated: {updatedDate}
          </AppText>
        </View>

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
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRow: {
    marginBottom: spacing.md,
  },
  title: {
    marginBottom: spacing.sm,
  },
  tags: {
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
  meta: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
});
