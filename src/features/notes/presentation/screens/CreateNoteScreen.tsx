import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AppText,
  AppButton,
  AppInput,
  AppCard,
  AppScreen,
  ScreenHeader,
} from '../../../../core/design-system';
import { colors, spacing } from '../../../../core/theme';
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
    mode: 'onBlur',
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
    <AppScreen>
      <ScreenHeader title="New Note" onBack={() => router.back()} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppText variant="body" color={colors.gray500} style={styles.intro}>
          Write something worth remembering.
        </AppText>

        <AppCard variant="default" style={styles.formCard}>
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
                placeholder="Write your note…"
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
              <View>
                <AppInput
                  label="Tags"
                  placeholder="react, typescript, ideas"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.tags?.message}
                />
                <AppText variant="caption" color={colors.gray400} style={styles.helper}>
                  Separate tags with commas. Leave empty for no tags.
                </AppText>
              </View>
            )}
          />
        </AppCard>

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
            disabled={loading}
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
    paddingBottom: spacing.xxl,
  },
  intro: {
    marginBottom: spacing.md,
  },
  formCard: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  bodyInput: {
    minHeight: 140,
    textAlignVertical: 'top',
  },
  helper: {
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
});
