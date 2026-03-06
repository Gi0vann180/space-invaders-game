import { describe, expect, it } from 'vitest'
import { emitBossProjectiles } from '../../src/game/systems/bossAttackSystem'
import { createBossForStage } from '../../src/game/entities/boss'
import type { WaveState } from '../../src/game/systems/waveSystem'

describe('US1 boss pattern selection', () => {
  it('cicla padrões de ataque do chefe a cada emissão', () => {
    const boss = {
      ...createBossForStage(1),
      attackTimer: 0,
      patternIds: ['burst-3', 'line-5'],
      patternCursor: 0
    }

    const wave: WaveState = {
      stage: 1,
      enemies: [],
      boss,
      direction: 1
    }

    const first = emitBossProjectiles(wave, [], 400)
    expect(first.projectiles).toHaveLength(3)
    expect(first.wave.boss?.patternCursor).toBe(1)

    const second = emitBossProjectiles(
      {
        ...first.wave,
        boss: first.wave.boss ? { ...first.wave.boss, attackTimer: 0 } : null
      },
      first.projectiles,
      400
    )

    expect(second.projectiles).toHaveLength(8)
    expect(second.wave.boss?.patternCursor).toBe(0)
  })
})
