import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  AppText,
  AppButton,
  AppInput,
  AppEmptyState,
} from '../../../../core/design-system';
import { colors, spacing } from '../../../../core/theme';
import { NoteCard } from '../components';
import { useNotesStore } from '../store';
import type { Note } from '../../domain/entities';

export function NotesListScreen() {
  const router = useRouter();
  const { notes, loading, error, loadNotes } = useNotesStore();

  React.useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleNotePress = useCallback(
    (note: Note) => {
      router.push(`/notes/${note.id}`);
    },
    [router],
  );

  const handleCreate = useCallback(() => {
    router.push('/notes/new');
  }, [router]);

  const activeNotes = notes.filter((n) => !n.isArchived);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="h1">Notes</AppText>
        <AppButton title="+ New" size="sm" onPress={handleCreate} />
      </View>

      {/* Search placeholder */}
      <AppInput placeholder="Search notes..." editable={false} style={styles.search} />

      {/* Tags filter placeholder */}
      <View style={styles.filterPlaceholder}>
        <AppText variant="caption" color={colors.gray400}>
          Tags filter coming soon...
        </AppText>
      </View>

      {error && (
        <AppText variant="body" color={colors.error} style={styles.error}>
          {error}
        </AppText>
      )}

      <FlatList
        data={activeNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteCard note={item} onPress={handleNotePress} />}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !loading ? (
            <AppEmptyState
              icon="📝"
              title="No notes yet"
              description="Create your first note to get started."
              action={<AppButton title="Create Note" onPress={handleCreate} />}
            />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  search: {
    marginBottom: spacing.sm,
  },
  filterPlaceholder: {
    marginBottom: spacing.md,
    paddingVertical: spacing.xs,
  },
  list: {
    paddingBottom: spacing.xxl,
  },
  error: {
    marginBottom: spacing.sm,
  },
});
