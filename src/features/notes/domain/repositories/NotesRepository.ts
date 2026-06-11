import type { Note, CreateNoteInput, UpdateNoteInput } from '../entities';

/**
 * Repository contract for note persistence.
 *
 * The domain layer depends on this interface — never on the concrete
 * implementation. This keeps the dependency rule intact: inner layers
 * (domain) know nothing about outer layers (data, infrastructure).
 */
export interface NotesRepository {
  getNotes(): Promise<Note[]>;
  getNoteById(id: string): Promise<Note | null>;
  createNote(input: CreateNoteInput): Promise<Note>;
  updateNote(id: string, input: UpdateNoteInput): Promise<Note>;
  archiveNote(id: string): Promise<void>;
  unarchiveNote(id: string): Promise<void>;
  deleteNote(id: string): Promise<void>;
}
