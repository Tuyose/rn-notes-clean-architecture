# rn-notes-clean-architecture

A React Native notes app demonstrating clean architecture, typed domain models, repository pattern, form validation, and testing best practices.

> Portfolio project showcasing real-world app structure and engineering discipline.

## Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| Framework      | React Native + Expo (SDK 56)       |
| Language       | TypeScript (strict)                |
| Routing        | Expo Router                        |
| Forms          | React Hook Form + Zod              |
| State          | Zustand                            |
| Testing        | Jest + React Native Testing Library |
| Linting        | ESLint + Prettier                  |
| CI             | GitHub Actions                     |

## Features

- **Notes inbox** — compact list sorted by most recent, tag filter chips, search placeholder
- **Unified editor** — create and edit notes in the same screen, dirty tracking, save feedback
- **In-memory storage** — notes are stored in memory and sorted by `updatedAt` descending
- **Swappable repository** — replace `InMemoryNotesRepository` with AsyncStorage/SQLite without changing the rest of the app
- **Clean architecture** — domain entities, repository interfaces, use cases, and presentation layers are fully separated
- **Typed design system** — AppText, AppButton, AppInput, AppCard, AppBadge, AppEmptyState, AppScreen, ScreenHeader
- **Validation** — Zod schemas with React Hook Form integration
- **Tests** — 50 tests covering repository, use cases, validation, and sorting behavior

## Architecture

Feature-first clean architecture with clear layer boundaries:

```
Domain (entities, repository contracts, use cases)
  ↑ depends on nothing
Data (repository implementations)
  ↑ depends on Domain
Presentation (screens, components, store)
  ↑ depends on Domain + Data
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full details.

## How the Unified Editor Works

The app uses a single `NoteEditorScreen` for both creating and editing notes:

- **New note**: Opens with empty fields. Save calls `CreateNoteUseCase`.
- **Existing note**: Opens with pre-filled title, body, and tags. Save calls `UpdateNoteUseCase`.
- **Dirty tracking**: Shows "Unsaved" hint when content changes.
- **Saved feedback**: Button text briefly changes to "Saved" after saving.
- **Actions**: Archive and delete are available for existing notes as secondary actions.

## How Sorting Works

Notes are sorted by `updatedAt` descending in the repository layer:

- `getNotes()` returns notes sorted by most recently updated first.
- `createNote()` inserts new notes at the top.
- `updateNote()` moves the updated note to the top.
- This means newly created and recently edited notes always appear at the top of the list.

## Screenshots

| Notes Inbox | Note Editor (New) | Note Editor (Existing) |
| :---------: | :----------------: | :--------------------: |
| ![Notes Inbox](docs/screenshots/notes-inbox.png) | ![New Note](docs/screenshots/note-editor-new.png) | ![Edit Note](docs/screenshots/note-editor-existing.png) |

> Screenshots are placeholders. Run the app on a device or simulator to see the UI.

## Getting Started

```bash
git clone https://github.com/your-username/rn-notes-clean-architecture.git
cd rn-notes-clean-architecture
npm install
npm start
```

### Commands

```bash
npm run lint        # ESLint
npm run typecheck   # TypeScript
npm test            # Jest
npm run format      # Prettier
```

## AI Usage Disclosure

AI was used for scaffolding, refactoring suggestions, and documentation drafts. Architecture decisions, debugging, testing, review, and final implementation ownership remain with the developer.

## License

MIT
