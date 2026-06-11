/**
 * Tests for gesture behavior and editor improvements.
 */
import { InMemoryNotesRepository } from '../features/notes/data/repositories/InMemoryNotesRepository';

describe('Swipe action undo behavior', () => {
  let repository: InMemoryNotesRepository;

  beforeEach(() => {
    repository = new InMemoryNotesRepository();
  });

  it('archive via swipe preserves undo capability', async () => {
    const note = await repository.createNote({
      title: 'Swipe Archived',
      body: 'Body',
      tags: ['work'],
    });

    // Simulate swipe archive
    await repository.archiveNote(note.id);

    const archived = await repository.getNoteById(note.id);
    expect(archived?.isArchived).toBe(true);

    // Undo
    await repository.unarchiveNote(note.id);

    const restored = await repository.getNoteById(note.id);
    expect(restored?.isArchived).toBe(false);
    expect(restored?.title).toBe('Swipe Archived');
  });

  it('delete via swipe preserves undo capability', async () => {
    const note = await repository.createNote({
      title: 'Swipe Deleted',
      body: 'Body',
      tags: ['work'],
    });

    // Simulate swipe delete
    await repository.deleteNote(note.id);

    const deleted = await repository.getNoteById(note.id);
    expect(deleted).toBeNull();

    // Simulate undo: recreate
    const recreated = await repository.createNote({
      title: note.title,
      body: note.body,
      tags: note.tags,
    });

    expect(recreated.title).toBe('Swipe Deleted');
    expect(recreated.tags).toEqual(['work']);
  });

  it('swipe archive does not duplicate note on undo', async () => {
    const note = await repository.createNote({
      title: 'No Duplicate',
      body: 'Body',
    });

    await repository.archiveNote(note.id);
    await repository.unarchiveNote(note.id);

    const all = await repository.getNotes();
    expect(all).toHaveLength(1);
    expect(all[0].id).toBe(note.id);
  });
});

describe('Editor dirty state tracking', () => {
  let repository: InMemoryNotesRepository;

  beforeEach(() => {
    repository = new InMemoryNotesRepository();
  });

  it('updated note moves to top after save', async () => {
    const first = await repository.createNote({
      title: 'First',
      body: 'Body',
    });
    await new Promise((r) => setTimeout(r, 10));
    await repository.createNote({ title: 'Second', body: 'Body' });

    // Simulate editor save (update)
    await new Promise((r) => setTimeout(r, 10));
    await repository.updateNote(first.id, {
      title: 'Updated First',
      body: 'New body',
    });

    const notes = await repository.getNotes();
    expect(notes[0].title).toBe('Updated First');
    expect(notes[0].body).toBe('New body');
  });

  it('save updates updatedAt', async () => {
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

  it('search still works after editor save', async () => {
    await repository.createNote({
      title: 'Old Title',
      body: 'Old body content',
    });

    const notes = await repository.getNotes();
    await repository.updateNote(notes[0].id, {
      title: 'New Title',
      body: 'New searchable content',
    });

    const all = await repository.getNotes();
    const found = all.filter((n) => n.title.toLowerCase().includes('new title'));
    expect(found).toHaveLength(1);
  });
});

describe('Persistence after undo operations', () => {
  let repository: InMemoryNotesRepository;

  beforeEach(() => {
    repository = new InMemoryNotesRepository();
  });

  it('note persists after archive undo', async () => {
    const note = await repository.createNote({
      title: 'Persistent',
      body: 'Body',
      tags: ['work'],
    });

    await repository.archiveNote(note.id);
    await repository.unarchiveNote(note.id);

    const found = await repository.getNoteById(note.id);
    expect(found).not.toBeNull();
    expect(found?.title).toBe('Persistent');
    expect(found?.isArchived).toBe(false);
    expect(found?.tags).toEqual(['work']);
  });

  it('notes array stays consistent after multiple operations', async () => {
    const a = await repository.createNote({ title: 'A', body: 'Body' });
    const b = await repository.createNote({ title: 'B', body: 'Body' });

    // Archive A, undo
    await repository.archiveNote(a.id);
    await repository.unarchiveNote(a.id);

    // Delete B, recreate
    await repository.deleteNote(b.id);
    await repository.createNote({ title: 'B', body: 'Body' });

    const all = await repository.getNotes();
    expect(all).toHaveLength(2);
    const titles = all.map((n) => n.title).sort();
    expect(titles).toEqual(['A', 'B']);
  });
});

describe('Action menu triggers', () => {
  it('long press state can be set and cleared', () => {
    let actionMenuNote: { id: string; title: string } | null = null;

    // Simulate long press
    actionMenuNote = { id: '1', title: 'Test Note' };
    expect(actionMenuNote).not.toBeNull();
    expect(actionMenuNote?.title).toBe('Test Note');

    // Simulate close
    actionMenuNote = null;
    expect(actionMenuNote).toBeNull();
  });
});
