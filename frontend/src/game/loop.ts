type LoopHandlers = {
  update: (deltaSeconds: number) => void
  render: (interpolation: number) => void
}

type LoopOptions = {
  fixedTimestepSeconds?: number
  maxFrameSeconds?: number
}

export type GameLoopController = {
  start: () => void
  stop: () => void
  pause: () => void
  resume: () => void
  isRunning: () => boolean
}

export function createGameLoop(
  handlers: LoopHandlers,
  options: LoopOptions = {}
): GameLoopController {
  const fixedTimestepSeconds = options.fixedTimestepSeconds ?? 1 / 60
  const maxFrameSeconds = options.maxFrameSeconds ?? 0.25

  let animationFrameId: number | null = null
  let lastTimeMs = 0
  let accumulatorSeconds = 0
  let running = false
  let paused = false

  const frame = (nowMs: number) => {
    if (!running) {
      return
    }

    const frameSeconds = Math.min((nowMs - lastTimeMs) / 1000, maxFrameSeconds)
    lastTimeMs = nowMs

    if (!paused) {
      accumulatorSeconds += frameSeconds

      while (accumulatorSeconds >= fixedTimestepSeconds) {
        handlers.update(fixedTimestepSeconds)
        accumulatorSeconds -= fixedTimestepSeconds
      }
    }

    handlers.render(accumulatorSeconds / fixedTimestepSeconds)
    animationFrameId = window.requestAnimationFrame(frame)
  }

  const start = () => {
    if (running) {
      return
    }

    running = true
    paused = false
    lastTimeMs = performance.now()
    accumulatorSeconds = 0
    animationFrameId = window.requestAnimationFrame(frame)
  }

  const stop = () => {
    if (animationFrameId !== null) {
      window.cancelAnimationFrame(animationFrameId)
    }

    animationFrameId = null
    running = false
    paused = false
    accumulatorSeconds = 0
  }

  const pause = () => {
    paused = true
  }

  const resume = () => {
    if (!running) {
      return
    }

    paused = false
    lastTimeMs = performance.now()
  }

  const isRunning = () => running && !paused

  return {
    start,
    stop,
    pause,
    resume,
    isRunning
  }
}
