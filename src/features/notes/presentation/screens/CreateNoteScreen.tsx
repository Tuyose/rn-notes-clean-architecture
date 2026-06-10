import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AppText, AppButton, AppInput, AppScreen } from '../../../../core/design-system';
import { spacing } from '../../../../core/theme';
import { useNotesStore } from '../store';
import { createNoteSchema, parseTagsString } from '../../validation';
import type { CreateNoteFormData } from '../../validation';

export function CreateNoteScreen() {
  const router = useRouter();
  const { createNote, loading } = useNotesStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateNoteFormData>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: '',
      body: '',
      tags: '',
    },
  });

  const onSubmit = useCallback(
    async (data: CreateNoteFormData) => {
      await createNote({
        title: data.title,
        body: data.body,
        tags: parseTagsString(data.tags),
      });
      router.back();
    },
    [createNote, router],
  );

  return (
    <AppScreen noVerticalPadding>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerRow}>
          <AppButton
            title="← Back"
            variant="ghost"
            size="sm"
            onPress={() => router.back()}
          />
        </View>

        <AppText variant="h2" style={styles.heading}>
          New Note
        </AppText>

        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Title"
              placeholder="Note title"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.title?.message}
              autoFocus
            />
          )}
        />

        <Controller
          control={control}
          name="body"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Body"
              placeholder="Write your note..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.body?.message}
              multiline
              numberOfLines={6}
              style={styles.bodyInput}
            />
          )}
        />

        <Controller
          control={control}
          name="tags"
          render={({ field: { onChange, onBlur, value } }) => (
            <AppInput
              label="Tags"
              placeholder="tag1, tag2, tag3"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.tags?.message}
            />
          )}
        />

        <View style={styles.actions}>
          <AppButton
            title="Cancel"
            variant="secondary"
            onPress={() => router.back()}
            style={styles.cancelButton}
          />
          <AppButton
            title="Save Note"
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={styles.saveButton}
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
    gap: spacing.md,
  },
  headerRow: {
    marginBottom: spacing.xs,
  },
  heading: {
    marginBottom: spacing.sm,
  },
  bodyInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
});
