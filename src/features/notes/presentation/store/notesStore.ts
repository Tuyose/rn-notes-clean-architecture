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

/** Snapshot of a note before archive/delete, used for undo. */
interface NoteSnapshot {
  note: Note;
  wasArchived: boolean;
}

interface ToastState {
  visible: boolean;
  message: string;
  undoAction: (() => Promise<void>) | null;
}

interface NotesState {
  notes: Note[];
  selectedNote: Note | null;
  loading: boolean;
  hydrated: boolean;
  error: string | null;
  toast: ToastState;

  hydrate: () => Promise<void>;
  loadNotes: () => Promise<void>;
  loadNoteById: (id: string) => Promise<void>;
  createNote: (input: CreateNoteInput) => Promise<Note>;
  updateNote: (id: string, input: UpdateNoteInput) => Promise<Note>;
  archiveNote: (id: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  undoArchive: (snapshot: NoteSnapshot) => Promise<void>;
  undoDelete: (snapshot: NoteSnapshot) => Promise<void>;
  showToast: (message: string, undoAction: (() => Promise<void>) | null) => void;
  hideToast: () => void;
  clearSelected: () => void;
}

async function refreshNotes(
  set: (partial: Partial<NotesState>) => void,
): Promise<Note[]> {
  const notes = await getNotesUseCase.execute();
  set({ notes });
  return notes;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  selectedNote: null,
  loading: false,
  hydrated: false,
  error: null,
  toast: { visible: false, message: '', undoAction: null },

  hydrate: async () => {
    if (get().hydrated) return;
    set({ loading: true, error: null });
    try {
      const asyncRepo = repository as AsyncStorageNotesRepository;
      if (asyncRepo.hydrate) {
        await asyncRepo.hydrate();
      }
      await refreshNotes(set);
      set({ loading: false, hydrated: true });
    } catch (e) {
      set({ error: (e as Error).message, loading: false, hydrated: true });
    }
  },

  loadNotes: async () => {
    set({ loading: true, error: null });
    try {
      await refreshNotes(set);
      set({ loading: false });
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
      await refreshNotes(set);
      set({ loading: false });
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
      await refreshNotes(set);
      set({ selectedNote: note, loading: false });
      return note;
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
      throw e;
    }
  },

  archiveNote: async (id: string) => {
    const existing = await getNoteByIdUseCase.execute(id);
    if (!existing) return;

    const snapshot: NoteSnapshot = {
      note: { ...existing },
      wasArchived: existing.isArchived,
    };

    set({ loading: true, error: null });
    try {
      await archiveNoteUseCase.execute(id);
      await refreshNotes(set);
      const selectedNote = await getNoteByIdUseCase.execute(id);
      set({ selectedNote, loading: false });

      const label = snapshot.wasArchived ? 'Note unarchived' : 'Note archived';
      get().showToast(label, () => get().undoArchive(snapshot));
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  deleteNote: async (id: string) => {
    const existing = await getNoteByIdUseCase.execute(id);
    if (!existing) return;

    const snapshot: NoteSnapshot = {
      note: { ...existing },
      wasArchived: existing.isArchived,
    };

    set({ loading: true, error: null });
    try {
      await deleteNoteUseCase.execute(id);
      await refreshNotes(set);
      set({ selectedNote: null, loading: false });

      get().showToast('Note deleted', () => get().undoDelete(snapshot));
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  undoArchive: async (snapshot: NoteSnapshot) => {
    set({ loading: true, error: null });
    try {
      // Restore the note to its previous archive state
      if (snapshot.wasArchived) {
        // Was archived before, we archived it again — undo re-archives
        await repository.archiveNote(snapshot.note.id);
      } else {
        // Was not archived, we archived it — undo unarchives
        await repository.unarchiveNote(snapshot.note.id);
      }
      await refreshNotes(set);
      set({ loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  undoDelete: async (snapshot: NoteSnapshot) => {
    set({ loading: true, error: null });
    try {
      // Recreate the deleted note
      await repository.createNote({
        title: snapshot.note.title,
        body: snapshot.note.body,
        tags: snapshot.note.tags,
      });
      // If it was archived, re-archive it
      if (snapshot.note.isArchived) {
        const notes = await getNotesUseCase.execute();
        const recreated = notes.find((n) => n.title === snapshot.note.title);
        if (recreated) {
          await repository.archiveNote(recreated.id);
        }
      }
      await refreshNotes(set);
      set({ loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  showToast: (message: string, undoAction: (() => Promise<void>) | null) => {
    set({ toast: { visible: true, message, undoAction } });
  },

  hideToast: () => {
    set({ toast: { visible: false, message: '', undoAction: null } });
  },

  clearSelected: () => {
    set({ selectedNote: null });
  },
}));
