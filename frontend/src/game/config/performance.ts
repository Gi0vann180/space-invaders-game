export const MAX_ACTIVE_DROPS = 10

export const DROP_RENDER_THRESHOLD_STAGE = 6

export function clampActiveDropsByStage(stage: number, currentDrops: number): number {
  if (stage < DROP_RENDER_THRESHOLD_STAGE) {
    return Math.min(currentDrops, MAX_ACTIVE_DROPS)
  }

  return Math.min(currentDrops, Math.max(4, MAX_ACTIVE_DROPS - 2))
}
