import type { Note } from '../entities';
import type { NotesRepository } from '../repositories';

export class GetNoteByIdUseCase {
  constructor(private readonly repository: NotesRepository) {}

  async execute(id: string): Promise<Note | null> {
    if (!id.trim()) {
      throw new Error('Note ID is required');
    }
    return this.repository.getNoteById(id);
  }
}
