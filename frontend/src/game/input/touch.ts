import type { InputSnapshot } from '../types'

export type TouchAdapter = {
  bind: (element: HTMLElement) => void
  unbind: () => void
  getSnapshot: () => InputSnapshot
}

export function createTouchAdapter(): TouchAdapter {
  let element: HTMLElement | null = null
  let horizontal: -1 | 0 | 1 = 0
  let fire = false

  const onPointerDown = (event: PointerEvent) => {
    if (!element) {
      return
    }

    const rect = element.getBoundingClientRect()
    const x = event.clientX - rect.left
    const ratio = x / rect.width

    if (ratio < 0.3) {
      horizontal = -1
      fire = false
    } else if (ratio > 0.7) {
      horizontal = 1
      fire = false
    } else {
      horizontal = 0
      fire = true
    }
  }

  const onPointerUp = () => {
    horizontal = 0
    fire = false
  }

  const bind = (newElement: HTMLElement) => {
    element = newElement
    element.addEventListener('pointerdown', onPointerDown)
    element.addEventListener('pointerup', onPointerUp)
    element.addEventListener('pointercancel', onPointerUp)
    element.addEventListener('pointerleave', onPointerUp)
  }

  const unbind = () => {
    if (!element) {
      return
    }

    element.removeEventListener('pointerdown', onPointerDown)
    element.removeEventListener('pointerup', onPointerUp)
    element.removeEventListener('pointercancel', onPointerUp)
    element.removeEventListener('pointerleave', onPointerUp)
    element = null
    horizontal = 0
    fire = false
  }

  const getSnapshot = (): InputSnapshot => ({
    horizontal,
    fire,
    pause: false
  })

  return {
    bind,
    unbind,
    getSnapshot
  }
}
