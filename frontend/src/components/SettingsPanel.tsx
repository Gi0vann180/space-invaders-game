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
    <aside className="fixed inset-0 z-50 grid place-items-center bg-slate-950/72 px-3 py-4 backdrop-blur-sm sm:px-4">
      <div className="ui-shell-strong max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[28px] p-5 text-slate-100 shadow-[0_28px_90px_rgba(2,6,23,0.72)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="ui-chip mb-2 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-100/90">
              Ajustes
            </p>
            <h2 className="ui-display text-[1.45rem] font-bold uppercase tracking-[0.22em] text-white">Configurações</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-300">
              Ajuste som, vibração, contraste e sensibilidade sem sair do fluxo da partida.
            </p>
          </div>
          <button className="ui-button-secondary rounded-full px-3 py-2 text-sm font-semibold" onClick={onClose} type="button">
            Fechar
          </button>
        </div>

        <div className="space-y-3 text-sm">
          {[
            { label: 'Áudio', key: 'audioEnabled', value: settings.audioEnabled },
            { label: 'Vibração', key: 'vibrationEnabled', value: settings.vibrationEnabled },
            { label: 'Alto contraste', key: 'highContrast', value: settings.highContrast },
            { label: 'Legendas', key: 'captionsEnabled', value: settings.captionsEnabled },
            { label: 'Telemetria (opt-in)', key: 'telemetryConsent', value: settings.telemetryConsent }
          ].map((item) => (
            <label
              className="ui-field flex items-center justify-between rounded-2xl px-4 py-3 transition hover:border-cyan-400/30"
              key={item.key}
            >
              <span className="font-medium text-slate-100">{item.label}</span>
              <input
                checked={item.value}
                className="h-5 w-5 rounded border-slate-600 bg-slate-900 text-cyan-400 focus:ring-cyan-400 focus:ring-offset-0"
                onChange={(event) => onChange({ [item.key]: event.target.checked } as Partial<GameSettings>)}
                type="checkbox"
              />
            </label>
          ))}

          <label className="ui-field flex flex-col gap-3 rounded-2xl px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium text-slate-100">Sensibilidade</span>
              <span className="ui-chip px-2.5 py-1 text-[10px] font-semibold text-cyan-100">{settings.inputSensitivity.toFixed(1)}x</span>
            </div>
            <input
              className="w-full accent-cyan-400"
              max={2}
              min={0.5}
              onChange={(event) => onChange({ inputSensitivity: Number(event.target.value) })}
              step={0.1}
              type="range"
              value={settings.inputSensitivity}
            />
          </label>
        </div>
      </div>
    </aside>
  )
}
