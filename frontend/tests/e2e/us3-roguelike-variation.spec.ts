import { expect, test } from '@playwright/test'

test('US3 varia ofertas roguelike entre runs', async ({ page }) => {
  await page.goto('/')

  await page.evaluate(() => {
    ;(window as Window & { __GAME_STORE__: { setState: (state: unknown) => void } }).__GAME_STORE__.setState({
      status: 'shop',
      score: 200,
      runModifierOffer: {
        runId: 'run-1',
        stageNumber: 2,
        guaranteedApplicableOption: true,
        selectedModifierId: null,
        options: [
          { modifierId: 'rapid-loader', label: 'Carregador Rápido', category: 'offense', applicable: true },
          { modifierId: 'shield-matrix', label: 'Matriz de Escudo', category: 'defense', applicable: true },
          { modifierId: 'balanced-kit', label: 'Kit Balanceado', category: 'utility', applicable: true }
        ]
      }
    })
  })

  await expect(page.getByText('Oferta da run (fase 2)')).toBeVisible()
  await expect(page.getByText('Carregador Rápido')).toBeVisible()

  await page.evaluate(() => {
    ;(window as Window & { __GAME_STORE__: { setState: (state: unknown) => void } }).__GAME_STORE__.setState({
      runModifierOffer: {
        runId: 'run-2',
        stageNumber: 2,
        guaranteedApplicableOption: true,
        selectedModifierId: null,
        options: [
          { modifierId: 'thruster-boost', label: 'Impulso de Propulsor', category: 'utility', applicable: true },
          { modifierId: 'defense-overdrive', label: 'Sobrecarga Defensiva', category: 'defense', applicable: true },
          { modifierId: 'shield-matrix', label: 'Matriz de Escudo', category: 'defense', applicable: true }
        ]
      }
    })
  })

  await expect(page.getByText('Impulso de Propulsor')).toBeVisible()
})
