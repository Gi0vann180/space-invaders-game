import type { BossAttackPatternId } from '../entities/boss'

export type BossMovementModel = 'drift' | 'zigzag' | 'sweep' | 'dive' | 'chaotic'
export type BossFeedbackPreset = 'ember' | 'volt' | 'frost' | 'nova' | 'void'

export type BossProfile = {
  stage: number
  attackPatternSequence: BossAttackPatternId[]
  telegraphMs: number
  movementModel: BossMovementModel
  feedbackPreset: BossFeedbackPreset
}

const PROFILES: BossProfile[] = [
  {
    stage: 1,
    attackPatternSequence: ['burst-3', 'targeted-2'],
    telegraphMs: 1450,
    movementModel: 'drift',
    feedbackPreset: 'ember'
  },
  {
    stage: 2,
    attackPatternSequence: ['line-5', 'burst-3', 'targeted-2'],
    telegraphMs: 1350,
    movementModel: 'zigzag',
    feedbackPreset: 'volt'
  },
  {
    stage: 3,
    attackPatternSequence: ['targeted-2', 'line-5', 'burst-3'],
    telegraphMs: 1250,
    movementModel: 'sweep',
    feedbackPreset: 'frost'
  },
  {
    stage: 4,
    attackPatternSequence: ['line-5', 'targeted-2', 'burst-3'],
    telegraphMs: 1150,
    movementModel: 'dive',
    feedbackPreset: 'nova'
  },
  {
    stage: 5,
    attackPatternSequence: ['targeted-2', 'burst-3', 'line-5', 'burst-3'],
    telegraphMs: 1050,
    movementModel: 'chaotic',
    feedbackPreset: 'void'
  }
]

const DEFAULT_PROFILE: BossProfile = {
  stage: 0,
  attackPatternSequence: ['line-5', 'targeted-2', 'burst-3'],
  telegraphMs: 1000,
  movementModel: 'chaotic',
  feedbackPreset: 'void'
}

export function getBossProfileForStage(stage: number, attempt = 1): BossProfile {
  const base = PROFILES.find((item) => item.stage === stage)
  if (!base) {
    return {
      ...DEFAULT_PROFILE,
      stage
    }
  }

  const shift = Math.abs(attempt - 1) % base.attackPatternSequence.length
  const rotated = [...base.attackPatternSequence.slice(shift), ...base.attackPatternSequence.slice(0, shift)]

  return {
    ...base,
    attackPatternSequence: rotated,
    telegraphMs: Math.max(900, base.telegraphMs - Math.min(3, attempt - 1) * 50)
  }
}
