import type { NotesRepository } from '../../domain/repositories';
import { AsyncStorageNotesRepository } from './AsyncStorageNotesRepository';
import { InMemoryNotesRepository } from './InMemoryNotesRepository';

/**
 * Factory for creating the appropriate NotesRepository.
 *
 * - Production: AsyncStorageNotesRepository (persists to device)
 * - Tests: InMemoryNotesRepository (no storage dependency)
 */
export function createNotesRepository(): NotesRepository {
  return new AsyncStorageNotesRepository();
}

/**
 * Create an in-memory repository for testing.
 */
export function createTestRepository(): InMemoryNotesRepository {
  return new InMemoryNotesRepository();
}
