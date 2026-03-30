import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { SettingsPanel } from '../../src/components/SettingsPanel'
import { ShopScreen } from '../../src/components/ShopScreen'
import { EMPTY_UPGRADE_LEVELS } from '../../src/services/shopService'

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

  it('dispara callback opcional de confirmacao na loja apenas em acoes validas', () => {
    const onConfirmClick = vi.fn()
    const onPurchase = vi.fn()
    const onPurchaseExtraLife = vi.fn()
    const onSelectRunModifier = vi.fn()
    const onContinue = vi.fn()

    render(
      <ShopScreen
        score={200}
        lives={2}
        upgradeLevels={{ ...EMPTY_UPGRADE_LEVELS }}
        runModifierOffer={{
          runId: 'run-1',
          stageNumber: 2,
          guaranteedApplicableOption: true,
          selectedModifierId: null,
          options: [
            {
              modifierId: 'run-mod-1',
              label: 'Crit chance',
              category: 'offense',
              applicable: true
            }
          ]
        }}
        onConfirmClick={onConfirmClick}
        onPurchase={onPurchase}
        onPurchaseExtraLife={onPurchaseExtraLife}
        onSelectRunModifier={onSelectRunModifier}
        onContinue={onContinue}
      />
    )

    fireEvent.click(screen.getAllByRole('button', { name: /Evoluir/i })[0])
    fireEvent.click(screen.getByRole('button', { name: /Comprar vida/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Selecionar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Próxima fase' }))

    expect(onConfirmClick).toHaveBeenCalledTimes(4)
    expect(onPurchase).toHaveBeenCalledTimes(1)
    expect(onPurchaseExtraLife).toHaveBeenCalledTimes(1)
    expect(onSelectRunModifier).toHaveBeenCalledWith('run-mod-1')
    expect(onContinue).toHaveBeenCalledTimes(1)
  })
})
