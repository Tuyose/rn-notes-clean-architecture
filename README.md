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
- **Action menu** — long press on note row for archive/delete actions
- **Undo feedback** — toast with undo action after archive/delete
- **Dirty-state feedback** — save button shows unsaved/saving/saved status
- **Clean architecture** — domain entities, repository interfaces, use cases, and presentation layers are fully separated
- **Typed design system** — AppText, AppButton, AppInput, AppCard, AppBadge, AppEmptyState, AppScreen, ScreenHeader, AppToast
- **Validation** — Zod schemas with React Hook Form integration
- **Tests** — 95 tests covering repository, persistence, use cases, validation, sorting, filtering, and interaction behavior

## v0.3.0 — Interaction Quality

- Native navigation transitions: new note slides from bottom, back gesture enabled
- Note row press feedback with opacity change
- Long press on note row opens action menu (archive, delete, cancel)
- Toast with undo after archive/delete
- Editor save button only enabled when content is dirty
- Save status indicators: unsaved, saving, saved
- No Reanimated or Gesture Handler — built with React Native Animated API

## v0.2.0 — Local Persistence and Filtering

- AsyncStorage persistence replaces in-memory-only storage
- Repository factory pattern for swappable implementations
- Real search and tag filtering
- 84 tests covering persistence and filtering

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

## How Undo Works

When archiving or deleting a note:

1. The store takes a snapshot of the note before the operation
2. The operation executes (archive/delete)
3. A toast appears: "Note archived" or "Note deleted"
4. The toast has an "Undo" button
5. Pressing Undo restores the note from the snapshot
6. The toast auto-dismisses after 4 seconds

## How Editor Dirty-State Works

The editor tracks form changes using React Hook Form's `isDirty` state:

- Save button is disabled when no changes are made
- After editing, Save becomes enabled
- During save, button shows "Saving…"
- After save, button shows "Saved" briefly, then returns to disabled
- Metadata row shows "Unsaved changes" or "Saved" status

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
