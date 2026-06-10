import { create } from 'zustand';
import type { Note, CreateNoteInput } from '../../domain/entities';
import { InMemoryNotesRepository } from '../../data/repositories';
import { createDemoNotes } from '../../data/seed';
import {
  GetNotesUseCase,
  GetNoteByIdUseCase,
  CreateNoteUseCase,
  ArchiveNoteUseCase,
  DeleteNoteUseCase,
} from '../../domain/use-cases';

/**
 * Singleton repository instance.
 * Replace with a factory when adding persistence.
 */
const repository = new InMemoryNotesRepository();

// Seed demo data on first load so the app never starts completely empty.
repository.seed(createDemoNotes());

const getNotesUseCase = new GetNotesUseCase(repository);
const getNoteByIdUseCase = new GetNoteByIdUseCase(repository);
const createNoteUseCase = new CreateNoteUseCase(repository);
const archiveNoteUseCase = new ArchiveNoteUseCase(repository);
const deleteNoteUseCase = new DeleteNoteUseCase(repository);

interface NotesState {
  notes: Note[];
  selectedNote: Note | null;
  loading: boolean;
  error: string | null;

  // Actions
  loadNotes: () => Promise<void>;
  loadNoteById: (id: string) => Promise<void>;
  createNote: (input: CreateNoteInput) => Promise<void>;
  archiveNote: (id: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  clearSelected: () => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  selectedNote: null,
  loading: false,
  error: null,

  loadNotes: async () => {
    set({ loading: true, error: null });
    try {
      const notes = await getNotesUseCase.execute();
      set({ notes, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  loadNoteById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const note = await getNoteByIdUseCase.execute(id);
      set({ selectedNote: note, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  createNote: async (input: CreateNoteInput) => {
    set({ loading: true, error: null });
    try {
      await createNoteUseCase.execute(input);
      const notes = await getNotesUseCase.execute();
      set({ notes, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  archiveNote: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await archiveNoteUseCase.execute(id);
      const notes = await getNotesUseCase.execute();
      const selectedNote = await getNoteByIdUseCase.execute(id);
      set({ notes, selectedNote, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  deleteNote: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteNoteUseCase.execute(id);
      const notes = await getNotesUseCase.execute();
      set({ notes, selectedNote: null, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  clearSelected: () => {
    set({ selectedNote: null });
  },
}));
