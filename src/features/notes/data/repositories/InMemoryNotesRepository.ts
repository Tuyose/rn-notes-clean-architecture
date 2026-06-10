import { generateId } from '../../../../utils/id';
import type { Note, CreateNoteInput, UpdateNoteInput } from '../../domain/entities';
import type { NotesRepository } from '../../domain/repositories';

/**
 * In-memory implementation of NotesRepository.
 *
 * Stores notes in a plain array. Perfect for the first sprint:
 * no persistence, no backend, just enough to wire up the full
 * vertical slice and validate the architecture.
 *
 * When you add AsyncStorage/SQLite later, create a new class that
 * implements NotesRepository — the rest of the app won't change.
 */
export class InMemoryNotesRepository implements NotesRepository {
  private notes: Note[] = [];

  async getNotes(): Promise<Note[]> {
    return [...this.notes];
  }

  async getNoteById(id: string): Promise<Note | null> {
    return this.notes.find((n) => n.id === id) ?? null;
  }

  async createNote(input: CreateNoteInput): Promise<Note> {
    const now = new Date().toISOString();
    const note: Note = {
      id: generateId(),
      title: input.title,
      body: input.body,
      tags: input.tags ?? [],
      isArchived: false,
      createdAt: now,
      updatedAt: now,
    };
    this.notes.push(note);
    return note;
  }

  async updateNote(id: string, input: UpdateNoteInput): Promise<Note> {
    const index = this.notes.findIndex((n) => n.id === id);
    if (index === -1) {
      throw new Error(`Note with id "${id}" not found`);
    }
    const existing = this.notes[index];
    const updated: Note = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };
    this.notes[index] = updated;
    return updated;
  }

  async archiveNote(id: string): Promise<void> {
    const index = this.notes.findIndex((n) => n.id === id);
    if (index === -1) {
      throw new Error(`Note with id "${id}" not found`);
    }
    this.notes[index] = {
      ...this.notes[index],
      isArchived: true,
      updatedAt: new Date().toISOString(),
    };
  }

  async deleteNote(id: string): Promise<void> {
    const index = this.notes.findIndex((n) => n.id === id);
    if (index === -1) {
      throw new Error(`Note with id "${id}" not found`);
    }
    this.notes.splice(index, 1);
  }

  /**
   * Seed the repository with test data.
   * Useful for development and testing.
   */
  seed(notes: Note[]): void {
    this.notes = [...notes];
  }

  /**
   * Clear all notes. Useful for test teardown.
   */
  clear(): void {
    this.notes = [];
  }
}
