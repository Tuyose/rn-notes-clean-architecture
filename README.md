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

- Notes inbox with compact list, search bar, and tag filter chips
- Note editor with borderless title/body fields and save-in-header
- Note reader with readable body, subtle metadata, and secondary actions
- Design system primitives (AppText, AppButton, AppInput, AppCard, AppBadge, AppEmptyState, AppScreen, ScreenHeader)
- Typed design tokens (colors, spacing, typography, radius, shadows)
- Domain entities and repository interface
- In-memory repository implementation
- Use case layer with business rules
- Zustand store for state management
- Unit tests for domain, use cases, validation, and repository

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

## Screenshots

| Notes Inbox | Note Editor | Note Reader |
| :---------: | :---------: | :---------: |
| ![Notes Inbox](docs/screenshots/notes-inbox.png) | ![Note Editor](docs/screenshots/note-editor.png) | ![Note Reader](docs/screenshots/note-reader.png) |

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
