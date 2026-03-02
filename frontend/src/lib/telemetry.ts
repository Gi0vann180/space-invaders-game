import { putRecord } from './indexedDb'

export type TelemetryEvent = {
  id: string
  type: string
  payload?: Record<string, string | number | boolean>
  createdAt: string
}

let hasTelemetryConsent = false

export function setTelemetryConsent(consent: boolean): void {
  hasTelemetryConsent = consent
}

export function getTelemetryConsent(): boolean {
  return hasTelemetryConsent
}

export async function logTelemetryEvent(
  eventType: string,
  payload?: Record<string, string | number | boolean>
): Promise<boolean> {
  if (!hasTelemetryConsent) {
    return false
  }

  const event: TelemetryEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: eventType,
    payload,
    createdAt: new Date().toISOString()
  }

  await putRecord('telemetry', event)
  return true
}
