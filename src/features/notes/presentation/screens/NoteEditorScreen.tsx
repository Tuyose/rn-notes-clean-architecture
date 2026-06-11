import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AppText,
  AppButton,
  AppInput,
  AppScreen,
  ScreenHeader,
  AppToast,
} from '../../../../core/design-system';
import { colors, spacing } from '../../../../core/theme';
import { useNotesStore } from '../store';
import { noteFormSchema, parseTagsString, tagsToString } from '../../validation';
import type { NoteFormData } from '../../validation';
import type { Note } from '../../domain/entities';

interface NoteEditorScreenProps {
  note?: Note | null;
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'unsaved';

export function NoteEditorScreen({ note }: NoteEditorScreenProps) {
  const router = useRouter();
  const { createNote, updateNote, archiveNote, deleteNote, toast, hideToast } =
    useNotesStore();
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasChanges = useRef(false);

  const isNew = !note;

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<NoteFormData>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: note?.title ?? '',
      body: note?.body ?? '',
      tags: note ? tagsToString(note.tags) : '',
    },
  });

  // Track if content has changed from the original
  useEffect(() => {
    const subscription = watch(() => {
      hasChanges.current = true;
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (note) {
      reset({
        title: note.title,
        body: note.body,
        tags: tagsToString(note.tags),
      });
      hasChanges.current = false;
    }
  }, [note, reset]);

  useEffect(() => {
    return () => {
      if (savedTimer.current) clearTimeout(savedTimer.current);
    };
  }, []);

  const handleBack = useCallback(() => {
    if (hasChanges.current && isDirty) {
      Alert.alert('Unsaved Changes', 'You have unsaved changes.', [
        { text: 'Keep Editing', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => router.back(),
        },
      ]);
    } else {
      router.back();
    }
  }, [isDirty, router]);

  const onSubmit = useCallback(
    async (data: NoteFormData) => {
      setSaveStatus('saving');
      Keyboard.dismiss();
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

        hasChanges.current = false;
        setSaveStatus('saved');
        if (savedTimer.current) clearTimeout(savedTimer.current);
        savedTimer.current = setTimeout(() => setSaveStatus('idle'), 2000);

        if (isNew) {
          router.back();
        }
      } catch {
        setSaveStatus('unsaved');
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

  const isUnsaved = isDirty && saveStatus !== 'saving' && saveStatus !== 'saved';

  const getSaveButtonTitle = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving…';
      case 'saved':
        return 'Saved';
      default:
        return 'Save';
    }
  };

  const canSave = isNew || isUnsaved || saveStatus === 'saving';

  return (
    <AppScreen noVerticalPadding>
      <ScreenHeader
        onBack={handleBack}
        rightAction={
          <AppButton
            title={getSaveButtonTitle()}
            variant="ghost"
            size="sm"
            onPress={handleSave}
            loading={saveStatus === 'saving'}
            disabled={!canSave && !isNew}
          />
        }
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <Pressable style={styles.dismissArea} onPress={Keyboard.dismiss}>
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
                    returnKeyType="next"
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
                    textAlignVertical="top"
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
                    placeholder="Add tags (comma separated)"
                    value={value ?? ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.tags?.message}
                    variant="borderless"
                    style={styles.tagsInput}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                  />
                )}
              />
            </View>

            {/* Metadata */}
            <View style={styles.metaRow}>
              <AppText variant="caption" color={colors.gray400}>
                {isNew ? 'Local draft' : `Updated ${updatedDate}`}
              </AppText>
              {isUnsaved && !isNew && (
                <AppText variant="caption" color={colors.warning}>
                  Unsaved changes
                </AppText>
              )}
              {saveStatus === 'saved' && !isNew && (
                <AppText variant="caption" color={colors.success}>
                  Saved
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
                <AppButton
                  title="Delete"
                  variant="danger"
                  size="sm"
                  onPress={handleDelete}
                />
              </View>
            )}
          </ScrollView>
        </Pressable>
      </KeyboardAvoidingView>

      {/* Toast for undo feedback */}
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
  keyboardAvoid: {
    flex: 1,
  },
  dismissArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.md,
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
