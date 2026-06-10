import { generateId } from '../../../../utils/id';
import type { Note, CreateNoteInput, UpdateNoteInput } from '../../domain/entities';
import type { NotesRepository } from '../../domain/repositories';

/**
 * In-memory implementation of NotesRepository.
 *
 * Notes are stored in updatedAt descending order:
 * most recently updated notes appear first.
 */
export class InMemoryNotesRepository implements NotesRepository {
  private notes: Note[] = [];

  async getNotes(): Promise<Note[]> {
    return [...this.notes].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
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
    this.notes.unshift(note);
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
    // Remove from old position, insert at top
    this.notes.splice(index, 1);
    this.notes.unshift(updated);
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

  seed(notes: Note[]): void {
    this.notes = [...notes];
  }

  clear(): void {
    this.notes = [];
  }
}
