import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, AppBadge } from '../../../../core/design-system';
import { colors, spacing, typography } from '../../../../core/theme';
import type { Note } from '../../domain/entities';

interface NoteCardProps {
  note: Note;
  onPress: (note: Note) => void;
}

export function NoteCard({ note, onPress }: NoteCardProps) {
  const preview = note.body.length > 100 ? `${note.body.slice(0, 100)}…` : note.body;
  const relativeDate = getRelativeDate(note.updatedAt);

  return (
    <Pressable
      onPress={() => onPress(note)}
      accessibilityRole="button"
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}
    >
      <View style={styles.row}>
        <View style={styles.content}>
          <AppText variant="body" style={styles.title} numberOfLines={1}>
            {note.title}
          </AppText>
          <AppText
            variant="caption"
            color={colors.gray500}
            numberOfLines={1}
            style={styles.preview}
          >
            {preview}
          </AppText>
        </View>
        <AppText variant="caption" color={colors.gray400} style={styles.time}>
          {relativeDate}
        </AppText>
      </View>
      {note.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {note.tags.slice(0, 3).map((tag) => (
            <AppBadge key={tag} label={tag} />
          ))}
        </View>
      )}
    </Pressable>
  );
}

function getRelativeDate(isoDate: string): string {
  const now = new Date();
  const date = new Date(isoDate);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return 'now';
  if (diffMin < 60) return `${diffMin}m`;
  if (diffHr < 24) return `${diffHr}h`;
  if (diffDay < 7) return `${diffDay}d`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  pressed: {
    backgroundColor: colors.gray50,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xxs,
  },
  preview: {
    lineHeight: typography.sizes.sm * typography.lineHeights.normal,
  },
  time: {
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
});
