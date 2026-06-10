import { z } from 'zod';

/**
 * Zod schema for creating a note.
 * Used by React Hook Form via @hookform/resolvers/zod.
 */
export const createNoteSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less'),
  body: z
    .string()
    .min(1, 'Body is required')
    .max(5000, 'Body must be 5000 characters or less'),
  tags: z.string().optional(),
});

export type CreateNoteFormData = z.infer<typeof createNoteSchema>;

/**
 * Convert comma-separated tags string to array.
 * Shared utility for the presentation layer.
 */
export function parseTagsString(tags?: string): string[] {
  if (!tags?.trim()) return [];
  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}
