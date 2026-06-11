# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.0] — 2025-XX-XX

### Added

- `SwipeableNoteRow` component with PanResponder + Animated swipe gestures
- Swipe left reveals Archive action, swipe right reveals Delete action
- `expo-haptics` for haptic feedback on swipe and long press
- Editor back guard: Alert dialog when leaving with unsaved changes
- `KeyboardAvoidingView` in editor for proper keyboard handling
- Auto-focus title only on new notes (not when editing existing)
- Gesture and editor behavior tests (113 total tests)

### Changed

- NotesListScreen uses SwipeableNoteRow instead of NoteListItem
- NoteEditorScreen wraps content in KeyboardAvoidingView
- NoteEditorScreen tracks dirty state via `watch()` subscription
- Test count increased from 104 to 113

## [0.3.0] — 2025-XX-XX

### Added

- `AppToast` component with slide-up animation (built-in Animated API)
- `NoteActionMenu` bottom-sheet modal for note actions
- Long press on note row opens action menu (archive, delete, cancel)
- Toast with undo feedback after archive and delete
- Store snapshot system for undo: `NoteSnapshot` captures note state before mutation
- Editor save button only enabled when form is dirty
- Save status indicators: saving, saved, unsaved changes
- New note screen slides from bottom (`slide_from_bottom` animation)
- Improved note row press feedback (gray100 background)
- Interaction behavior tests (archive/delete undo, sorting after operations)

### Changed

- Root layout: per-screen animation configuration
- NoteListItem: supports `onLongPress` prop
- NoteEditorScreen: removed effect-based dirty tracking, uses `isDirty` directly
- NotesListScreen: integrates action menu and toast
- Test count increased from 84 to 95

## [0.2.0] — 2025-XX-XX

### Added

- AsyncStorage persistence via `AsyncStorageNotesRepository`
- Repository factory (`createNotesRepository`, `createTestRepository`)
- Store hydration on app startup
- Error state with retry in notes list
- Real search: filter by title, body, tags (case-insensitive)
- Real tag filtering: dynamic chips from current notes
- Search and tag filtering work together
- Empty filtered state: "No matching notes" with clear action
- `AsyncStorageNotesRepository` tests with mocked AsyncStorage
- Filtering tests (search, tags, combined)

### Changed

- Store now uses `createNotesRepository()` factory instead of direct `InMemoryNotesRepository`
- NotesListScreen search bar is now functional
- Tag chips are dynamically derived from note tags
- Data layer now has two repository implementations

## [1.4.0] — 2025-XX-XX

### Added

- Unified `NoteEditorScreen` for both creating and editing notes
- `NoteListItem` component replacing `NoteCard` in the inbox list
- `updateNote` action in Zustand store
- `UpdateNoteUseCase` now wired through the store
- `tagsToString` utility for converting tag arrays to comma-separated strings
- Dirty tracking with "Unsaved" hint in the editor
- Saved feedback (button text changes to "Saved" briefly)
- Sorting by `updatedAt` descending — recent notes always at top
- New tests for sorting behavior and `tagsToString`

### Changed

- `getNotes()` now returns notes sorted by `updatedAt` descending
- `createNote()` inserts new notes at the top of the array
- `updateNote()` moves the updated note to the top
- `CreateNoteScreen` delegates to `NoteEditorScreen`
- `NoteDetailScreen` loads note then delegates to `NoteEditorScreen`
- `noteFormSchema` makes body optional (allows saving drafts)
- Navigation uses `ios_from_right` animation with full-screen gesture support
- Test count increased from 41 to 50

## [1.3.0] — 2025-XX-XX

### Changed

- Notes list redesigned as a compact inbox: flatter rows, minimal spacing, divider-separated
- NoteCard: row-based layout with title + preview + time, tags below, no card wrapper
- NotesListScreen: compact h2 header, integrated search, dark chip selection
- CreateNoteScreen: note editor with borderless title/body, save in header, no bottom buttons
- NoteDetailScreen: readable page layout, subtle metadata, secondary actions at bottom
- Design tokens: warm gray neutrals, removed bright purple, muted accents, minimal shadows
- AppButton: primary uses gray900 instead of bright purple, danger is ghost-style
- AppBadge: selected state uses dark gray, smaller padding
- AppEmptyState: simplified, no icon container
- ScreenHeader: compact h3 title, subtle back chevron
- AppInput: added borderless variant
- Seed data: realistic short notes (checklist, grocery list, quick ideas)
- Removed unused `min` variable from seed data

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
