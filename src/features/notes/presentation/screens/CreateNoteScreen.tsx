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
    defaultValues: { title: '', body: '', tags: '' },
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
        onBack={() => router.back()}
        rightAction={
          <AppButton
            title="Save"
            variant="ghost"
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
        {/* Title — large, borderless, document-style */}
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
                autoFocus
                variant="borderless"
                style={styles.titleInput}
              />
            </View>
          )}
        />

        {/* Body — writing surface */}
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
                numberOfLines={10}
                variant="borderless"
                style={styles.bodyInput}
              />
            </View>
          )}
        />

        {/* Tags — subtle, collapsed */}
        <View style={styles.tagsRow}>
          <Controller
            control={control}
            name="tags"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                placeholder="Add tags"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.tags?.message}
                variant="borderless"
                style={styles.tagsInput}
              />
            )}
          />
        </View>

        {/* Metadata hint */}
        <AppText variant="caption" color={colors.gray400} style={styles.meta}>
          Local draft
        </AppText>
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
  meta: {
    marginTop: spacing.lg,
  },
});
