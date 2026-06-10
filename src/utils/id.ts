/**
 * Simple ID generator for in-memory storage.
 * Replace with uuid when adding persistence that needs collision-safe IDs.
 */
let counter = 0;

export function generateId(): string {
  counter += 1;
  return `${Date.now()}-${counter}-${Math.random().toString(36).slice(2, 9)}`;
}
