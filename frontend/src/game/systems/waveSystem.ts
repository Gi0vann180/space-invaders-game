import { canEnemyFire, consumeEnemyShot, createEnemyGrid, tickEnemyFire, type EnemyEntity } from '../entities/enemy'
import { getStageConfig } from '../config/stages'
import type { RareDropEntity } from '../entities/dropItem'
import { createEnemyProjectile, type ProjectileEntity } from '../entities/projectile'
import { clampProjectileLimitByPerformance } from './performanceAdaptation'
import type { BossEntity } from '../entities/boss'
import { shouldSpawnRareDrop, spawnRareDrop } from './dropSystem'

export type WaveState = {
  stage: number
  enemies: EnemyEntity[]
  boss: BossEntity | null
  direction: 1 | -1
}

export function createInitialWave(): WaveState {
  return {
    stage: 1,
    enemies: createEnemyGrid(1),
    boss: null,
    direction: 1
  }
}

export function stepEnemies(
  wave: WaveState,
  deltaSeconds: number,
  canvasWidth: number
): WaveState {
  const stageConfig = getStageConfig(wave.stage)
  const speed = (30 + wave.stage * 4) * stageConfig.enemySpeedMultiplier
  const horizontalStep = speed * deltaSeconds * wave.direction

  let hitBorder = false
  const movedEnemies = wave.enemies.map((enemy) => {
    const nextX = enemy.x + horizontalStep
    if (nextX <= 0 || nextX + enemy.width >= canvasWidth) {
      hitBorder = true
    }

    const movedEnemy = {
      ...enemy,
      x: nextX
    }

    return tickEnemyFire(movedEnemy, deltaSeconds)
  })

  if (!hitBorder) {
    return {
      ...wave,
      enemies: movedEnemies
    }
  }

  return {
    ...wave,
    direction: wave.direction === 1 ? -1 : 1,
    enemies: movedEnemies.map((enemy) => ({
      ...enemy,
      y: enemy.y + 14
    }))
  }
}

export function applyWaveEnemies(wave: WaveState, enemies: EnemyEntity[]): WaveState {
  return {
    stage: wave.stage,
    enemies,
    boss: wave.boss,
    direction: wave.direction
  }
}

function pickShooter(enemies: EnemyEntity[], playerCenterX: number): EnemyEntity | null {
  if (enemies.length === 0) {
    return null
  }

  let shooter = enemies[0]
  let shortestDistance = Math.abs(shooter.x + shooter.width / 2 - playerCenterX)

  for (const enemy of enemies) {
    const enemyCenter = enemy.x + enemy.width / 2
    const distance = Math.abs(enemyCenter - playerCenterX)
    if (distance < shortestDistance) {
      shortestDistance = distance
      shooter = enemy
    }
  }

  return shooter
}

export function emitEnemyProjectiles(
  wave: WaveState,
  projectiles: ProjectileEntity[],
  playerCenterX: number
): {
  wave: WaveState
  projectiles: ProjectileEntity[]
} {
  const stageConfig = getStageConfig(wave.stage)
  const performanceMode = wave.stage >= 6 ? 'balanced' : 'quality'
  const maxEnemyProjectiles = clampProjectileLimitByPerformance(
    stageConfig.maxConcurrentEnemyProjectiles,
    performanceMode
  )
  const activeEnemyProjectiles = projectiles.filter((projectile) => projectile.origin === 'enemy').length

  if (wave.enemies.length === 0 || activeEnemyProjectiles >= maxEnemyProjectiles) {
    return {
      wave,
      projectiles
    }
  }

  const shooter = pickShooter(wave.enemies, playerCenterX)
  if (!shooter || !canEnemyFire(shooter)) {
    return {
      wave,
      projectiles
    }
  }

  const nextEnemies = wave.enemies.map((enemy) => {
    if (enemy.id !== shooter.id) {
      return enemy
    }

    return consumeEnemyShot({
      ...enemy,
      fireCooldownSeconds: stageConfig.enemyFireIntervalSeconds
    })
  })

  return {
    wave: {
      ...wave,
      enemies: nextEnemies
    },
    projectiles: [
      ...projectiles,
      createEnemyProjectile(
        shooter.x + shooter.width / 2 - 2,
        shooter.y + shooter.height + 2,
        stageConfig.enemyProjectileSpeed
      )
    ]
  }
}

export function createDropsFromDefeatedEnemies(defeatedEnemies: EnemyEntity[], nowMs: number): RareDropEntity[] {
  const drops: RareDropEntity[] = []

  for (const enemy of defeatedEnemies) {
    const seed = nowMs + enemy.x + enemy.y
    if (!shouldSpawnRareDrop(seed)) {
      continue
    }

    drops.push(
      spawnRareDrop({
        enemyId: enemy.id,
        x: enemy.x + enemy.width / 2 - 6,
        y: enemy.y + enemy.height / 2 - 6,
        nowMs,
        seed
      })
    )
  }

  return drops
}
