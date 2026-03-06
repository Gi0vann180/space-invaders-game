import { getCycleIndex, isBossStage } from '../../src/game/config/gameplay'

export type StageCycleSnapshot = {
  stage: number
  cycle: number
  boss: boolean
}

export function buildStageCycleSnapshots(lastStage: number): StageCycleSnapshot[] {
  return Array.from({ length: lastStage }, (_, index) => {
    const stage = index + 1
    return {
      stage,
      cycle: getCycleIndex(stage),
      boss: isBossStage(stage)
    }
  })
}
