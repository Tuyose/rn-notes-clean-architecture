# rn-notes-clean-architecture

A production-quality React Native notes app demonstrating clean architecture, typed domain models, repository pattern, form validation, and testing best practices.

> This is a portfolio project built to showcase real-world app structure and engineering discipline.

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

## Features (v1 — First Slice)

- ✅ Notes list screen with empty state and demo data
- ✅ Create note with form validation
- ✅ Note detail view with archive and delete
- ✅ Reusable screen layout primitives (AppScreen, ScreenHeader)
- ✅ Design system primitives (AppText, AppButton, AppInput, AppCard, AppBadge, AppEmptyState)
- ✅ Typed theme tokens (colors, spacing, typography, radius)
- ✅ Domain entities and repository interface
- ✅ In-memory repository implementation
- ✅ Use case layer with business rules
- ✅ Zustand store for state management
- ✅ Unit tests for domain, use cases, validation, and components

## Architecture

This project follows **feature-first clean architecture** with clear layer boundaries:

```
Domain (entities, repository contracts, use cases)
  ↑ depends on nothing
Data (repository implementations)
  ↑ depends on Domain
Presentation (screens, components, store)
  ↑ depends on Domain + Data
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full details.

## Folder Structure

```
app/                          # Expo Router routes
├── _layout.tsx               # Root layout
├── index.tsx                 # Home → NotesListScreen
└── notes/
    ├── [id].tsx              # Note detail route
    └── new.tsx               # Create note route

src/
├── core/
│   ├── design-system/        # Reusable UI primitives
│   └── theme/                # Design tokens
├── features/
│   └── notes/
│       ├── data/
│       │   ├── repositories/ # InMemoryNotesRepository
│       │   └── seed.ts       # Demo notes for first launch
│       ├── domain/
│       │   ├── entities/     # Note, CreateNoteInput, UpdateNoteInput
│       │   ├── repositories/ # NotesRepository interface
│       │   └── use-cases/    # GetNotes, CreateNote, etc.
│       ├── presentation/
│       │   ├── components/   # NoteCard
│       │   ├── screens/      # List, Create, Detail
│       │   └── store/        # Zustand notes store
│       └── validation/       # Zod schemas
├── types/                    # Shared utility types
├── utils/                    # Shared utilities
└── __tests__/                # All test files
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

```bash
git clone https://github.com/your-username/rn-notes-clean-architecture.git
cd rn-notes-clean-architecture
npm install
```

### Running the App

```bash
# Start Expo development server
npm start

# Run on specific platform
npm run android
npm run ios
npm run web
```

### Development Commands

```bash
# Lint
npm run lint

# Type check
npm run typecheck

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Format code
npm run format

# Check formatting
npm run format:check
```

## Testing

```bash
# Run all tests
npm test -- --runInBand

# Run tests with coverage
npm test -- --coverage
```

Tests cover:
- `InMemoryNotesRepository` — full CRUD + edge cases
- All 6 use cases — happy path + validation errors
- `createNoteSchema` — Zod validation rules
- `parseTagsString` — tag parsing utility

## Screenshots

| Notes List | Create Note | Note Detail |
| :--------: | :---------: | :---------: |
| ![Notes List](docs/screenshots/notes-list.png) | ![Create Note](docs/screenshots/create-note.png) | ![Note Detail](docs/screenshots/note-detail.png) |

> Screenshots are placeholders. Run the app on a device or simulator to see the polished UI.

## AI Usage Disclosure

AI was used for scaffolding, refactoring suggestions, and documentation drafts. Architecture decisions, debugging, testing, review, and final implementation ownership remain with the developer.

See [AI_USAGE.md](./AI_USAGE.md) for details.

## Roadmap

See [ROADMAP.md](./ROADMAP.md) for planned features and milestones.

## License

MIT

## Author

Built by [Your Name] — a portfolio project demonstrating clean architecture in React Native.
