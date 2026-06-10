import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  AppText,
  AppButton,
  AppInput,
  AppBadge,
  AppEmptyState,
  AppScreen,
} from '../../../../core/design-system';
import { colors, spacing } from '../../../../core/theme';
import { NoteCard } from '../components';
import { useNotesStore } from '../store';
import type { Note } from '../../domain/entities';

const FILTER_CHIPS = ['All', 'Work', 'Ideas', 'Architecture', 'Planning'];

export function NotesListScreen() {
  const router = useRouter();
  const { notes, loading, error, loadNotes } = useNotesStore();
  const [selectedFilter, setSelectedFilter] = useState('All');

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
  const filteredNotes =
    selectedFilter === 'All'
      ? activeNotes
      : activeNotes.filter((n) =>
          n.tags.some((t) => t.toLowerCase() === selectedFilter.toLowerCase()),
        );

  return (
    <AppScreen>
      {/* Hero header */}
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <AppText variant="display">Notes</AppText>
            <AppText variant="body" color={colors.gray400} style={styles.subtitle}>
              Capture ideas, drafts, and tagged notes.
            </AppText>
          </View>
          <AppButton title="+ New" variant="soft" size="sm" onPress={handleCreate} />
        </View>
      </View>

      {/* Search bar */}
      <View style={styles.searchContainer}>
        <AppInput
          variant="search"
          placeholder="Search notes…"
          editable={false}
          style={styles.search}
        />
      </View>

      {/* Filter chips */}
      <View style={styles.chipRow}>
        {FILTER_CHIPS.map((chip) => (
          <AppBadge
            key={chip}
            label={chip}
            selected={selectedFilter === chip}
            onPress={() => setSelectedFilter(chip)}
          />
        ))}
      </View>

      {error && (
        <AppText variant="caption" color={colors.error} style={styles.error}>
          {error}
        </AppText>
      )}

      {/* Notes list */}
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteCard note={item} onPress={handleNotePress} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? (
            <AppEmptyState
              icon="✦"
              title="No notes yet"
              description="Create your first note to get started."
              action={<AppButton title="Create Note" onPress={handleCreate} />}
            />
          ) : null
        }
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginBottom: spacing.md,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  searchContainer: {
    marginBottom: spacing.sm + 2,
  },
  search: {},
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  list: {
    paddingBottom: spacing.xxl,
  },
  error: {
    marginBottom: spacing.sm,
  },
});
