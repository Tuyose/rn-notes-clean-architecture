import React, { useCallback } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
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
import { colors, spacing, radius } from '../../../../core/theme';
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
      <ScreenHeader
        title="New Note"
        onBack={() => router.back()}
        rightAction={
          <AppButton
            title="Save"
            variant="soft"
            size="sm"
            onPress={handleSubmit(onSubmit)}
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
        {/* Title field — large, clean, feels like a note title */}
        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <AppInput
                placeholder="Note title"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.title?.message}
                autoFocus
                style={styles.titleInput}
              />
            </View>
          )}
        />

        {/* Body field — writing surface */}
        <Controller
          control={control}
          name="body"
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <AppInput
                placeholder="Start writing…"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.body?.message}
                multiline
                numberOfLines={8}
                style={styles.bodyInput}
              />
            </View>
          )}
        />

        {/* Tags field — secondary */}
        <View style={styles.tagsSection}>
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
                  Separate with commas. Leave empty for no tags.
                </AppText>
              </View>
            )}
          />
        </View>

        {/* Metadata hint */}
        <View style={styles.metaHint}>
          <View style={styles.metaDot} />
          <AppText variant="caption" color={colors.gray400}>
            Local only · Saved to device
          </AppText>
        </View>

        {/* Bottom save action */}
        <View style={styles.bottomActions}>
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
  titleInput: {
    fontSize: 22,
    fontWeight: '600',
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: spacing.sm,
    backgroundColor: 'transparent',
  },
  bodyInput: {
    minHeight: 180,
    textAlignVertical: 'top',
    borderWidth: 0,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
    lineHeight: 26,
  },
  tagsSection: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  helper: {
    marginTop: spacing.xxs,
  },
  metaHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  metaDot: {
    width: 6,
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.success,
  },
  bottomActions: {
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
