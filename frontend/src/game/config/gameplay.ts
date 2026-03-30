export const BOSS_STAGE_INTERVAL = 10
export const CAMPAIGN_BOSS_STAGE_MAX = 5

export const RARE_DROP_CHANCE_PERCENT = 8

export const RARE_DROP_LIFETIME_MS = 8000

export const BOSS_HORIZONTAL_SPEED = 90

export const CYCLE_DIFFICULTY_STEP = 0.1

export function isBossStage(stage: number): boolean {
  if (stage < 1) {
    return false
  }

  if (stage <= CAMPAIGN_BOSS_STAGE_MAX) {
    return true
  }

  return stage % BOSS_STAGE_INTERVAL === 0
}

export function getCycleIndex(stage: number): number {
  if (stage < 1) {
    return 0
  }

  return Math.floor((stage - 1) / BOSS_STAGE_INTERVAL)
}

export function getCycleDifficultyMultiplier(stage: number): number {
  return 1 + getCycleIndex(stage) * CYCLE_DIFFICULTY_STEP
}
