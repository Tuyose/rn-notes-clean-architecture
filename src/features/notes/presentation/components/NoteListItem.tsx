import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, AppBadge } from '../../../../core/design-system';
import { colors, spacing, typography } from '../../../../core/theme';
import type { Note } from '../../domain/entities';

interface NoteListItemProps {
  note: Note;
  onPress: (note: Note) => void;
  onLongPress?: (note: Note) => void;
}

/**
 * Compact note row for the inbox list.
 * Shows title, 1-line preview, first 2 tags, and relative time.
 * Supports long press for action menu.
 */
export function NoteListItem({ note, onPress, onLongPress }: NoteListItemProps) {
  const preview = note.body.length > 80 ? `${note.body.slice(0, 80)}…` : note.body;
  const relativeDate = getRelativeDate(note.updatedAt);

  return (
    <Pressable
      onPress={() => onPress(note)}
      onLongPress={onLongPress ? () => onLongPress(note) : undefined}
      delayLongPress={400}
      accessibilityRole="button"
      style={({ pressed }) => [styles.wrapper, pressed && styles.pressed]}
    >
      <View style={styles.row}>
        <View style={styles.content}>
          <AppText style={styles.title} numberOfLines={1}>
            {note.title}
          </AppText>
          {preview.length > 0 && (
            <AppText
              variant="caption"
              color={colors.gray500}
              numberOfLines={1}
              style={styles.preview}
            >
              {preview}
            </AppText>
          )}
        </View>
        <AppText variant="caption" color={colors.gray400} style={styles.time}>
          {relativeDate}
        </AppText>
      </View>
      {note.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {note.tags.slice(0, 2).map((tag) => (
            <AppBadge key={tag} label={tag} />
          ))}
          {note.tags.length > 2 && (
            <AppText variant="caption" color={colors.gray400}>
              +{note.tags.length - 2}
            </AppText>
          )}
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
    paddingHorizontal: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  pressed: {
    backgroundColor: colors.gray100,
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
    fontSize: typography.sizes.md,
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
    alignItems: 'center',
  },
});
