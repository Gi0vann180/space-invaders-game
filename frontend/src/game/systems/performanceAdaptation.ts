export type PerformanceMode = 'quality' | 'balanced' | 'performance'

export function selectPerformanceMode(averageFps: number): PerformanceMode {
  if (averageFps >= 55) {
    return 'quality'
  }

  if (averageFps >= 40) {
    return 'balanced'
  }

  return 'performance'
}

export function getTargetFrameRate(mode: PerformanceMode): number {
  if (mode === 'performance') {
    return 30
  }

  return 60
}

export function clampProjectileLimitByPerformance(baseLimit: number, mode: PerformanceMode): number {
  if (mode === 'quality') {
    return baseLimit
  }

  if (mode === 'balanced') {
    return Math.max(2, Math.floor(baseLimit * 0.85))
  }

  return Math.max(2, Math.floor(baseLimit * 0.65))
}
