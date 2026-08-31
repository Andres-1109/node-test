import { NotFoundError } from '../errors';

/**
 * Fetches an entity via `finder` and throws NotFoundError unless it exists and is active.
 * @param finder - A function that looks up the entity (e.g. a repository's findById).
 * @param notFoundMessage - The message to use if the entity is missing or inactive.
 * @returns The active entity.
 * @throws {NotFoundError} If the entity does not exist or has isActive === false.
 */
export async function findActiveOrFail<T extends { isActive: boolean }>(
  finder: () => Promise<T | null>,
  notFoundMessage: string
): Promise<T> {
  const entity = await finder();
  if (!entity || !entity.isActive) {
    throw new NotFoundError(notFoundMessage);
  }
  return entity;
}
