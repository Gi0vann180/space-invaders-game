import { describe, expect, it } from 'vitest'
import { evaluateStageProgression } from '../../src/game/systems/progressionSystem'
import { spawnBossForWave } from '../../src/game/systems/bossSystem'
import { resolveBossProjectileCollisions } from '../../src/game/systems/collisionSystem'
import { createBossForStage } from '../../src/game/entities/boss'
import type { WaveState } from '../../src/game/systems/waveSystem'

describe('US1 boss stage flow', () => {
  it('entra em boss fight ao limpar inimigos e avança para loja após derrotar chefe', () => {
    const beforeBoss = evaluateStageProgression(10, 0, false, false)
    expect(beforeBoss.enterBossFight).toBe(true)
    expect(beforeBoss.enterShop).toBe(false)

    const waveWithEnemiesCleared: WaveState = {
      stage: 10,
      enemies: [],
      boss: null,
      direction: 1
    }

    const withBoss = spawnBossForWave(waveWithEnemiesCleared)
    expect(withBoss.boss).not.toBeNull()

    const boss = {
      ...createBossForStage(10),
      x: 100,
      y: 100,
      width: 50,
      height: 40,
      health: 1,
      maxHealth: 1
    }

    const hit = resolveBossProjectileCollisions(boss, [
      {
        id: 'player-shot',
        origin: 'player',
        kind: 'default',
        x: 110,
        y: 110,
        width: 4,
        height: 12,
        speedY: -400,
        speedX: 0
      }
    ])

    expect(hit.bossDefeated).toBe(true)

    const afterBoss = evaluateStageProgression(10, 0, true, hit.bossDefeated)
    expect(afterBoss.enterShop).toBe(true)
    expect(afterBoss.nextStage).toBe(11)
  })
})
