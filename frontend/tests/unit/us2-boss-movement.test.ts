import { describe, expect, it } from 'vitest'
import { createBossForStage } from '../../src/game/entities/boss'
import { tickBoss } from '../../src/game/systems/bossSystem'
import type { WaveState } from '../../src/game/systems/waveSystem'

describe('US2 boss movement', () => {
  it('move o boss horizontalmente a cada tick', () => {
    const wave: WaveState = {
      stage: 10,
      enemies: [],
      boss: {
        ...createBossForStage(10),
        x: 100,
        velocityX: 100
      },
      direction: 1
    }

    const next = tickBoss(wave, 0.1, 800)
    expect(next.boss?.x).toBeGreaterThan(100)
  })

  it('inverte direcao ao atingir borda', () => {
    const wave: WaveState = {
      stage: 10,
      enemies: [],
      boss: {
        ...createBossForStage(10),
        x: 760,
        width: 40,
        velocityX: 120
      },
      direction: 1
    }

    const next = tickBoss(wave, 0.5, 800)
    expect(next.boss?.velocityX ?? 0).toBeLessThan(0)
  })
})
