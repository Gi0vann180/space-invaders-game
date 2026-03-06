import { describe, expect, it } from 'vitest'
import { shouldSpawnRareDrop } from '../../src/game/systems/dropSystem'

describe('US3 drop rarity roll', () => {
  it('respeita limiar de raridade configurado', () => {
    expect(shouldSpawnRareDrop(4, 5)).toBe(true)
    expect(shouldSpawnRareDrop(5, 5)).toBe(false)
    expect(shouldSpawnRareDrop(99, 5)).toBe(false)
  })
})
