import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SettingsPanel } from '../../src/components/SettingsPanel'

describe('US3 settings panel', () => {
  it('renderiza controles e propaga alterações', () => {
    const onChange = vi.fn()
    const onClose = vi.fn()

    render(
      <SettingsPanel
        isOpen
        onChange={onChange}
        onClose={onClose}
        settings={{
          audioEnabled: true,
          vibrationEnabled: true,
          inputSensitivity: 1,
          highContrast: false,
          captionsEnabled: true,
          telemetryConsent: false
        }}
      />
    )

    fireEvent.click(screen.getByText('Fechar'))
    expect(onClose).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByLabelText('Alto contraste'))
    expect(onChange).toHaveBeenCalled()
  })
})
