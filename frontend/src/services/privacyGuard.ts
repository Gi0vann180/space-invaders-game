type TelemetryPayload = Record<string, string | number | boolean | null | undefined>

const ALLOWED_KEYS = new Set(['event', 'score', 'stage', 'durationMs', 'result'])

export function sanitizeTelemetryPayload(payload: TelemetryPayload): Record<string, string | number | boolean> {
  const sanitized: Record<string, string | number | boolean> = {}

  for (const [key, value] of Object.entries(payload)) {
    if (!ALLOWED_KEYS.has(key) || value === null || value === undefined) {
      continue
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value
    }
  }

  return sanitized
}

export function canUploadTelemetry(consent: boolean): boolean {
  return consent
}
