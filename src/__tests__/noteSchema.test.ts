import {
  createNoteSchema,
  parseTagsString,
} from '../features/notes/validation/noteSchema';

describe('createNoteSchema', () => {
  it('validates a valid note', () => {
    const result = createNoteSchema.safeParse({
      title: 'Test Note',
      body: 'Test body content',
      tags: 'test, demo',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('Test Note');
      expect(result.data.body).toBe('Test body content');
    }
  });

  it('fails when title is empty', () => {
    const result = createNoteSchema.safeParse({
      title: '',
      body: 'Test body',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Title is required');
    }
  });

  it('fails when title exceeds 100 characters', () => {
    const result = createNoteSchema.safeParse({
      title: 'a'.repeat(101),
      body: 'Test body',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Title must be 100 characters or less');
    }
  });

  it('fails when body is empty', () => {
    const result = createNoteSchema.safeParse({
      title: 'Test',
      body: '',
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Body is required');
    }
  });

  it('fails when body exceeds 5000 characters', () => {
    const result = createNoteSchema.safeParse({
      title: 'Test',
      body: 'a'.repeat(5001),
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Body must be 5000 characters or less');
    }
  });

  it('accepts note without tags', () => {
    const result = createNoteSchema.safeParse({
      title: 'Test',
      body: 'Body',
    });

    expect(result.success).toBe(true);
  });
});

describe('parseTagsString', () => {
  it('parses comma-separated tags', () => {
    expect(parseTagsString('react, typescript, testing')).toEqual([
      'react',
      'typescript',
      'testing',
    ]);
  });

  it('trims whitespace', () => {
    expect(parseTagsString('  react ,  typescript  ')).toEqual(['react', 'typescript']);
  });

  it('filters empty strings', () => {
    expect(parseTagsString('react,,,typescript')).toEqual(['react', 'typescript']);
  });

  it('returns empty array for undefined', () => {
    expect(parseTagsString(undefined)).toEqual([]);
  });

  it('returns empty array for empty string', () => {
    expect(parseTagsString('')).toEqual([]);
  });

  it('returns empty array for whitespace-only string', () => {
    expect(parseTagsString('   ')).toEqual([]);
  });
});
