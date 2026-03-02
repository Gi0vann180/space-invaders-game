import type { InputSnapshot } from '../types'
import { createGamepadAdapter } from './gamepad'
import { createKeyboardAdapter } from './keyboard'
import { createTouchAdapter } from './touch'

export type InputManager = {
  connect: (surface?: HTMLElement | null) => void
  disconnect: () => void
  readInput: () => InputSnapshot
}

function mergeInput(sources: InputSnapshot[]): InputSnapshot {
  const horizontalTotal = sources.reduce((acc, source) => acc + source.horizontal, 0)
  const horizontal: -1 | 0 | 1 = horizontalTotal > 0 ? 1 : horizontalTotal < 0 ? -1 : 0

  return {
    horizontal,
    fire: sources.some((source) => source.fire),
    pause: sources.some((source) => source.pause)
  }
}

export function createInputManager(targetWindow: Window = window): InputManager {
  const keyboard = createKeyboardAdapter(targetWindow)
  const touch = createTouchAdapter()
  const gamepad = createGamepadAdapter()

  const connect = (surface?: HTMLElement | null) => {
    keyboard.connect()

    if (surface) {
      touch.bind(surface)
    }
  }

  const disconnect = () => {
    keyboard.disconnect()
    touch.unbind()
  }

  const readInput = (): InputSnapshot => {
    const gamepadSnapshot = gamepad.getSnapshot()
    const touchSnapshot = touch.getSnapshot()
    const keyboardSnapshot = keyboard.getSnapshot()

    return mergeInput([gamepadSnapshot, touchSnapshot, keyboardSnapshot])
  }

  return {
    connect,
    disconnect,
    readInput
  }
}
