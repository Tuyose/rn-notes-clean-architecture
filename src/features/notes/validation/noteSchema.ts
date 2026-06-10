import { z } from 'zod';

/**
 * Zod schema for creating/editing a note.
 * Body is optional — allows saving drafts with just a title.
 */
export const noteFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or less'),
  body: z.string().max(5000, 'Body must be 5000 characters or less').optional(),
  tags: z.string().optional(),
});

export type NoteFormData = z.infer<typeof noteFormSchema>;

/** @deprecated Use noteFormSchema instead */
export const createNoteSchema = noteFormSchema;
export type CreateNoteFormData = NoteFormData;

/**
 * Convert comma-separated tags string to array.
 */
export function parseTagsString(tags?: string): string[] {
  if (!tags?.trim()) return [];
  return tags
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

/**
 * Convert tags array to comma-separated string.
 */
export function tagsToString(tags: string[]): string {
  return tags.join(', ');
}
