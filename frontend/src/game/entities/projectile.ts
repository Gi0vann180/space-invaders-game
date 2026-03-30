export type ProjectileEntity = {
  id: string
  origin: 'player' | 'enemy'
  kind: 'default' | 'laser' | 'homing'
  x: number
  y: number
  width: number
  height: number
  speedY: number
  speedX: number
  damage: number
}

export function createPlayerProjectile(playerX: number, playerY: number): ProjectileEntity {
  return {
    id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    origin: 'player',
    kind: 'default',
    x: playerX,
    y: playerY,
    width: 4,
    height: 12,
    speedY: -440,
    speedX: 0,
    damage: 2
  }
}

export function createLaserProjectile(playerX: number, playerY: number): ProjectileEntity {
  return {
    id: `l-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    origin: 'player',
    kind: 'laser',
    x: playerX,
    y: playerY,
    width: 8,
    height: 18,
    speedY: -520,
    speedX: 0,
    damage: 4
  }
}

export function createHomingMissileProjectile(playerX: number, playerY: number): ProjectileEntity {
  return {
    id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    origin: 'player',
    kind: 'homing',
    x: playerX,
    y: playerY,
    width: 6,
    height: 14,
    speedY: -420,
    speedX: 0,
    damage: 3
  }
}

export function createEnemyProjectile(enemyX: number, enemyY: number, speedY: number): ProjectileEntity {
  return {
    id: `e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    origin: 'enemy',
    kind: 'default',
    x: enemyX,
    y: enemyY,
    width: 4,
    height: 12,
    speedY,
    speedX: 0,
    damage: 1
  }
}

export function steerHomingProjectiles(
  projectiles: ProjectileEntity[],
  targetX: number | null,
  deltaSeconds: number
): ProjectileEntity[] {
  if (targetX === null) {
    return projectiles
  }

  return projectiles.map((projectile) => {
    if (projectile.kind !== 'homing' || projectile.origin !== 'player') {
      return projectile
    }

    const projectileCenter = projectile.x + projectile.width / 2
    const direction = targetX > projectileCenter ? 1 : -1
    const speedX = 160 * direction

    return {
      ...projectile,
      speedX,
      x: projectile.x + speedX * deltaSeconds
    }
  })
}

export function stepProjectiles(
  projectiles: ProjectileEntity[],
  deltaSeconds: number,
  canvasHeight: number
): ProjectileEntity[] {
  return projectiles
    .map((projectile) => ({
      ...projectile,
      x: projectile.x + projectile.speedX * deltaSeconds,
      y: projectile.y + projectile.speedY * deltaSeconds
    }))
    .filter((projectile) => projectile.y + projectile.height >= 0 && projectile.y <= canvasHeight)
}
