import type { Note } from '../entities';
import type { NotesRepository } from '../repositories';

/**
 * Retrieves all notes from the repository.
 *
 * Use cases are thin orchestration layers — they coordinate between
 * the presentation layer and the repository. Business rules that
 * span multiple entities or require cross-cutting logic live here.
 */
export class GetNotesUseCase {
  constructor(private readonly repository: NotesRepository) {}

  async execute(): Promise<Note[]> {
    return this.repository.getNotes();
  }
}
