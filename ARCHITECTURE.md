# Architecture

## Overview

This project follows **feature-first clean architecture** adapted for React Native. The goal is clear separation of concerns, testability, and the ability to swap implementations (e.g., in-memory → SQLite) without changing the rest of the app.

## Layers

### 1. Domain Layer (innermost)

The domain layer is the core of the application. It has **zero dependencies** on frameworks, UI, or infrastructure.

```
domain/
├── entities/       # Data structures (Note, CreateNoteInput, UpdateNoteInput)
├── repositories/   # Abstract interfaces (NotesRepository)
└── use-cases/      # Business operations (GetNotes, CreateNote, etc.)
```

**Rules:**
- No React imports
- No React Native imports
- No external library imports (except types)
- Pure TypeScript only

### 2. Data Layer

Implements the repository interfaces defined in the domain layer.

```
data/
└── repositories/
    └── InMemoryNotesRepository.ts
```

**Rules:**
- Depends on domain entities and repository interfaces
- Can import external libraries (uuid, database drivers, etc.)
- Each implementation is swappable

### 3. Presentation Layer (outermost)

The UI layer — screens, components, state management.

```
presentation/
├── components/     # Reusable feature-specific components
├── screens/        # Full screen components
└── store/          # Zustand state management
```

**Rules:**
- Depends on domain use cases (never directly on repositories)
- Can import design system and theme
- Screens are thin — delegate logic to the store

### 4. Validation Layer

Zod schemas for form validation, shared between presentation and tests.

```
validation/
└── noteSchema.ts
```

### 5. Core Layer

Shared infrastructure used across all features.

```
core/
├── design-system/  # AppText, AppButton, AppInput, AppCard, AppBadge, AppEmptyState
└── theme/          # Design tokens (colors, spacing, typography, radius)
```

## Dependency Rule

Dependencies point **inward only**:

```
Presentation → Domain ← Data
                  ↑
              Validation
```

- Presentation depends on Domain (use cases)
- Data depends on Domain (repository interfaces)
- Domain depends on nothing

## State Management

Zustand is used for feature state. The store:

1. Receives actions from the presentation layer
2. Calls use cases (not repositories directly)
3. Updates state
4. Presentation re-renders

This keeps the store as a thin orchestration layer.

## Unified Note Editor

The app uses a single `NoteEditorScreen` for both creating and editing notes:

- `CreateNoteScreen` renders `<NoteEditorScreen />` (no existing note)
- `NoteDetailScreen` loads the note, then renders `<NoteEditorScreen note={note} />`
- The editor handles both `CreateNoteUseCase` and `UpdateNoteUseCase` based on whether a note is passed
- Dirty tracking shows "Unsaved" when content differs from the original

## Sorting by Recent Updates

Notes are sorted by `updatedAt` descending at the repository level:

- `getNotes()` sorts before returning
- `createNote()` inserts at the top of the array
- `updateNote()` removes from old position and inserts at the top
- This ensures recently created and edited notes always appear first

## Adding a New Feature

1. Create `src/features/<name>/domain/` with entities and repository interface
2. Create `src/features/<name>/data/` with repository implementation
3. Create `src/features/<name>/validation/` with Zod schemas
4. Create `src/features/<name>/presentation/` with screens, components, store
5. Add routes in `app/`

## Adding Persistence

To replace InMemoryNotesRepository with AsyncStorage or SQLite:

1. Create a new class implementing `NotesRepository`
2. Update the store to use the new implementation
3. No changes needed in use cases, screens, or components

## Design System

All UI primitives live in `src/core/design-system/`. They accept typed props and use theme tokens from `src/core/theme/`. This ensures visual consistency and makes global style changes trivial.

## Testing Strategy

| Layer        | What to test                    | Tool                    |
| ------------ | ------------------------------- | ----------------------- |
| Domain       | Use cases, entity shapes        | Jest (unit)             |
| Data         | Repository behavior             | Jest (unit)             |
| Validation   | Zod schemas, parsers            | Jest (unit)             |
| Presentation | Component rendering             | React Native Testing Lib |
| Integration  | Screen + store + repository     | Manual / E2E (future)   |
