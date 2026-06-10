import { InMemoryNotesRepository } from '../features/notes/data/repositories/InMemoryNotesRepository';
import type { Note } from '../features/notes/domain/entities';

describe('InMemoryNotesRepository', () => {
  let repository: InMemoryNotesRepository;

  beforeEach(() => {
    repository = new InMemoryNotesRepository();
  });

  describe('getNotes', () => {
    it('returns empty array when no notes exist', async () => {
      const notes = await repository.getNotes();
      expect(notes).toEqual([]);
    });

    it('returns all notes', async () => {
      await repository.createNote({ title: 'Note 1', body: 'Body 1' });
      await repository.createNote({ title: 'Note 2', body: 'Body 2' });

      const notes = await repository.getNotes();
      expect(notes).toHaveLength(2);
    });
  });

  describe('getNoteById', () => {
    it('returns null for non-existent note', async () => {
      const note = await repository.getNoteById('non-existent');
      expect(note).toBeNull();
    });

    it('returns the note when found', async () => {
      const created = await repository.createNote({
        title: 'Test Note',
        body: 'Test Body',
      });
      const found = await repository.getNoteById(created.id);
      expect(found).toEqual(created);
    });
  });

  describe('createNote', () => {
    it('creates a note with generated id and timestamps', async () => {
      const note = await repository.createNote({
        title: 'Test Note',
        body: 'Test Body',
        tags: ['test'],
      });

      expect(note.id).toBeDefined();
      expect(note.title).toBe('Test Note');
      expect(note.body).toBe('Test Body');
      expect(note.tags).toEqual(['test']);
      expect(note.isArchived).toBe(false);
      expect(note.createdAt).toBeDefined();
      expect(note.updatedAt).toBeDefined();
    });

    it('defaults tags to empty array', async () => {
      const note = await repository.createNote({
        title: 'Test',
        body: 'Body',
      });
      expect(note.tags).toEqual([]);
    });
  });

  describe('updateNote', () => {
    it('updates note fields', async () => {
      const note = await repository.createNote({
        title: 'Original',
        body: 'Original body',
      });

      const updated = await repository.updateNote(note.id, {
        title: 'Updated',
      });

      expect(updated.title).toBe('Updated');
      expect(updated.body).toBe('Original body');
      // updatedAt should be >= createdAt (may be equal if same millisecond)
      expect(new Date(updated.updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(note.createdAt).getTime(),
      );
    });

    it('throws for non-existent note', async () => {
      await expect(
        repository.updateNote('non-existent', { title: 'Test' }),
      ).rejects.toThrow('Note with id "non-existent" not found');
    });
  });

  describe('archiveNote', () => {
    it('archives a note', async () => {
      const note = await repository.createNote({
        title: 'Test',
        body: 'Body',
      });

      await repository.archiveNote(note.id);
      const archived = await repository.getNoteById(note.id);

      expect(archived?.isArchived).toBe(true);
    });

    it('throws for non-existent note', async () => {
      await expect(repository.archiveNote('non-existent')).rejects.toThrow(
        'Note with id "non-existent" not found',
      );
    });
  });

  describe('deleteNote', () => {
    it('deletes a note', async () => {
      const note = await repository.createNote({
        title: 'Test',
        body: 'Body',
      });

      await repository.deleteNote(note.id);
      const found = await repository.getNoteById(note.id);

      expect(found).toBeNull();
    });

    it('throws for non-existent note', async () => {
      await expect(repository.deleteNote('non-existent')).rejects.toThrow(
        'Note with id "non-existent" not found',
      );
    });
  });

  describe('seed and clear', () => {
    it('seeds with provided notes', async () => {
      const notes: Note[] = [
        {
          id: '1',
          title: 'Seeded',
          body: 'Body',
          tags: [],
          isArchived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      repository.seed(notes);
      const result = await repository.getNotes();
      expect(result).toEqual(notes);
    });

    it('clears all notes', async () => {
      await repository.createNote({ title: 'Test', body: 'Body' });
      repository.clear();

      const notes = await repository.getNotes();
      expect(notes).toEqual([]);
    });
  });
});
