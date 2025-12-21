export function getUpdatedFields<T>(current: T, updates: Partial<T>): Partial<T> {
  const changed: Partial<T> = {};
  for (const key in updates) {
    if (updates[key] !== undefined && updates[key] !== current[key]) {
      changed[key] = updates[key];
    }
  }
  return changed;
}
