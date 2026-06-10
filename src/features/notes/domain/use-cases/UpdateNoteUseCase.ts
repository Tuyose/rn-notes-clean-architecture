import type { Note, UpdateNoteInput } from '../entities';
import type { NotesRepository } from '../repositories';

export class UpdateNoteUseCase {
  constructor(private readonly repository: NotesRepository) {}

  async execute(id: string, input: UpdateNoteInput): Promise<Note> {
    if (!id.trim()) {
      throw new Error('Note ID is required');
    }
    const existing = await this.repository.getNoteById(id);
    if (!existing) {
      throw new Error(`Note with id "${id}" not found`);
    }
    return this.repository.updateNote(id, input);
  }
}
