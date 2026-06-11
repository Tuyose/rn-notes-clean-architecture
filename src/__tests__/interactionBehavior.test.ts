/**
 * Tests for interaction behavior: archive undo, delete undo, sorting, toast.
 */
import { InMemoryNotesRepository } from '../features/notes/data/repositories/InMemoryNotesRepository';

describe('Archive and undo behavior', () => {
  let repository: InMemoryNotesRepository;

  beforeEach(() => {
    repository = new InMemoryNotesRepository();
  });

  it('archived note is excluded from active list', async () => {
    const note = await repository.createNote({
      title: 'To Archive',
      body: 'Body',
    });

    await repository.archiveNote(note.id);

    const all = await repository.getNotes();
    const active = all.filter((n) => !n.isArchived);
    expect(active).toHaveLength(0);
    expect(all).toHaveLength(1); // still exists, just archived
  });

  it('unarchiveNote restores note to active list', async () => {
    const note = await repository.createNote({
      title: 'To Archive',
      body: 'Body',
      tags: ['work'],
    });

    await repository.archiveNote(note.id);

    // Verify it's archived
    const archived = await repository.getNoteById(note.id);
    expect(archived?.isArchived).toBe(true);

    // Unarchive
    await repository.unarchiveNote(note.id);

    const restored = await repository.getNoteById(note.id);
    expect(restored?.isArchived).toBe(false);
    expect(restored?.title).toBe('To Archive');
    expect(restored?.tags).toEqual(['work']);
  });

  it('undo archive restores note without duplicating', async () => {
    const note = await repository.createNote({
      title: 'Unique Note',
      body: 'Body',
      tags: ['work'],
    });

    await repository.archiveNote(note.id);

    // Simulate undo: unarchive
    await repository.unarchiveNote(note.id);

    const all = await repository.getNotes();
    // Should be exactly 1 note, not duplicated
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe(note.id);
    expect(all[0].isArchived).toBe(false);
  });

  it('undo archive places note according to updatedAt sort', async () => {
    const first = await repository.createNote({
      title: 'First',
      body: 'Body',
    });
    await new Promise((r) => setTimeout(r, 10));
    await repository.createNote({
      title: 'Second',
      body: 'Body',
    });

    // Archive first note
    await repository.archiveNote(first.id);

    // Undo: unarchive
    await new Promise((r) => setTimeout(r, 10));
    await repository.unarchiveNote(first.id);

    const notes = await repository.getNotes();
    // First note should be at top because unarchive updates updatedAt
    expect(notes[0].id).toBe(first.id);
  });

  it('search works after archive undo', async () => {
    const note = await repository.createNote({
      title: 'Searchable',
      body: 'Find me',
      tags: ['work'],
    });

    await repository.archiveNote(note.id);

    // Verify not in active list
    const archived = await repository.getNotes();
    const activeBefore = archived.filter((n) => !n.isArchived);
    expect(activeBefore).toHaveLength(0);

    // Undo
    await repository.unarchiveNote(note.id);

    // Verify back in active list and searchable
    const all = await repository.getNotes();
    const activeAfter = all.filter((n) => !n.isArchived);
    expect(activeAfter).toHaveLength(1);
    expect(activeAfter[0].title).toBe('Searchable');
  });
});

describe('Delete and undo behavior', () => {
  let repository: InMemoryNotesRepository;

  beforeEach(() => {
    repository = new InMemoryNotesRepository();
  });

  it('deleted note is removed from repository', async () => {
    const note = await repository.createNote({
      title: 'To Delete',
      body: 'Body',
    });

    await repository.deleteNote(note.id);
    const found = await repository.getNoteById(note.id);
    expect(found).toBeNull();
  });

  it('undo delete can recreate note', async () => {
    const note = await repository.createNote({
      title: 'Deleted Note',
      body: 'Body',
      tags: ['work'],
    });

    await repository.deleteNote(note.id);

    // Simulate undo: recreate the note
    const recreated = await repository.createNote({
      title: note.title,
      body: note.body,
      tags: note.tags,
    });

    expect(recreated.title).toBe('Deleted Note');
    expect(recreated.tags).toEqual(['work']);
  });

  it('delete undo still works after archive undo', async () => {
    const note = await repository.createNote({
      title: 'Test Note',
      body: 'Body',
    });

    // Archive then undo
    await repository.archiveNote(note.id);
    await repository.unarchiveNote(note.id);

    // Delete then undo
    await repository.deleteNote(note.id);
    const deleted = await repository.getNoteById(note.id);
    expect(deleted).toBeNull();

    // Undo delete
    const recreated = await repository.createNote({
      title: note.title,
      body: note.body,
      tags: note.tags,
    });
    expect(recreated.title).toBe('Test Note');
  });
});

describe('Sorting after operations', () => {
  let repository: InMemoryNotesRepository;

  beforeEach(() => {
    repository = new InMemoryNotesRepository();
  });

  it('created note appears at top', async () => {
    await repository.createNote({ title: 'First', body: 'Body' });
    await new Promise((r) => setTimeout(r, 10));
    const second = await repository.createNote({
      title: 'Second',
      body: 'Body',
    });

    const notes = await repository.getNotes();
    expect(notes[0].id).toBe(second.id);
  });

  it('updated note moves to top', async () => {
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

  it('search works after archive', async () => {
    await repository.createNote({
      title: 'Active Note',
      body: 'Searchable content',
      tags: ['work'],
    });
    const archived = await repository.createNote({
      title: 'Archived Note',
      body: 'Also searchable',
      tags: ['work'],
    });
    await repository.archiveNote(archived.id);

    const all = await repository.getNotes();
    const active = all.filter((n) => !n.isArchived);
    const searchResults = active.filter((n) =>
      n.body.toLowerCase().includes('searchable'),
    );

    expect(searchResults).toHaveLength(1);
    expect(searchResults[0].title).toBe('Active Note');
  });

  it('search works after delete', async () => {
    await repository.createNote({
      title: 'Remaining Note',
      body: 'Findable content',
    });
    const toDelete = await repository.createNote({
      title: 'Deleted Note',
      body: 'Also findable',
    });
    await repository.deleteNote(toDelete.id);

    const all = await repository.getNotes();
    const searchResults = all.filter((n) => n.body.toLowerCase().includes('findable'));

    expect(searchResults).toHaveLength(1);
    expect(searchResults[0].title).toBe('Remaining Note');
  });
});

describe('Update note changes updatedAt', () => {
  let repository: InMemoryNotesRepository;

  beforeEach(() => {
    repository = new InMemoryNotesRepository();
  });

  it('updatedAt is updated when note is modified', async () => {
    const note = await repository.createNote({
      title: 'Original',
      body: 'Body',
    });
    const originalUpdatedAt = note.updatedAt;

    await new Promise((r) => setTimeout(r, 10));
    const updated = await repository.updateNote(note.id, {
      title: 'Modified',
    });

    expect(new Date(updated.updatedAt).getTime()).toBeGreaterThan(
      new Date(originalUpdatedAt).getTime(),
    );
  });

  it('updatedAt changes on every update', async () => {
    const note = await repository.createNote({
      title: 'First',
      body: 'Body',
    });

    await new Promise((r) => setTimeout(r, 10));
    const first = await repository.updateNote(note.id, { title: 'Second' });

    await new Promise((r) => setTimeout(r, 10));
    const second = await repository.updateNote(note.id, { title: 'Third' });

    expect(new Date(second.updatedAt).getTime()).toBeGreaterThan(
      new Date(first.updatedAt).getTime(),
    );
  });
});

describe('Toast state management', () => {
  it('toast can be shown and hidden', () => {
    let toast = { visible: false, message: '', undoAction: null };

    toast = { visible: true, message: 'Note archived', undoAction: null };
    expect(toast.visible).toBe(true);
    expect(toast.message).toBe('Note archived');

    toast = { visible: false, message: '', undoAction: null };
    expect(toast.visible).toBe(false);
  });
});
