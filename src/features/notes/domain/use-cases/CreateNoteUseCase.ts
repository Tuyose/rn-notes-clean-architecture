import type { Note, CreateNoteInput } from '../entities';
import type { NotesRepository } from '../repositories';

export class CreateNoteUseCase {
  constructor(private readonly repository: NotesRepository) {}

  async execute(input: CreateNoteInput): Promise<Note> {
    if (!input.title.trim()) {
      throw new Error('Note title is required');
    }
    return this.repository.createNote(input);
  }
}
