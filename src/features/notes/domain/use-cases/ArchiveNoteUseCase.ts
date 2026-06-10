import type { NotesRepository } from '../repositories';

export class ArchiveNoteUseCase {
  constructor(private readonly repository: NotesRepository) {}

  async execute(id: string): Promise<void> {
    if (!id.trim()) {
      throw new Error('Note ID is required');
    }
    const existing = await this.repository.getNoteById(id);
    if (!existing) {
      throw new Error(`Note with id "${id}" not found`);
    }
    await this.repository.archiveNote(id);
  }
}
