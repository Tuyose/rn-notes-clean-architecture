import { InMemoryNotesRepository } from '../features/notes/data/repositories/InMemoryNotesRepository';
import { GetNotesUseCase } from '../features/notes/domain/use-cases/GetNotesUseCase';
import { GetNoteByIdUseCase } from '../features/notes/domain/use-cases/GetNoteByIdUseCase';
import { CreateNoteUseCase } from '../features/notes/domain/use-cases/CreateNoteUseCase';
import { UpdateNoteUseCase } from '../features/notes/domain/use-cases/UpdateNoteUseCase';
import { ArchiveNoteUseCase } from '../features/notes/domain/use-cases/ArchiveNoteUseCase';
import { DeleteNoteUseCase } from '../features/notes/domain/use-cases/DeleteNoteUseCase';

describe('Use Cases', () => {
  let repository: InMemoryNotesRepository;

  beforeEach(() => {
    repository = new InMemoryNotesRepository();
  });

  describe('GetNotesUseCase', () => {
    it('returns all notes from repository', async () => {
      await repository.createNote({ title: 'Note 1', body: 'Body 1' });
      await repository.createNote({ title: 'Note 2', body: 'Body 2' });

      const useCase = new GetNotesUseCase(repository);
      const notes = await useCase.execute();

      expect(notes).toHaveLength(2);
    });

    it('returns empty array when no notes exist', async () => {
      const useCase = new GetNotesUseCase(repository);
      const notes = await useCase.execute();

      expect(notes).toEqual([]);
    });
  });

  describe('GetNoteByIdUseCase', () => {
    it('returns note by id', async () => {
      const created = await repository.createNote({
        title: 'Test',
        body: 'Body',
      });

      const useCase = new GetNoteByIdUseCase(repository);
      const note = await useCase.execute(created.id);

      expect(note?.title).toBe('Test');
    });

    it('returns null for non-existent id', async () => {
      const useCase = new GetNoteByIdUseCase(repository);
      const note = await useCase.execute('non-existent');

      expect(note).toBeNull();
    });

    it('throws for empty id', async () => {
      const useCase = new GetNoteByIdUseCase(repository);
      await expect(useCase.execute('')).rejects.toThrow('Note ID is required');
    });
  });

  describe('CreateNoteUseCase', () => {
    it('creates a note', async () => {
      const useCase = new CreateNoteUseCase(repository);
      const note = await useCase.execute({
        title: 'New Note',
        body: 'New Body',
        tags: ['test'],
      });

      expect(note.title).toBe('New Note');
      expect(note.body).toBe('New Body');
      expect(note.tags).toEqual(['test']);
      expect(note.id).toBeDefined();
    });

    it('throws for empty title', async () => {
      const useCase = new CreateNoteUseCase(repository);
      await expect(useCase.execute({ title: '', body: 'Body' })).rejects.toThrow(
        'Note title is required',
      );
    });

    it('throws for whitespace-only title', async () => {
      const useCase = new CreateNoteUseCase(repository);
      await expect(useCase.execute({ title: '   ', body: 'Body' })).rejects.toThrow(
        'Note title is required',
      );
    });
  });

  describe('UpdateNoteUseCase', () => {
    it('updates an existing note', async () => {
      const created = await repository.createNote({
        title: 'Original',
        body: 'Body',
      });

      const useCase = new UpdateNoteUseCase(repository);
      const updated = await useCase.execute(created.id, {
        title: 'Updated',
      });

      expect(updated.title).toBe('Updated');
      expect(updated.body).toBe('Body');
    });

    it('throws for non-existent note', async () => {
      const useCase = new UpdateNoteUseCase(repository);
      await expect(useCase.execute('non-existent', { title: 'Test' })).rejects.toThrow(
        'Note with id "non-existent" not found',
      );
    });

    it('throws for empty id', async () => {
      const useCase = new UpdateNoteUseCase(repository);
      await expect(useCase.execute('', { title: 'Test' })).rejects.toThrow(
        'Note ID is required',
      );
    });
  });

  describe('ArchiveNoteUseCase', () => {
    it('archives a note', async () => {
      const created = await repository.createNote({
        title: 'Test',
        body: 'Body',
      });

      const useCase = new ArchiveNoteUseCase(repository);
      await useCase.execute(created.id);

      const archived = await repository.getNoteById(created.id);
      expect(archived?.isArchived).toBe(true);
    });

    it('throws for non-existent note', async () => {
      const useCase = new ArchiveNoteUseCase(repository);
      await expect(useCase.execute('non-existent')).rejects.toThrow(
        'Note with id "non-existent" not found',
      );
    });
  });

  describe('DeleteNoteUseCase', () => {
    it('deletes a note', async () => {
      const created = await repository.createNote({
        title: 'Test',
        body: 'Body',
      });

      const useCase = new DeleteNoteUseCase(repository);
      await useCase.execute(created.id);

      const found = await repository.getNoteById(created.id);
      expect(found).toBeNull();
    });

    it('throws for non-existent note', async () => {
      const useCase = new DeleteNoteUseCase(repository);
      await expect(useCase.execute('non-existent')).rejects.toThrow(
        'Note with id "non-existent" not found',
      );
    });
  });
});
