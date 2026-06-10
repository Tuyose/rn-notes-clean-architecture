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
import { spacing } from '../../../../core/theme';
import { NoteCard } from '../components';
import { useNotesStore } from '../store';
import type { Note } from '../../domain/entities';

const FILTER_CHIPS = ['All', 'Work', 'Ideas', 'Architecture', 'Planning'];

export function NotesListScreen() {
  const router = useRouter();
  const { notes, loading, loadNotes } = useNotesStore();
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
      {/* Compact header */}
      <View style={styles.header}>
        <AppText variant="h2">Notes</AppText>
        <AppButton title="+ New" variant="ghost" size="sm" onPress={handleCreate} />
      </View>

      {/* Search */}
      <AppInput
        variant="search"
        placeholder="Search"
        editable={false}
        style={styles.search}
      />

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
              title="No notes"
              description="Tap + New to create your first note."
              action={<AppButton title="New Note" onPress={handleCreate} size="sm" />}
            />
          ) : null
        }
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  search: {
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  list: {
    paddingBottom: spacing.xxl,
  },
});
