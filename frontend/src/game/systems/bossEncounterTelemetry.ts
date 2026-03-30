import { getCycleIndex } from '../config/gameplay'
import { logTelemetryEvent } from '../../lib/telemetry'

export type BossTelemetryBase = {
  stage: number
  bossId: string
  attempt: number
  bossHealthMax: number
}

const emittedEvents = new Set<string>()

function eventKey(event: string, base: BossTelemetryBase): string {
  return `${event}:${base.stage}:${base.attempt}`
}

async function emitOnce(event: string, payload: Record<string, string | number | boolean>): Promise<boolean> {
  const key = eventKey(event, {
    stage: Number(payload.stage),
    bossId: String(payload.bossId),
    attempt: Number(payload.attempt),
    bossHealthMax: Number(payload.bossHealthMax ?? 0)
  })

  if (emittedEvents.has(key)) {
    return false
  }

  emittedEvents.add(key)
  const logged = await logTelemetryEvent(event, payload)

  if (!logged) {
    emittedEvents.delete(key)
  }

  return logged
}

export async function emitBossEncounterStarted(base: BossTelemetryBase): Promise<boolean> {
  return emitOnce('boss_encounter_started', {
    stage: base.stage,
    bossId: base.bossId,
    attempt: base.attempt,
    cycle: getCycleIndex(base.stage),
    bossHealthMax: base.bossHealthMax
  })
}

export async function emitBossPlayerDefeated(base: BossTelemetryBase): Promise<boolean> {
  return emitOnce('boss_player_defeated', {
    stage: base.stage,
    bossId: base.bossId,
    attempt: base.attempt,
    cycle: getCycleIndex(base.stage),
    bossHealthMax: base.bossHealthMax
  })
}

export async function emitBossPlayerVictory(base: BossTelemetryBase): Promise<boolean> {
  return emitOnce('boss_player_victory', {
    stage: base.stage,
    bossId: base.bossId,
    attempt: base.attempt,
    cycle: getCycleIndex(base.stage),
    bossHealthMax: base.bossHealthMax
  })
}

export function resetBossTelemetryDedupe(): void {
  emittedEvents.clear()
}
