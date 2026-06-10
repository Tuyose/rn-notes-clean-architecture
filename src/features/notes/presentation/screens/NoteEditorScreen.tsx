import React, { useCallback, useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AppText,
  AppButton,
  AppInput,
  AppScreen,
  ScreenHeader,
} from '../../../../core/design-system';
import { colors, spacing } from '../../../../core/theme';
import { useNotesStore } from '../store';
import { noteFormSchema, parseTagsString, tagsToString } from '../../validation';
import type { NoteFormData } from '../../validation';
import type { Note } from '../../domain/entities';

interface NoteEditorScreenProps {
  /** Existing note to edit. If null, creates a new note. */
  note?: Note | null;
}

/**
 * Unified note editor for both creating and editing notes.
 *
 * - New note: empty fields, Save calls createNote
 * - Existing note: pre-filled fields, Save calls updateNote
 * - Dirty tracking: shows "Unsaved" hint when content changes
 */
export function NoteEditorScreen({ note }: NoteEditorScreenProps) {
  const router = useRouter();
  const { createNote, updateNote, archiveNote, deleteNote, loading } = useNotesStore();
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isNew = !note;

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: note?.title ?? '',
      body: note?.body ?? '',
      tags: note ? tagsToString(note.tags) : '',
    },
  });

  // Reset form when note changes
  useEffect(() => {
    if (note) {
      reset({
        title: note.title,
        body: note.body,
        tags: tagsToString(note.tags),
      });
    }
  }, [note, reset]);

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  const onSubmit = useCallback(
    async (data: NoteFormData) => {
      try {
        if (isNew) {
          await createNote({
            title: data.title,
            body: data.body ?? '',
            tags: parseTagsString(data.tags),
          });
        } else {
          await updateNote(note!.id, {
            title: data.title,
            body: data.body ?? '',
            tags: parseTagsString(data.tags),
          });
        }

        // Show saved feedback
        setSaved(true);
        if (savedTimer.current) clearTimeout(savedTimer.current);
        savedTimer.current = setTimeout(() => setSaved(false), 1500);

        if (isNew) {
          router.back();
        }
      } catch {
        // Error is handled by the store
      }
    },
    [isNew, note, createNote, updateNote, router],
  );

  const handleSave = useCallback(() => {
    handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  const handleArchive = useCallback(async () => {
    if (!note) return;
    Alert.alert(
      note.isArchived ? 'Unarchive' : 'Archive',
      note.isArchived ? 'Move back to active notes?' : 'Move to archive?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: note.isArchived ? 'Unarchive' : 'Archive',
          onPress: async () => {
            await archiveNote(note.id);
            router.back();
          },
        },
      ],
    );
  }, [note, archiveNote, router]);

  const handleDelete = useCallback(async () => {
    if (!note) return;
    Alert.alert('Delete', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteNote(note.id);
          router.back();
        },
      },
    ]);
  }, [note, deleteNote, router]);

  const updatedDate = note
    ? new Date(note.updatedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <AppScreen>
      <ScreenHeader
        onBack={() => router.back()}
        rightAction={
          <AppButton
            title={saved ? 'Saved' : 'Save'}
            variant="ghost"
            size="sm"
            onPress={handleSave}
            loading={loading}
            disabled={loading}
          />
        }
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <AppInput
                placeholder="Title"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.title?.message}
                autoFocus={isNew}
                variant="borderless"
                style={styles.titleInput}
              />
            </View>
          )}
        />

        {/* Body */}
        <Controller
          control={control}
          name="body"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <AppInput
                placeholder="Start writing…"
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.body?.message}
                multiline
                numberOfLines={10}
                variant="borderless"
                style={styles.bodyInput}
              />
            </View>
          )}
        />

        {/* Tags */}
        <View style={styles.tagsRow}>
          <Controller
            control={control}
            name="tags"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                placeholder="Add tags"
                value={value ?? ''}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.tags?.message}
                variant="borderless"
                style={styles.tagsInput}
              />
            )}
          />
        </View>

        {/* Metadata */}
        <View style={styles.metaRow}>
          <AppText variant="caption" color={colors.gray400}>
            {isNew ? 'Local draft' : `Updated ${updatedDate}`}
          </AppText>
          {isDirty && !isNew && (
            <AppText variant="caption" color={colors.warning}>
              Unsaved
            </AppText>
          )}
        </View>

        {/* Actions — only for existing notes */}
        {!isNew && (
          <View style={styles.actions}>
            <AppButton
              title={note!.isArchived ? 'Unarchive' : 'Archive'}
              variant="ghost"
              size="sm"
              onPress={handleArchive}
            />
            <View style={styles.actionDivider} />
            <AppButton title="Delete" variant="danger" size="sm" onPress={handleDelete} />
          </View>
        )}
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
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    paddingVertical: spacing.xs,
    marginBottom: spacing.xs,
  },
  bodyInput: {
    minHeight: 200,
    textAlignVertical: 'top',
    lineHeight: 26,
    paddingVertical: spacing.xs,
  },
  tagsRow: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  tagsInput: {
    fontSize: 14,
    paddingVertical: spacing.xs,
  },
  metaRow: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
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
