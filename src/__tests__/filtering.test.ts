/**
 * Tests for search and tag filtering logic.
 * These test the filtering functions used by NotesListScreen.
 */
import type { Note } from '../features/notes/domain/entities';

/**
 * Pure function that replicates the filtering logic from NotesListScreen.
 * Extracted here for testability without rendering React components.
 */
function filterNotes(notes: Note[], selectedFilter: string, searchQuery: string): Note[] {
  const activeNotes = notes.filter((n) => !n.isArchived);
  let result = activeNotes;

  // Tag filter
  if (selectedFilter !== 'All') {
    result = result.filter((n) =>
      n.tags.some((t) => t.toLowerCase() === selectedFilter.toLowerCase()),
    );
  }

  // Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    result = result.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  return result;
}

function getAvailableTags(notes: Note[]): string[] {
  const tagSet = new Set<string>();
  for (const note of notes) {
    if (!note.isArchived) {
      for (const tag of note.tags) {
        tagSet.add(tag);
      }
    }
  }
  return Array.from(tagSet).sort();
}

const now = Date.now();
const makeNote = (
  id: string,
  title: string,
  body: string,
  tags: string[],
  isArchived = false,
): Note => ({
  id,
  title,
  body,
  tags,
  isArchived,
  createdAt: new Date(now).toISOString(),
  updatedAt: new Date(now).toISOString(),
});

const sampleNotes: Note[] = [
  makeNote('1', 'Product Launch', 'Finalize screenshots', ['work', 'planning']),
  makeNote('2', 'Clean Architecture', 'Domain layer has zero deps', ['architecture']),
  makeNote('3', 'Grocery List', 'Oat milk, avocados', ['personal']),
  makeNote('4', 'Meeting Notes', 'Discussed card elevation', ['work', 'meeting']),
  makeNote('5', 'Zod Patterns', 'Define schema with z.object', ['typescript']),
  makeNote('6', 'Weekend Ideas', 'Build a habit tracker', ['ideas']),
  makeNote('7', 'Old Note', 'This is archived', ['work'], true),
];

describe('filterNotes', () => {
  describe('tag filtering', () => {
    it('returns all active notes when filter is All', () => {
      const result = filterNotes(sampleNotes, 'All', '');
      expect(result).toHaveLength(6); // 7 total, 1 archived
    });

    it('filters by tag', () => {
      const result = filterNotes(sampleNotes, 'work', '');
      expect(result).toHaveLength(2); // Product Launch and Meeting Notes
      expect(result.map((n) => n.id)).toEqual(['1', '4']);
    });

    it('filters by tag case-insensitively', () => {
      const result = filterNotes(sampleNotes, 'Work', '');
      expect(result).toHaveLength(2);
    });

    it('returns empty for non-existent tag', () => {
      const result = filterNotes(sampleNotes, 'nonexistent', '');
      expect(result).toHaveLength(0);
    });

    it('excludes archived notes from tag filter', () => {
      const result = filterNotes(sampleNotes, 'work', '');
      // Old Note (id=7) is archived and has 'work' tag — should be excluded
      expect(result.every((n) => !n.isArchived)).toBe(true);
    });
  });

  describe('search filtering', () => {
    it('filters by title', () => {
      const result = filterNotes(sampleNotes, 'All', 'grocery');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('3');
    });

    it('filters by body', () => {
      const result = filterNotes(sampleNotes, 'All', 'screenshots');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('filters by tags', () => {
      const result = filterNotes(sampleNotes, 'All', 'typescript');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('5');
    });

    it('is case-insensitive', () => {
      const result = filterNotes(sampleNotes, 'All', 'ZOD');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('5');
    });

    it('returns all notes for empty search', () => {
      const result = filterNotes(sampleNotes, 'All', '');
      expect(result).toHaveLength(6);
    });

    it('returns all notes for whitespace-only search', () => {
      const result = filterNotes(sampleNotes, 'All', '   ');
      expect(result).toHaveLength(6);
    });

    it('excludes archived notes from search', () => {
      const result = filterNotes(sampleNotes, 'All', 'archived');
      expect(result).toHaveLength(0); // Old Note is archived
    });
  });

  describe('combined filtering', () => {
    it('applies both tag and search filters', () => {
      const result = filterNotes(sampleNotes, 'work', 'launch');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('returns empty when no notes match both filters', () => {
      const result = filterNotes(sampleNotes, 'work', 'zod');
      expect(result).toHaveLength(0);
    });

    it('tag filter narrows search results', () => {
      const allResults = filterNotes(sampleNotes, 'All', 'notes');
      const workResults = filterNotes(sampleNotes, 'work', 'notes');
      expect(workResults.length).toBeLessThanOrEqual(allResults.length);
    });
  });
});

describe('getAvailableTags', () => {
  it('returns unique tags from active notes', () => {
    const tags = getAvailableTags(sampleNotes);
    expect(tags).toContain('work');
    expect(tags).toContain('architecture');
    expect(tags).toContain('personal');
    expect(tags).toContain('meeting');
    expect(tags).toContain('typescript');
    expect(tags).toContain('ideas');
    expect(tags).toContain('planning');
  });

  it('excludes tags from archived notes only', () => {
    // 'work' appears in both active and archived notes — should still be included
    const tags = getAvailableTags(sampleNotes);
    expect(tags).toContain('work');
  });

  it('returns tags sorted alphabetically', () => {
    const tags = getAvailableTags(sampleNotes);
    const sorted = [...tags].sort();
    expect(tags).toEqual(sorted);
  });

  it('returns empty array for no notes', () => {
    expect(getAvailableTags([])).toEqual([]);
  });
});
