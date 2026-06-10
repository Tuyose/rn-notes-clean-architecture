import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateId } from '../../../../utils/id';
import type { Note, CreateNoteInput, UpdateNoteInput } from '../../domain/entities';
import type { NotesRepository } from '../../domain/repositories';
import { createDemoNotes } from '../seed';

const STORAGE_KEY = 'rn-notes-clean-architecture:notes';

/**
 * AsyncStorage implementation of NotesRepository.
 *
 * Notes are persisted as JSON under a single key.
 * On first load (empty storage), demo notes are seeded automatically.
 * Corrupted JSON falls back to an empty array.
 */
export class AsyncStorageNotesRepository implements NotesRepository {
  private notes: Note[] = [];
  private loaded = false;

  /**
   * Load notes from AsyncStorage. Must be called before any other method.
   * Seeds demo notes if storage is empty.
   */
  async hydrate(): Promise<Note[]> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          this.notes = parsed as Note[];
        } else {
          this.notes = [];
        }
      } else {
        // First launch — seed demo notes
        this.notes = createDemoNotes();
        await this.persist();
      }
    } catch {
      // Corrupted JSON or storage error — fallback to demo notes
      this.notes = createDemoNotes();
      await this.persist();
    }
    this.loaded = true;
    return this.getNotes();
  }

  async getNotes(): Promise<Note[]> {
    this.ensureLoaded();
    return [...this.notes].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }

  async getNoteById(id: string): Promise<Note | null> {
    this.ensureLoaded();
    return this.notes.find((n) => n.id === id) ?? null;
  }

  async createNote(input: CreateNoteInput): Promise<Note> {
    this.ensureLoaded();
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
    await this.persist();
    return note;
  }

  async updateNote(id: string, input: UpdateNoteInput): Promise<Note> {
    this.ensureLoaded();
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
    this.notes.splice(index, 1);
    this.notes.unshift(updated);
    await this.persist();
    return updated;
  }

  async archiveNote(id: string): Promise<void> {
    this.ensureLoaded();
    const index = this.notes.findIndex((n) => n.id === id);
    if (index === -1) {
      throw new Error(`Note with id "${id}" not found`);
    }
    this.notes[index] = {
      ...this.notes[index],
      isArchived: true,
      updatedAt: new Date().toISOString(),
    };
    await this.persist();
  }

  async deleteNote(id: string): Promise<void> {
    this.ensureLoaded();
    const index = this.notes.findIndex((n) => n.id === id);
    if (index === -1) {
      throw new Error(`Note with id "${id}" not found`);
    }
    this.notes.splice(index, 1);
    await this.persist();
  }

  private async persist(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.notes));
    } catch {
      // Silent fail — storage may be full or unavailable
    }
  }

  private ensureLoaded(): void {
    if (!this.loaded) {
      throw new Error('AsyncStorageNotesRepository not hydrated. Call hydrate() first.');
    }
  }
}
