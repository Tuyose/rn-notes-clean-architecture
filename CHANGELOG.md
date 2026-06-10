# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
