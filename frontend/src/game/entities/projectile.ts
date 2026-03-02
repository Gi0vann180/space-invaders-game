export type ProjectileEntity = {
  id: string
  origin: 'player' | 'enemy'
  x: number
  y: number
  width: number
  height: number
  speedY: number
}

export function createPlayerProjectile(playerX: number, playerY: number): ProjectileEntity {
  return {
    id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    origin: 'player',
    x: playerX,
    y: playerY,
    width: 4,
    height: 12,
    speedY: -440
  }
}

export function stepProjectiles(
  projectiles: ProjectileEntity[],
  deltaSeconds: number,
  canvasHeight: number
): ProjectileEntity[] {
  return projectiles
    .map((projectile) => ({
      ...projectile,
      y: projectile.y + projectile.speedY * deltaSeconds
    }))
    .filter((projectile) => projectile.y + projectile.height >= 0 && projectile.y <= canvasHeight)
}
