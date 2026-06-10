import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { AppText, AppScreen } from '../../../../core/design-system';
import { colors } from '../../../../core/theme';
import { useNotesStore } from '../store';
import { NoteEditorScreen } from './NoteEditorScreen';

/**
 * Note detail/editor route — loads the note then delegates to NoteEditorScreen.
 */
export function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedNote, loading, loadNoteById, clearSelected } = useNotesStore();

  useEffect(() => {
    if (id) {
      loadNoteById(id);
    }
    return () => clearSelected();
  }, [id, loadNoteById, clearSelected]);

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

  if (!selectedNote) {
    return (
      <AppScreen>
        <View style={styles.center}>
          <AppText variant="caption" color={colors.gray400}>
            Note not found
          </AppText>
        </View>
      </AppScreen>
    );
  }

  return <NoteEditorScreen note={selectedNote} />;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
