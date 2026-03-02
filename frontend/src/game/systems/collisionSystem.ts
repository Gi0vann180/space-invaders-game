import type { EnemyEntity } from '../entities/enemy'
import type { PlayerEntity } from '../entities/player'
import type { ProjectileEntity } from '../entities/projectile'

type CollisionResult = {
  enemies: EnemyEntity[]
  projectiles: ProjectileEntity[]
  defeatedEnemyCount: number
}

function intersects(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number }
): boolean {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
}

export function resolvePlayerProjectileCollisions(
  enemies: EnemyEntity[],
  projectiles: ProjectileEntity[]
): CollisionResult {
  const remainingEnemies = [...enemies]
  const remainingProjectiles: ProjectileEntity[] = []
  let defeatedEnemyCount = 0

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
    const nextHealth = hitEnemy.health - 1

    if (nextHealth <= 0) {
      remainingEnemies.splice(hitIndex, 1)
      defeatedEnemyCount += 1
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
    defeatedEnemyCount
  }
}

export function checkEnemyReachedPlayerLine(
  enemies: EnemyEntity[],
  player: PlayerEntity
): boolean {
  return enemies.some((enemy) => enemy.y + enemy.height >= player.y)
}
