import { canBossAttack, consumeBossAttack, getCurrentBossPatternId } from '../entities/boss'
import { getCycleDifficultyMultiplier } from '../config/gameplay'
import { createEnemyProjectile, type ProjectileEntity } from '../entities/projectile'
import type { WaveState } from './waveSystem'

type BossAttackResult = {
  wave: WaveState
  projectiles: ProjectileEntity[]
}

function getPatternProjectiles(
  wave: WaveState,
  projectiles: ProjectileEntity[],
  playerCenterX: number
): ProjectileEntity[] {
  if (!wave.boss) {
    return projectiles
  }

  const boss = wave.boss
  const centerX = boss.x + boss.width / 2
  const spawnY = boss.y + boss.height + 2
  const patternId = getCurrentBossPatternId(boss)
  const cycleMultiplier = getCycleDifficultyMultiplier(boss.stage)

  if (patternId === 'line-5') {
    return [
      ...projectiles,
      createEnemyProjectile(centerX - 30, spawnY, 280 * cycleMultiplier),
      createEnemyProjectile(centerX - 15, spawnY, 280 * cycleMultiplier),
      createEnemyProjectile(centerX, spawnY, 280 * cycleMultiplier),
      createEnemyProjectile(centerX + 15, spawnY, 280 * cycleMultiplier),
      createEnemyProjectile(centerX + 30, spawnY, 280 * cycleMultiplier)
    ]
  }

  if (patternId === 'targeted-2') {
    const offset = playerCenterX >= centerX ? 16 : -16
    return [
      ...projectiles,
      createEnemyProjectile(centerX + offset, spawnY, 300 * cycleMultiplier),
      createEnemyProjectile(centerX, spawnY, 300 * cycleMultiplier)
    ]
  }

  return [
    ...projectiles,
    createEnemyProjectile(centerX - 12, spawnY, 260 * cycleMultiplier),
    createEnemyProjectile(centerX, spawnY, 260 * cycleMultiplier),
    createEnemyProjectile(centerX + 12, spawnY, 260 * cycleMultiplier)
  ]
}

export function emitBossProjectiles(
  wave: WaveState,
  projectiles: ProjectileEntity[],
  playerCenterX: number
): BossAttackResult {
  if (!wave.boss || !canBossAttack(wave.boss)) {
    return {
      wave,
      projectiles
    }
  }

  const nextProjectiles = getPatternProjectiles(wave, projectiles, playerCenterX)
  return {
    wave: {
      ...wave,
      boss: consumeBossAttack(wave.boss)
    },
    projectiles: nextProjectiles
  }
}
