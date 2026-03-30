import type { EnemyEntity } from '../entities/enemy'
import type { PlayerEntity } from '../entities/player'
import type { ProjectileEntity } from '../entities/projectile'
import type { BossEntity } from '../entities/boss'
import type { RareDropEntity } from '../entities/dropItem'
import type { TemporaryPowerUpType } from '../types'

type CollisionResult = {
  enemies: EnemyEntity[]
  projectiles: ProjectileEntity[]
  defeatedEnemyCount: number
  defeatedEnemies: EnemyEntity[]
}

function intersects(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number }
): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
}

function getProjectileDamageAgainstBoss(projectile: ProjectileEntity): number {
  if (projectile.kind === 'laser') {
    return Math.min(projectile.damage, 3)
  }

  return projectile.damage
}

export function resolvePlayerProjectileCollisions(
  enemies: EnemyEntity[],
  projectiles: ProjectileEntity[]
): CollisionResult {
  const remainingEnemies = [...enemies]
  const remainingProjectiles: ProjectileEntity[] = []
  let defeatedEnemyCount = 0
  const defeatedEnemies: EnemyEntity[] = []

  for (const projectile of projectiles) {
    if (projectile.origin !== 'player') {
      remainingProjectiles.push(projectile)
      continue
    }

    const hitIndex = remainingEnemies.findIndex((enemy) => intersects(projectile, enemy))

    if (hitIndex === -1) {
      remainingProjectiles.push(projectile)
      continue
    }

    const hitEnemy = remainingEnemies[hitIndex]
    const nextHealth = hitEnemy.health - projectile.damage

    if (nextHealth <= 0) {
      remainingEnemies.splice(hitIndex, 1)
      defeatedEnemyCount += 1
      defeatedEnemies.push(hitEnemy)
    } else {
      remainingEnemies[hitIndex] = {
        ...hitEnemy,
        health: nextHealth
      }
    }
  }

  return {
    enemies: remainingEnemies,
    projectiles: remainingProjectiles,
    defeatedEnemyCount,
    defeatedEnemies
  }
}

export function checkEnemyReachedPlayerLine(
  enemies: EnemyEntity[],
  player: PlayerEntity
): boolean {
  return enemies.some((enemy) => enemy.y + enemy.height >= player.y)
}

export function resolveEnemyProjectileHitsPlayer(
  player: PlayerEntity,
  projectiles: ProjectileEntity[],
  deltaSeconds = 0,
  shieldActive = false
): {
  projectiles: ProjectileEntity[]
  playerHitCount: number
} {
  let playerHitCount = 0
  const remainingProjectiles: ProjectileEntity[] = []

  for (const projectile of projectiles) {
    if (projectile.origin !== 'enemy') {
      remainingProjectiles.push(projectile)
      continue
    }

    const previousY = projectile.y - projectile.speedY * deltaSeconds
    const sweptTop = Math.min(previousY, projectile.y)
    const sweptBottom = Math.max(previousY + projectile.height, projectile.y + projectile.height)
    const sweptProjectile = {
      ...projectile,
      y: sweptTop,
      height: sweptBottom - sweptTop
    }

    if (intersects(sweptProjectile, player)) {
      if (shieldActive) {
        continue
      }

      playerHitCount += 1
      continue
    }

    remainingProjectiles.push(projectile)
  }

  return {
    projectiles: remainingProjectiles,
    playerHitCount
  }
}

export function resolveBossProjectileCollisions(
  boss: BossEntity | null,
  projectiles: ProjectileEntity[],
  deltaSeconds = 0
): {
  boss: BossEntity | null
  projectiles: ProjectileEntity[]
  bossDefeated: boolean
  bossHit: boolean
} {
  if (!boss) {
    return {
      boss,
      projectiles,
      bossDefeated: false,
      bossHit: false
    }
  }

  let nextBoss = boss
  const remainingProjectiles: ProjectileEntity[] = []
  let bossHit = false

  for (const projectile of projectiles) {
    if (projectile.origin !== 'player') {
      remainingProjectiles.push(projectile)
      continue
    }

    const previousY = projectile.y - projectile.speedY * deltaSeconds
    const sweptTop = Math.min(previousY, projectile.y)
    const sweptBottom = Math.max(previousY + projectile.height, projectile.y + projectile.height)
    const sweptProjectile = {
      ...projectile,
      y: sweptTop,
      height: sweptBottom - sweptTop
    }

    if (!intersects(sweptProjectile, nextBoss)) {
      remainingProjectiles.push(projectile)
      continue
    }

    const nextHealth = Math.max(0, nextBoss.health - getProjectileDamageAgainstBoss(projectile))
    bossHit = true
    nextBoss = {
      ...nextBoss,
      health: nextHealth
    }
  }

  const bossDefeated = nextBoss.health <= 0

  return {
    boss: bossDefeated ? null : nextBoss,
    projectiles: remainingProjectiles,
    bossDefeated,
    bossHit
  }
}

export function resolvePlayerDropCollisions(
  player: PlayerEntity,
  drops: RareDropEntity[]
): {
  drops: RareDropEntity[]
  collectedShots: Array<Extract<TemporaryPowerUpType, 'laser' | 'homing-missile'>>
} {
  const remainingDrops: RareDropEntity[] = []
  const collectedShots: Array<Extract<TemporaryPowerUpType, 'laser' | 'homing-missile'>> = []

  for (const drop of drops) {
    if (intersects(player, drop)) {
      collectedShots.push(drop.grantedShotType)
      continue
    }

    remainingDrops.push(drop)
  }

  return {
    drops: remainingDrops,
    collectedShots
  }
}
