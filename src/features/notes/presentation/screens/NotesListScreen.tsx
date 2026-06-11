import React, { useCallback, useState, useMemo } from 'react';
import { FlatList, StyleSheet, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {
  AppText,
  AppButton,
  AppInput,
  AppBadge,
  AppEmptyState,
  AppScreen,
  AppToast,
} from '../../../../core/design-system';
import { spacing } from '../../../../core/theme';
import { NoteListItem, NoteActionMenu } from '../components';
import { useNotesStore } from '../store';
import type { Note } from '../../domain/entities';

export function NotesListScreen() {
  const router = useRouter();
  const {
    notes,
    loading,
    hydrated,
    error,
    toast,
    hydrate,
    archiveNote,
    deleteNote,
    hideToast,
  } = useNotesStore();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMenuNote, setActionMenuNote] = useState<Note | null>(null);

  React.useEffect(() => {
    if (!hydrated) {
      hydrate();
    }
  }, [hydrated, hydrate]);

  const handleNotePress = useCallback(
    (note: Note) => {
      router.push(`/notes/${note.id}`);
    },
    [router],
  );

  const handleCreate = useCallback(() => {
    router.push('/notes/new');
  }, [router]);

  const handleLongPress = useCallback((note: Note) => {
    setActionMenuNote(note);
  }, []);

  const handleArchiveFromMenu = useCallback(async () => {
    if (!actionMenuNote) return;
    await archiveNote(actionMenuNote.id);
    setActionMenuNote(null);
  }, [actionMenuNote, archiveNote]);

  const handleDeleteFromMenu = useCallback(async () => {
    if (!actionMenuNote) return;
    Alert.alert('Delete', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel', onPress: () => setActionMenuNote(null) },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteNote(actionMenuNote.id);
          setActionMenuNote(null);
        },
      },
    ]);
  }, [actionMenuNote, deleteNote]);

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    for (const note of notes) {
      if (!note.isArchived) {
        for (const tag of note.tags) {
          tagSet.add(tag);
        }
      }
    }
    return Array.from(tagSet).sort();
  }, [notes]);

  const filterChips = useMemo(() => ['All', ...availableTags], [availableTags]);

  const activeNotes = notes.filter((n) => !n.isArchived);

  const filteredNotes = useMemo(() => {
    let result = activeNotes;

    if (selectedFilter !== 'All') {
      result = result.filter((n) =>
        n.tags.some((t) => t.toLowerCase() === selectedFilter.toLowerCase()),
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.body.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }

    return result;
  }, [activeNotes, selectedFilter, searchQuery]);

  const renderNoteItem = useCallback(
    ({ item }: { item: Note }) => (
      <NoteListItem note={item} onPress={handleNotePress} onLongPress={handleLongPress} />
    ),
    [handleNotePress, handleLongPress],
  );

  const keyExtractor = useCallback((item: Note) => item.id, []);

  const isFiltering = searchQuery.trim().length > 0 || selectedFilter !== 'All';

  return (
    <AppScreen>
      {/* Header */}
      <View style={styles.header}>
        <AppText variant="h2">Notes</AppText>
        <AppButton title="+ New" variant="ghost" size="sm" onPress={handleCreate} />
      </View>

      {/* Search */}
      <AppInput
        variant="search"
        placeholder="Search"
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.search}
      />

      {/* Filter chips */}
      {filterChips.length > 1 && (
        <View style={styles.chipRow}>
          {filterChips.map((chip) => (
            <AppBadge
              key={chip}
              label={chip}
              selected={selectedFilter === chip}
              onPress={() => setSelectedFilter(chip)}
            />
          ))}
        </View>
      )}

      {/* Error state */}
      {error && (
        <View style={styles.errorRow}>
          <AppText variant="caption" color="#DC2626">
            {error}
          </AppText>
          <AppButton title="Retry" variant="ghost" size="xs" onPress={hydrate} />
        </View>
      )}

      {/* Notes list */}
      <FlatList
        data={filteredNotes}
        keyExtractor={keyExtractor}
        renderItem={renderNoteItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !loading ? (
            isFiltering ? (
              <AppEmptyState
                title="No matching notes"
                description="Try another search or clear filters."
                action={
                  <AppButton
                    title="Clear Filters"
                    variant="ghost"
                    size="sm"
                    onPress={() => {
                      setSearchQuery('');
                      setSelectedFilter('All');
                    }}
                  />
                }
              />
            ) : (
              <AppEmptyState
                title="No notes"
                description="Tap + New to create your first note."
                action={<AppButton title="New Note" onPress={handleCreate} size="sm" />}
              />
            )
          ) : null
        }
      />

      {/* Action menu */}
      <NoteActionMenu
        visible={actionMenuNote !== null}
        noteTitle={actionMenuNote?.title ?? ''}
        isArchived={actionMenuNote?.isArchived ?? false}
        onArchive={handleArchiveFromMenu}
        onDelete={handleDeleteFromMenu}
        onClose={() => setActionMenuNote(null)}
      />

      {/* Toast */}
      <AppToast
        visible={toast.visible}
        message={toast.message}
        actionLabel={toast.undoAction ? 'Undo' : undefined}
        onAction={toast.undoAction ?? undefined}
        onDismiss={hideToast}
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
    flexWrap: 'wrap',
  },
  errorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  list: {
    paddingBottom: spacing.xxl,
  },
});
