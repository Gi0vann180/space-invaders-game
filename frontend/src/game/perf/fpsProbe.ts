export type FpsProbe = {
  sample: (nowMs: number) => number
  getAverage: () => number
  reset: () => void
}

export function createFpsProbe(sampleWindowMs = 2000): FpsProbe {
  let lastFrameMs: number | null = null
  const samples: Array<{ at: number; fps: number }> = []

  const sample = (nowMs: number): number => {
    if (lastFrameMs === null) {
      lastFrameMs = nowMs
      return 0
    }

    const deltaMs = nowMs - lastFrameMs
    lastFrameMs = nowMs

    const fps = deltaMs > 0 ? 1000 / deltaMs : 0
    samples.push({ at: nowMs, fps })

    while (samples.length > 0 && nowMs - samples[0].at > sampleWindowMs) {
      samples.shift()
    }

    return fps
  }

  const getAverage = (): number => {
    if (samples.length === 0) {
      return 0
    }

    const total = samples.reduce((sum, item) => sum + item.fps, 0)
    return total / samples.length
  }

  const reset = () => {
    lastFrameMs = null
    samples.splice(0, samples.length)
  }

  return {
    sample,
    getAverage,
    reset
  }
}
