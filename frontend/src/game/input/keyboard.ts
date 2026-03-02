import type { InputSnapshot } from '../types'

export type KeyboardAdapter = {
  connect: () => void
  disconnect: () => void
  getSnapshot: () => InputSnapshot
}

export function createKeyboardAdapter(target: Window = window): KeyboardAdapter {
  const pressed = new Set<string>()

  const onKeyDown = (event: KeyboardEvent) => {
    pressed.add(event.code)
  }

  const onKeyUp = (event: KeyboardEvent) => {
    pressed.delete(event.code)
  }

  const connect = () => {
    target.addEventListener('keydown', onKeyDown)
    target.addEventListener('keyup', onKeyUp)
  }

  const disconnect = () => {
    target.removeEventListener('keydown', onKeyDown)
    target.removeEventListener('keyup', onKeyUp)
    pressed.clear()
  }

  const getSnapshot = (): InputSnapshot => {
    const moveLeft = pressed.has('ArrowLeft') || pressed.has('KeyA')
    const moveRight = pressed.has('ArrowRight') || pressed.has('KeyD')
    const horizontal: -1 | 0 | 1 = moveLeft === moveRight ? 0 : moveLeft ? -1 : 1

    return {
      horizontal,
      fire: pressed.has('Space') || pressed.has('KeyJ') || pressed.has('Enter'),
      pause: pressed.has('Escape') || pressed.has('KeyP')
    }
  }

  return {
    connect,
    disconnect,
    getSnapshot
  }
}
