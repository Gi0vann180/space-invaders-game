import { createEnemyGrid, type EnemyEntity } from '../entities/enemy'

export type WaveState = {
  stage: number
  enemies: EnemyEntity[]
  direction: 1 | -1
}

export function createInitialWave(): WaveState {
  return {
    stage: 1,
    enemies: createEnemyGrid(1),
    direction: 1
  }
}

export function stepEnemies(
  wave: WaveState,
  deltaSeconds: number,
  canvasWidth: number
): WaveState {
  const speed = 30 + wave.stage * 4
  const horizontalStep = speed * deltaSeconds * wave.direction

  let hitBorder = false
  const movedEnemies = wave.enemies.map((enemy) => {
    const nextX = enemy.x + horizontalStep
    if (nextX <= 0 || nextX + enemy.width >= canvasWidth) {
      hitBorder = true
    }

    return {
      ...enemy,
      x: nextX
    }
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
    direction: wave.direction
  }
}
