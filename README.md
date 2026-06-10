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
| Storage        | AsyncStorage                       |
| Testing        | Jest + React Native Testing Library |
| Linting        | ESLint + Prettier                  |
| CI             | GitHub Actions                     |

## Features

- **Notes inbox** — compact list sorted by most recent, tag filter chips, functional search
- **Unified editor** — create and edit notes in the same screen, dirty tracking, save feedback
- **Local persistence** — notes persist to AsyncStorage, survive app restarts
- **Swappable repository** — in-memory for tests, AsyncStorage for production, SQLite later
- **Real search** — filter by title, body, and tags, case-insensitive
- **Real tag filtering** — dynamic tag chips from current notes, works with search
- **Clean architecture** — domain entities, repository interfaces, use cases, and presentation layers are fully separated
- **Typed design system** — AppText, AppButton, AppInput, AppCard, AppBadge, AppEmptyState, AppScreen, ScreenHeader
- **Validation** — Zod schemas with React Hook Form integration
- **Tests** — 84 tests covering repository, persistence, use cases, validation, sorting, and filtering

## v0.2.0 — Local Persistence and Filtering

- AsyncStorage persistence replaces in-memory-only storage
- Notes survive app restarts
- Repository factory: `createNotesRepository()` for production, `createTestRepository()` for tests
- Search bar filters by title, body, and tags
- Tag chips are dynamic from current notes
- Search and tag filtering work together
- Empty filtered state: "No matching notes" with clear action
- Data layer is swappable — swap `AsyncStorageNotesRepository` for SQLite without touching the rest of the app
- No backend, no Firebase, no Supabase — persistence is local-only

## Architecture

Feature-first clean architecture with clear layer boundaries:

```
Domain (entities, repository contracts, use cases)
  ↑ depends on nothing
Data (repository implementations)
  ↑ depends on Domain
Presentation (screens, components, store)
  ↑ depends on Domain via use cases
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full details.

## How Persistence Works

The app uses a **repository factory** pattern:

- `createNotesRepository()` returns `AsyncStorageNotesRepository` — used by the production app
- `createTestRepository()` returns `InMemoryNotesRepository` — used by tests

The store calls `hydrate()` on mount, which:
1. Loads notes from AsyncStorage
2. If storage is empty (first launch), seeds demo notes
3. If JSON is corrupted, falls back to demo notes
4. Notes are sorted by `updatedAt` descending

All mutations (create, update, archive, delete) persist to AsyncStorage automatically.

## How Search and Filtering Work

- **Search**: Case-insensitive matching against title, body, and tags
- **Tag chips**: Dynamically derived from current notes
- **Combined**: Search and tag filtering work together
- **Empty state**: Shows "No matching notes" with a "Clear Filters" action

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
npm ci              # Clean install
```

## AI Usage Disclosure

AI was used for scaffolding, refactoring suggestions, and documentation drafts. Architecture decisions, debugging, testing, review, and final implementation ownership remain with the developer.

## License

MIT
