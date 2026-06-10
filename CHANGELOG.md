# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] — 2025-XX-XX

### Changed

- Design tokens: expanded neutral palette, added accent colors for tags, softer surfaces, richer shadows
- AppText: added `display` and `bodyMuted` variants, negative letter-spacing for headings
- AppBadge: tag chips now auto-color based on tag name, support `onPress` and `selected` state
- AppButton: added `soft` variant and `xs` size, proper pressed-state styling
- AppInput: added `search` variant for search bar styling
- AppCard: added `tinted` variant for muted surfaces
- AppScreen: increased horizontal padding to `spacing.lg`
- AppEmptyState: refined icon container and text hierarchy
- ScreenHeader: back button and right action moved to top row, title below
- NoteCard: redesigned with card border/shadow, better body preview, pressed scale feedback
- NotesListScreen: hero header with display title, search bar with search variant, horizontal filter chips
- CreateNoteScreen: clean editor layout with borderless title/body inputs, save in header, metadata hint
- NoteDetailScreen: large title, body with relaxed line height, metadata in muted surface section
- Seed data: 6 realistic notes (Product Launch, Clean Architecture, UI Polish Sprint, Meeting Notes, TypeScript Patterns, Weekend Ideas)

## [1.1.0] — 2025-XX-XX

### Added

- `ScreenHeader` reusable layout component with back button, title, subtitle, and right action
- `AppScreen` now handles bottom safe area for home indicator
- `AppCard` now supports `variant` prop: `default`, `flat`, `elevated`
- Demo data seeded on first launch (5 notes with realistic content)
- `src/features/notes/data/seed.ts` — stable demo note generator

### Changed

- Notes list screen: added product-style subtitle, integrated `ScreenHeader`
- Create note screen: form wrapped in `AppCard`, added helper text for tags, improved layout
- Note detail screen: metadata in flat card with divider, better badge layout, improved archive/unarchive messaging
- NoteCard: better body preview length, overflow indicator for tags, press opacity feedback
- Root layout: added gesture support and animation duration tuning
- Safe area now covers all four edges (top, bottom, left, right)

## [1.0.0] — 2025-01-XX

### Added

- Expo SDK 56 + TypeScript project with Expo Router
- Design system: AppText, AppButton, AppInput, AppCard, AppBadge, AppEmptyState
- Theme tokens: colors, spacing, typography, radius, shadows
- Note domain entity with CreateNoteInput and UpdateNoteInput
- NotesRepository interface (domain contract)
- InMemoryNotesRepository implementation
- Six use cases: GetNotes, GetNoteById, CreateNote, UpdateNote, ArchiveNote, DeleteNote
- Zustand store for notes state management
- Notes list screen with empty state and navigation
- Create note screen with React Hook Form + Zod validation
- Note detail screen with archive and delete actions
- Zod validation schema for note creation
- parseTagsString utility
- Unit tests for repository, use cases, validation schema, and AppEmptyState component
- ESLint + Prettier configuration
- GitHub Actions CI workflow
- Documentation: README, ARCHITECTURE, AI_USAGE, ROADMAP, CHANGELOG
