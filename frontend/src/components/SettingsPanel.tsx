import type { GameSettings } from '../state/settingsStore'

type SettingsPanelProps = {
  isOpen: boolean
  settings: GameSettings
  onChange: (partial: Partial<GameSettings>) => void
  onClose: () => void
}

export function SettingsPanel({ isOpen, settings, onChange, onClose }: SettingsPanelProps) {
  if (!isOpen) {
    return null
  }

  return (
    <aside className="absolute inset-0 z-50 grid place-items-center bg-slate-950/80 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-5 text-slate-100">
        <h2 className="mb-4 text-xl font-semibold">Configurações</h2>
        <div className="space-y-3 text-sm">
          <label className="flex items-center justify-between">
            <span>Áudio</span>
            <input
              checked={settings.audioEnabled}
              onChange={(event) => onChange({ audioEnabled: event.target.checked })}
              type="checkbox"
            />
          </label>
          <label className="flex items-center justify-between">
            <span>Vibração</span>
            <input
              checked={settings.vibrationEnabled}
              onChange={(event) => onChange({ vibrationEnabled: event.target.checked })}
              type="checkbox"
            />
          </label>
          <label className="flex items-center justify-between">
            <span>Alto contraste</span>
            <input
              checked={settings.highContrast}
              onChange={(event) => onChange({ highContrast: event.target.checked })}
              type="checkbox"
            />
          </label>
          <label className="flex items-center justify-between">
            <span>Legendas</span>
            <input
              checked={settings.captionsEnabled}
              onChange={(event) => onChange({ captionsEnabled: event.target.checked })}
              type="checkbox"
            />
          </label>
          <label className="flex items-center justify-between">
            <span>Telemetria (opt-in)</span>
            <input
              checked={settings.telemetryConsent}
              onChange={(event) => onChange({ telemetryConsent: event.target.checked })}
              type="checkbox"
            />
          </label>
          <label className="flex items-center justify-between gap-3">
            <span>Sensibilidade</span>
            <input
              className="w-36"
              max={2}
              min={0.5}
              onChange={(event) => onChange({ inputSensitivity: Number(event.target.value) })}
              step={0.1}
              type="range"
              value={settings.inputSensitivity}
            />
          </label>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium" onClick={onClose} type="button">
            Fechar
          </button>
        </div>
      </div>
    </aside>
  )
}
