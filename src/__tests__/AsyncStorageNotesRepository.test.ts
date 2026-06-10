/**
 * Tests for AsyncStorageNotesRepository.
 *
 * AsyncStorage is mocked at the module level via Jest.
 * This tests the persistence logic without actual storage.
 */

const mockStorage: Record<string, string> = {};

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(async (key: string) => mockStorage[key] ?? null),
  setItem: jest.fn(async (key: string, value: string) => {
    mockStorage[key] = value;
  }),
  removeItem: jest.fn(async (key: string) => {
    delete mockStorage[key];
  }),
}));

import { AsyncStorageNotesRepository } from '../features/notes/data/repositories/AsyncStorageNotesRepository';

describe('AsyncStorageNotesRepository', () => {
  let repository: AsyncStorageNotesRepository;

  beforeEach(() => {
    // Clear mock storage
    for (const key of Object.keys(mockStorage)) {
      delete mockStorage[key];
    }
    repository = new AsyncStorageNotesRepository();
  });

  describe('hydrate', () => {
    it('seeds demo notes when storage is empty', async () => {
      const notes = await repository.hydrate();
      expect(notes.length).toBeGreaterThan(0);
    });

    it('loads persisted notes from storage', async () => {
      // First hydration seeds demo notes
      await repository.hydrate();
      const initialNotes = await repository.getNotes();

      // Create a new repository — should load from storage
      const repo2 = new AsyncStorageNotesRepository();
      await repo2.hydrate();
      const loadedNotes = await repo2.getNotes();

      expect(loadedNotes.length).toBe(initialNotes.length);
    });

    it('handles corrupted JSON gracefully', async () => {
      mockStorage['rn-notes-clean-architecture:notes'] = 'not-valid-json{{';

      const notes = await repository.hydrate();
      // Should fallback to demo notes
      expect(notes.length).toBeGreaterThan(0);
    });

    it('handles non-array JSON gracefully', async () => {
      mockStorage['rn-notes-clean-architecture:notes'] = '{"not": "an array"}';

      const notes = await repository.hydrate();
      expect(Array.isArray(notes)).toBe(true);
    });
  });

  describe('getNotes', () => {
    it('throws if not hydrated', async () => {
      await expect(repository.getNotes()).rejects.toThrow(
        'AsyncStorageNotesRepository not hydrated',
      );
    });

    it('returns notes sorted by updatedAt descending after hydration', async () => {
      await repository.hydrate();
      const notes = await repository.getNotes();
      expect(notes.length).toBeGreaterThan(0);

      // Verify sorted
      for (let i = 0; i < notes.length - 1; i++) {
        expect(new Date(notes[i].updatedAt).getTime()).toBeGreaterThanOrEqual(
          new Date(notes[i + 1].updatedAt).getTime(),
        );
      }
    });
  });

  describe('createNote', () => {
    it('creates and persists a note', async () => {
      await repository.hydrate();
      const note = await repository.createNote({
        title: 'Test Note',
        body: 'Test Body',
        tags: ['test'],
      });

      expect(note.title).toBe('Test Note');
      expect(note.body).toBe('Test Body');
      expect(note.tags).toEqual(['test']);
      expect(note.id).toBeDefined();

      // Verify persisted
      const repo2 = new AsyncStorageNotesRepository();
      await repo2.hydrate();
      const found = await repo2.getNoteById(note.id);
      expect(found?.title).toBe('Test Note');
    });

    it('inserts new notes at the top', async () => {
      await repository.hydrate();
      await repository.createNote({ title: 'First', body: 'Body' });
      await new Promise((r) => setTimeout(r, 10));
      const second = await repository.createNote({
        title: 'Second',
        body: 'Body',
      });

      const notes = await repository.getNotes();
      expect(notes[0].id).toBe(second.id);
    });
  });

  describe('updateNote', () => {
    it('updates and persists changes', async () => {
      await repository.hydrate();
      const note = await repository.createNote({
        title: 'Original',
        body: 'Body',
      });

      const updated = await repository.updateNote(note.id, {
        title: 'Updated',
      });

      expect(updated.title).toBe('Updated');

      // Verify persisted
      const repo2 = new AsyncStorageNotesRepository();
      await repo2.hydrate();
      const found = await repo2.getNoteById(note.id);
      expect(found?.title).toBe('Updated');
    });

    it('moves updated note to the top', async () => {
      await repository.hydrate();
      const first = await repository.createNote({
        title: 'First',
        body: 'Body',
      });
      await new Promise((r) => setTimeout(r, 10));
      await repository.createNote({ title: 'Second', body: 'Body' });

      await new Promise((r) => setTimeout(r, 10));
      await repository.updateNote(first.id, { title: 'Updated First' });

      const notes = await repository.getNotes();
      expect(notes[0].title).toBe('Updated First');
    });

    it('throws for non-existent note', async () => {
      await repository.hydrate();
      await expect(
        repository.updateNote('non-existent', { title: 'Test' }),
      ).rejects.toThrow('Note with id "non-existent" not found');
    });
  });

  describe('deleteNote', () => {
    it('deletes and persists', async () => {
      await repository.hydrate();
      const note = await repository.createNote({
        title: 'To Delete',
        body: 'Body',
      });

      await repository.deleteNote(note.id);
      const found = await repository.getNoteById(note.id);
      expect(found).toBeNull();

      // Verify persisted
      const repo2 = new AsyncStorageNotesRepository();
      await repo2.hydrate();
      const foundAgain = await repo2.getNoteById(note.id);
      expect(foundAgain).toBeNull();
    });

    it('throws for non-existent note', async () => {
      await repository.hydrate();
      await expect(repository.deleteNote('non-existent')).rejects.toThrow(
        'Note with id "non-existent" not found',
      );
    });
  });

  describe('archiveNote', () => {
    it('archives and persists', async () => {
      await repository.hydrate();
      const note = await repository.createNote({
        title: 'To Archive',
        body: 'Body',
      });

      await repository.archiveNote(note.id);
      const archived = await repository.getNoteById(note.id);
      expect(archived?.isArchived).toBe(true);

      // Verify persisted
      const repo2 = new AsyncStorageNotesRepository();
      await repo2.hydrate();
      const found = await repo2.getNoteById(note.id);
      expect(found?.isArchived).toBe(true);
    });

    it('throws for non-existent note', async () => {
      await repository.hydrate();
      await expect(repository.archiveNote('non-existent')).rejects.toThrow(
        'Note with id "non-existent" not found',
      );
    });
  });
});
