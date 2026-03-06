export function createDeterministicRunSeed(input: string): number {
  let hash = 2166136261
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return Math.abs(hash >>> 0)
}

export function seededPick<T>(items: T[], seed: number): T {
  if (items.length === 0) {
    throw new Error('seededPick requires at least one item')
  }

  const index = seed % items.length
  return items[index]
}
