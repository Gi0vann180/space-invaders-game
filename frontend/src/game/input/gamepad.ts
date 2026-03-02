import type { InputSnapshot } from '../types'

export type GamepadAdapter = {
  getSnapshot: () => InputSnapshot
}

function clampHorizontal(value: number): -1 | 0 | 1 {
  if (value <= -0.4) {
    return -1
  }

  if (value >= 0.4) {
    return 1
  }

  return 0
}

export function createGamepadAdapter(): GamepadAdapter {
  const getSnapshot = (): InputSnapshot => {
    const gamepads = navigator.getGamepads()
    const gamepad = gamepads.find((item): item is Gamepad => item !== null)

    if (!gamepad) {
      return {
        horizontal: 0,
        fire: false,
        pause: false
      }
    }

    const axis = gamepad.axes[0] ?? 0
    const horizontal = clampHorizontal(axis)

    return {
      horizontal,
      fire: Boolean(gamepad.buttons[0]?.pressed || gamepad.buttons[7]?.pressed),
      pause: Boolean(gamepad.buttons[9]?.pressed)
    }
  }

  return {
    getSnapshot
  }
}
