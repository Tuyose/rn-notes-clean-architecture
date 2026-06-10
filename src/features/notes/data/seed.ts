import type { Note } from '../domain/entities';

/**
 * Demo notes shown on first launch.
 *
 * Each note has a stable `id` so deep-links and tests remain predictable.
 * Timestamps are relative to "now" so they always look fresh.
 */
export function createDemoNotes(): Note[] {
  const now = Date.now();
  const min = 60_000;
  const hr = 3_600_000;
  const day = 86_400_000;

  return [
    {
      id: 'demo-1',
      title: 'Welcome to Notes',
      body:
        'This is your space for ideas, drafts, and quick thoughts. ' +
        'Tap the + New button to create your first note, or browse the ' +
        'demo notes below to explore the app.',
      tags: ['getting-started'],
      isArchived: false,
      createdAt: new Date(now - 2 * day).toISOString(),
      updatedAt: new Date(now - 2 * day).toISOString(),
    },
    {
      id: 'demo-2',
      title: 'Clean Architecture in React Native',
      body:
        'Separate domain logic from UI. Keep entities pure — no framework ' +
        'imports. Define repository interfaces in the domain layer, implement ' +
        'them in the data layer. Use cases orchestrate between presentation ' +
        'and data. This makes the codebase testable and swappable.',
      tags: ['architecture', 'react-native'],
      isArchived: false,
      createdAt: new Date(now - 1 * day).toISOString(),
      updatedAt: new Date(now - 3 * hr).toISOString(),
    },
    {
      id: 'demo-3',
      title: 'Sprint Planning – Week 12',
      body:
        '1. Polish UI for portfolio screenshots\n' +
        '2. Add AsyncStorage persistence\n' +
        '3. Implement real search and tag filtering\n' +
        '4. Add edit note screen\n' +
        '5. Dark mode theme tokens',
      tags: ['planning', 'sprint'],
      isArchived: false,
      createdAt: new Date(now - 12 * hr).toISOString(),
      updatedAt: new Date(now - 45 * min).toISOString(),
    },
    {
      id: 'demo-4',
      title: 'Zod Validation Patterns',
      body:
        'Zod schemas work beautifully with React Hook Form via ' +
        '@hookform/resolvers/zod. Define the schema once, infer the ' +
        'TypeScript type, and let the resolver handle validation on submit. ' +
        'Error messages map directly to field-level display.',
      tags: ['typescript', 'validation'],
      isArchived: false,
      createdAt: new Date(now - 5 * day).toISOString(),
      updatedAt: new Date(now - 1 * day).toISOString(),
    },
    {
      id: 'demo-5',
      title: 'Meeting Notes — Design Review',
      body:
        'Discussed card elevation vs border treatment. Decided to keep ' +
        'borders for now and add an "elevated" variant for emphasis cards. ' +
        'Also agreed to use a neutral background with subtle shadows for ' +
        'depth without visual noise.',
      tags: ['design', 'meeting'],
      isArchived: true,
      createdAt: new Date(now - 7 * day).toISOString(),
      updatedAt: new Date(now - 2 * day).toISOString(),
    },
  ];
}
