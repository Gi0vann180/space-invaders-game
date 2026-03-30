import { getStageConfig } from '../config/stages'
import { getBossProfileForStage, type BossFeedbackPreset, type BossMovementModel } from '../config/bossProfiles'
import { BOSS_HORIZONTAL_SPEED, getCycleDifficultyMultiplier } from '../config/gameplay'

export type BossAttackPatternId = 'burst-3' | 'line-5' | 'targeted-2'

export type BossEntity = {
  id: string
  stage: number
  profileId: string
  displayName: string
  x: number
  y: number
  width: number
  height: number
  health: number
  maxHealth: number
  points: number
  attackCooldownSeconds: number
  attackTimer: number
  patternIds: BossAttackPatternId[]
  patternCursor: number
  velocityX: number
  telegraphMs: number
  movementModel: BossMovementModel
  feedbackPreset: BossFeedbackPreset
  attempt: number
}

export function createBossForStage(stage: number, attempt = 1): BossEntity {
  const stageConfig = getStageConfig(stage)
  const profile = getBossProfileForStage(stage, attempt)

  return {
    id: `boss-stage-${stage}`,
    stage,
    profileId: profile.profileId,
    displayName: profile.displayName,
    x: 340,
    y: 54,
    width: 110,
    height: 60,
    health: stageConfig.bossHealth,
    maxHealth: stageConfig.bossHealth,
    points: stageConfig.bossPoints,
    attackCooldownSeconds: stageConfig.bossAttackIntervalSeconds,
    attackTimer: stageConfig.bossAttackIntervalSeconds,
    patternIds: profile.attackPatternSequence,
    patternCursor: 0,
    velocityX: BOSS_HORIZONTAL_SPEED * getCycleDifficultyMultiplier(stage),
    telegraphMs: profile.telegraphMs,
    movementModel: profile.movementModel,
    feedbackPreset: profile.feedbackPreset,
    attempt
  }
}

export function tickBossAttackTimer(boss: BossEntity, deltaSeconds: number): BossEntity {
  return {
    ...boss,
    attackTimer: Math.max(0, boss.attackTimer - deltaSeconds)
  }
}

export function canBossAttack(boss: BossEntity): boolean {
  return boss.attackTimer <= 0
}

export function consumeBossAttack(boss: BossEntity): BossEntity {
  const nextCursor = (boss.patternCursor + 1) % boss.patternIds.length
  return {
    ...boss,
    attackTimer: boss.attackCooldownSeconds,
    patternCursor: nextCursor
  }
}

export function getCurrentBossPatternId(boss: BossEntity): BossAttackPatternId {
  return boss.patternIds[boss.patternCursor] ?? 'burst-3'
}
