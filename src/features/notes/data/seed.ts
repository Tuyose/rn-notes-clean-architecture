import type { Note } from '../domain/entities';

/**
 * Demo notes that feel like real notes, not documentation.
 */
export function createDemoNotes(): Note[] {
  const now = Date.now();
  const hr = 3_600_000;
  const day = 86_400_000;

  return [
    {
      id: 'demo-1',
      title: 'Product Launch Checklist',
      body:
        '☐ Finalize App Store screenshots\n' +
        '☐ Test onboarding with 3 users\n' +
        '☐ Verify push notifications\n' +
        '☐ Write changelog\n' +
        '☐ Schedule social posts',
      tags: ['work'],
      isArchived: false,
      createdAt: new Date(now - 3 * day).toISOString(),
      updatedAt: new Date(now - 2 * hr).toISOString(),
    },
    {
      id: 'demo-2',
      title: 'Clean Architecture Notes',
      body:
        'Domain layer has zero dependencies. Entities are pure TS, no framework imports. ' +
        'Repository interfaces live in domain, implementations in data layer. ' +
        'Use cases orchestrate — they call repos and return results. ' +
        'Presentation depends on use cases, never directly on repos.',
      tags: ['architecture'],
      isArchived: false,
      createdAt: new Date(now - 5 * day).toISOString(),
      updatedAt: new Date(now - 6 * hr).toISOString(),
    },
    {
      id: 'demo-3',
      title: 'Grocery List',
      body: 'Oat milk\nAvocados\nSourdough bread\nOlive oil\nCherry tomatoes\nFeta cheese\nLemons',
      tags: ['personal'],
      isArchived: false,
      createdAt: new Date(now - 1 * day).toISOString(),
      updatedAt: new Date(now - 4 * hr).toISOString(),
    },
    {
      id: 'demo-4',
      title: 'Meeting Notes — Design Review',
      body:
        'Decided to keep borders over elevation for cards. Agreed on warm neutral palette. ' +
        'Tag chips should be compact, not dominant. Editor screen needs to feel like a writing surface, not a form. ' +
        'Follow up Friday with updated mockups.',
      tags: ['work', 'meeting'],
      isArchived: false,
      createdAt: new Date(now - 2 * day).toISOString(),
      updatedAt: new Date(now - 1 * day).toISOString(),
    },
    {
      id: 'demo-5',
      title: 'Zod + React Hook Form',
      body:
        'Define schema with z.object(). Infer type with z.infer. Pass zodResolver to useForm. ' +
        'Errors map to field-level messages automatically. No extra wiring needed.',
      tags: ['typescript'],
      isArchived: false,
      createdAt: new Date(now - 7 * day).toISOString(),
      updatedAt: new Date(now - 2 * day).toISOString(),
    },
    {
      id: 'demo-6',
      title: 'Weekend Ideas',
      body: 'Build a habit tracker with streaks\nTry Rust CLI tool\nExperiment with Reanimated gestures\nWrite blog post on clean arch',
      tags: ['ideas'],
      isArchived: false,
      createdAt: new Date(now - 4 * day).toISOString(),
      updatedAt: new Date(now - 10 * hr).toISOString(),
    },
  ];
}
