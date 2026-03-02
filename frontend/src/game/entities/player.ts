export type PlayerEntity = {
  id: 'player'
  x: number
  y: number
  width: number
  height: number
  speed: number
  fireCooldown: number
  fireTimer: number
}

export function createPlayer(canvasWidth: number, canvasHeight: number): PlayerEntity {
  const width = 42
  const height = 20

  return {
    id: 'player',
    x: canvasWidth / 2 - width / 2,
    y: canvasHeight - 44,
    width,
    height,
    speed: 320,
    fireCooldown: 0.25,
    fireTimer: 0
  }
}

export function movePlayer(
  player: PlayerEntity,
  horizontal: -1 | 0 | 1,
  deltaSeconds: number,
  canvasWidth: number
): PlayerEntity {
  const nextX = player.x + horizontal * player.speed * deltaSeconds
  const clampedX = Math.max(0, Math.min(canvasWidth - player.width, nextX))

  return {
    ...player,
    x: clampedX
  }
}

export function tickPlayer(player: PlayerEntity, deltaSeconds: number): PlayerEntity {
  return {
    ...player,
    fireTimer: Math.max(0, player.fireTimer - deltaSeconds)
  }
}

export function tryConsumeShot(player: PlayerEntity): [PlayerEntity, boolean] {
  if (player.fireTimer > 0) {
    return [player, false]
  }

  return [
    {
      ...player,
      fireTimer: player.fireCooldown
    },
    true
  ]
}
