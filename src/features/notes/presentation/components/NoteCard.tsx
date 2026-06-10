import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText, AppCard, AppBadge } from '../../../../core/design-system';
import { colors, spacing, typography } from '../../../../core/theme';
import type { Note } from '../../domain/entities';

interface NoteCardProps {
  note: Note;
  onPress: (note: Note) => void;
}

export function NoteCard({ note, onPress }: NoteCardProps) {
  const preview = note.body.length > 120 ? `${note.body.slice(0, 120)}...` : note.body;
  const relativeDate = getRelativeDate(note.updatedAt);

  return (
    <Pressable
      onPress={() => onPress(note)}
      accessibilityRole="button"
      style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
    >
      <AppCard variant="default" style={styles.card}>
        {/* Title row */}
        <View style={styles.titleRow}>
          <AppText variant="h3" style={styles.title} numberOfLines={1}>
            {note.title}
          </AppText>
          {note.isArchived && <AppBadge label="Archived" color={colors.gray500} />}
        </View>

        {/* Body preview */}
        <AppText
          variant="body"
          color={colors.gray600}
          numberOfLines={2}
          style={styles.body}
        >
          {preview}
        </AppText>

        {/* Footer: tags + time */}
        <View style={styles.footer}>
          <View style={styles.tags}>
            {note.tags.slice(0, 3).map((tag) => (
              <AppBadge key={tag} label={tag} />
            ))}
            {note.tags.length > 3 && (
              <AppText variant="caption" color={colors.gray400}>
                +{note.tags.length - 3}
              </AppText>
            )}
          </View>
          <AppText variant="caption" color={colors.gray400}>
            {relativeDate}
          </AppText>
        </View>
      </AppCard>
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

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    flex: 1,
    marginRight: spacing.sm,
    fontSize: typography.sizes.lg,
  },
  body: {
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tags: {
    flexDirection: 'row',
    gap: spacing.xs,
    flex: 1,
    flexWrap: 'wrap',
  },
});
