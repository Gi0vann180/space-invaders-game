export type EnemyEntity = {
  id: string
  x: number
  y: number
  width: number
  height: number
  health: number
  points: number
  fireCooldownSeconds: number
  fireTimer: number
}

export function createEnemyGrid(stage: number): EnemyEntity[] {
  const rows = Math.min(4, 2 + Math.floor(stage / 2))
  const cols = 8
  const enemies: EnemyEntity[] = []

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      enemies.push({
        id: `enemy-${stage}-${row}-${col}`,
        x: 80 + col * 72,
        y: 60 + row * 48,
        width: 36,
        height: 24,
        health: 1,
        points: 10 + row * 5,
        fireCooldownSeconds: 1.8,
        fireTimer: (row + col) * 0.04
      })
    }
  }

  return enemies
}

export function tickEnemyFire(enemy: EnemyEntity, deltaSeconds: number): EnemyEntity {
  return {
    ...enemy,
    fireTimer: Math.max(0, enemy.fireTimer - deltaSeconds)
  }
}

export function canEnemyFire(enemy: EnemyEntity): boolean {
  return enemy.fireTimer <= 0
}

export function consumeEnemyShot(enemy: EnemyEntity): EnemyEntity {
  return {
    ...enemy,
    fireTimer: enemy.fireCooldownSeconds
  }
}
