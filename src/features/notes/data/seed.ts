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
      title: 'Product Launch Checklist',
      body:
        'Finalize App Store screenshots and metadata.\n' +
        'Test onboarding flow with 3 new users.\n' +
        'Verify push notification delivery on iOS and Android.\n' +
        'Prepare changelog and release notes.\n' +
        'Schedule launch announcement for social channels.',
      tags: ['work', 'planning'],
      isArchived: false,
      createdAt: new Date(now - 3 * day).toISOString(),
      updatedAt: new Date(now - 2 * hr).toISOString(),
    },
    {
      id: 'demo-2',
      title: 'Clean Architecture in React Native',
      body:
        'Separate domain logic from UI. Keep entities pure — no framework ' +
        'imports. Define repository interfaces in the domain layer, implement ' +
        'them in the data layer. Use cases orchestrate between presentation ' +
        'and data. This makes the codebase testable and swappable without ' +
        'touching the rest of the app.',
      tags: ['architecture', 'react-native'],
      isArchived: false,
      createdAt: new Date(now - 5 * day).toISOString(),
      updatedAt: new Date(now - 6 * hr).toISOString(),
    },
    {
      id: 'demo-3',
      title: 'UI Polish Sprint',
      body:
        'Upgrade design tokens for a softer, more premium feel.\n' +
        'Redesign note cards with better hierarchy and spacing.\n' +
        'Add horizontal tag chips for quick filtering.\n' +
        'Polish the editor screen to feel like a real composer.\n' +
        'Improve empty states and loading indicators.',
      tags: ['design', 'sprint'],
      isArchived: false,
      createdAt: new Date(now - 12 * hr).toISOString(),
      updatedAt: new Date(now - 30 * min).toISOString(),
    },
    {
      id: 'demo-4',
      title: 'Meeting Notes — Design Review',
      body:
        'Discussed card elevation vs border treatment. Decided to keep ' +
        'borders for now and add an "elevated" variant for emphasis cards. ' +
        'Also agreed to use a neutral background with subtle shadows for ' +
        'depth without visual noise. Next review scheduled for Friday.',
      tags: ['work', 'meeting'],
      isArchived: false,
      createdAt: new Date(now - 2 * day).toISOString(),
      updatedAt: new Date(now - 1 * day).toISOString(),
    },
    {
      id: 'demo-5',
      title: 'TypeScript Validation Patterns',
      body:
        'Zod schemas pair beautifully with React Hook Form via ' +
        '@hookform/resolvers/zod. Define the schema once, infer the ' +
        'TypeScript type, and let the resolver handle validation on submit. ' +
        'Error messages map directly to field-level display with no extra wiring.',
      tags: ['typescript', 'ideas'],
      isArchived: false,
      createdAt: new Date(now - 7 * day).toISOString(),
      updatedAt: new Date(now - 2 * day).toISOString(),
    },
    {
      id: 'demo-6',
      title: 'Weekend Project Ideas',
      body:
        'Build a habit tracker with streak visualization.\n' +
        'Try building a small CLI tool in Rust.\n' +
        'Experiment with Reanimated 3 for gesture-driven UI.\n' +
        'Write a blog post about clean architecture in mobile apps.',
      tags: ['personal', 'ideas'],
      isArchived: false,
      createdAt: new Date(now - 4 * day).toISOString(),
      updatedAt: new Date(now - 10 * hr).toISOString(),
    },
  ];
}
