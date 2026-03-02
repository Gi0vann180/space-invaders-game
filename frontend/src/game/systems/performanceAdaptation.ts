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
