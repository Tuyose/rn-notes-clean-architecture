# Roadmap

## v0.4.0 — Gesture and Editor Experience (Current)

- [x] Swipe actions on note rows (PanResponder + Animated)
- [x] Haptic feedback via expo-haptics
- [x] Editor back guard for unsaved changes
- [x] KeyboardAvoidingView for proper keyboard handling
- [x] Auto-focus title only on new notes
- [x] 113 tests covering gesture and editor behavior

## v0.3.0 — Interaction Quality

- [x] Native navigation transitions (slide from bottom for new note)
- [x] Note row press feedback
- [x] Long press action menu (archive, delete, cancel)
- [x] Toast with undo for archive/delete
- [x] Editor dirty-state and save feedback
- [x] Save button enabled only when dirty
- [x] 95 tests covering interaction behavior

## v0.2.0 — Local Persistence and Filtering

- [x] AsyncStorage persistence via `AsyncStorageNotesRepository`
- [x] Repository factory pattern
- [x] Store hydration on startup
- [x] Real search (title, body, tags)
- [x] Real tag filtering with dynamic chips
- [x] Search + tag filtering combined
- [x] 84 tests covering persistence and filtering

## v1.4 — Unified Editor & Sorting

- [x] Unified note editor for both creating and editing notes
- [x] Notes sorted by `updatedAt` descending — recent notes at top
- [x] Dirty tracking with "Unsaved" hint
- [x] Saved feedback after saving
- [x] `updateNote` action in store
- [x] `ios_from_right` navigation animation
- [x] Body optional in validation (drafts allowed)
- [x] 50 tests covering sorting and editor behavior

## v1.3 — UX Correction

- [x] Notes list redesigned as compact inbox (flat rows, dividers, minimal spacing)
- [x] Note editor with borderless title/body, save in header, no form card
- [x] Note reader with readable body, subtle metadata, secondary actions at bottom
- [x] Warm neutral palette, muted accents, minimal shadows
- [x] Realistic seed data (checklist, grocery list, quick notes)

## v1.2 — Modern UI Redesign

- [x] Expanded design tokens with accent colors and softer surfaces
- [x] Notes list hero header with display title and subtitle
- [x] Horizontal tag filter chips (All, Work, Ideas, Architecture, Planning)
- [x] Redesigned note cards with better hierarchy and pressed states
- [x] Clean editor layout with borderless inputs and save-in-header
- [x] Premium detail screen with readable body and metadata section
- [x] Richer demo seed data (6 realistic notes)

## v1.1 — UI Polish

- [x] Reusable screen layout components (AppScreen, ScreenHeader)
- [x] Notes list with demo data, subtitle, and polished cards
- [x] Create note screen with card-wrapped form and helper text
- [x] Note detail screen with metadata card and better hierarchy
- [x] Navigation gesture support and animation tuning

## v1.0 — First Slice

- [x] Expo + TypeScript project setup
- [x] Expo Router routing
- [x] Design system primitives
- [x] Notes domain model
- [x] Repository pattern with in-memory implementation
- [x] Use cases for all CRUD operations
- [x] Notes list screen
- [x] Create note screen with React Hook Form + Zod
- [x] Note detail screen with archive and delete
- [x] Unit tests for domain, use cases, validation, and components
- [x] Documentation (README, ARCHITECTURE, AI_USAGE, ROADMAP)
- [x] GitHub Actions CI

## v1.1 — Persistence

- [ ] Add AsyncStorage repository implementation
- [ ] Add repository factory / dependency injection
- [ ] Persist notes across app restarts
- [ ] Seed data for first launch

## v1.2 — Edit & Search

- [ ] Edit note screen
- [ ] Real search functionality (filter by title/body)
- [ ] Tag-based filtering
- [ ] Sort options (date, title)

## v1.3 — Archive & Trash

- [ ] Archive filter / tab
- [ ] Soft delete with trash view
- [ ] Permanent delete with confirmation
- [ ] Restore from archive

## v2.0 — Enhanced Features

- [ ] Rich text editing (Markdown support)
- [ ] Image attachments
- [ ] Note pinning
- [ ] Categories / folders
- [ ] Dark mode theme
- [ ] Share notes

## v2.1 — Sync & Cloud

- [ ] Backend integration (Firebase / Supabase)
- [ ] User authentication
- [ ] Real-time sync
- [ ] Offline-first with conflict resolution

## v3.0 — Advanced

- [ ] Collaborative editing
- [ ] Note templates
- [ ] Export (PDF, Markdown)
- [ ] Widgets (iOS / Android)
- [ ] Push notifications for reminders
