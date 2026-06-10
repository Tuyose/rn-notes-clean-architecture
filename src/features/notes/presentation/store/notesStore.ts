import { create } from 'zustand';
import type { Note, CreateNoteInput, UpdateNoteInput } from '../../domain/entities';
import { createNotesRepository } from '../../data/repositories';
import type { AsyncStorageNotesRepository } from '../../data/repositories';
import {
  GetNotesUseCase,
  GetNoteByIdUseCase,
  CreateNoteUseCase,
  UpdateNoteUseCase,
  ArchiveNoteUseCase,
  DeleteNoteUseCase,
} from '../../domain/use-cases';

const repository = createNotesRepository();

const getNotesUseCase = new GetNotesUseCase(repository);
const getNoteByIdUseCase = new GetNoteByIdUseCase(repository);
const createNoteUseCase = new CreateNoteUseCase(repository);
const updateNoteUseCase = new UpdateNoteUseCase(repository);
const archiveNoteUseCase = new ArchiveNoteUseCase(repository);
const deleteNoteUseCase = new DeleteNoteUseCase(repository);

interface NotesState {
  notes: Note[];
  selectedNote: Note | null;
  loading: boolean;
  hydrated: boolean;
  error: string | null;

  hydrate: () => Promise<void>;
  loadNotes: () => Promise<void>;
  loadNoteById: (id: string) => Promise<void>;
  createNote: (input: CreateNoteInput) => Promise<Note>;
  updateNote: (id: string, input: UpdateNoteInput) => Promise<Note>;
  archiveNote: (id: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  clearSelected: () => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  selectedNote: null,
  loading: false,
  hydrated: false,
  error: null,

  hydrate: async () => {
    if (get().hydrated) return;
    set({ loading: true, error: null });
    try {
      // Repository must be AsyncStorageNotesRepository for hydration
      const asyncRepo = repository as AsyncStorageNotesRepository;
      if (asyncRepo.hydrate) {
        await asyncRepo.hydrate();
      }
      const notes = await getNotesUseCase.execute();
      set({ notes, loading: false, hydrated: true });
    } catch (e) {
      set({ error: (e as Error).message, loading: false, hydrated: true });
    }
  },

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
      const note = await createNoteUseCase.execute(input);
      const notes = await getNotesUseCase.execute();
      set({ notes, loading: false });
      return note;
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
      throw e;
    }
  },

  updateNote: async (id: string, input: UpdateNoteInput) => {
    set({ loading: true, error: null });
    try {
      const note = await updateNoteUseCase.execute(id, input);
      const notes = await getNotesUseCase.execute();
      set({ notes, selectedNote: note, loading: false });
      return note;
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
      throw e;
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
