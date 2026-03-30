import { expect, test } from '@playwright/test'

async function setBossEncounterState(
  page: import('@playwright/test').Page,
  state: {
    status: 'running' | 'paused' | 'game-over' | 'shop'
    stage: number
    bossEncounter: Record<string, unknown>
  }
) {
  await page.evaluate((nextState) => {
    const store = (window as Window & {
      __GAME_STORE__?: {
        getState: () => {
          bossEncounter: Record<string, unknown>
        }
        setState: (partial: Record<string, unknown>) => void
      }
    }).__GAME_STORE__

    if (!store) {
      throw new Error('Game store unavailable in browser context')
    }

    const current = store.getState()
    store.setState({
      status: nextState.status,
      stage: nextState.stage,
      bossEncounter: {
        ...current.bossEncounter,
        ...nextState.bossEncounter
      }
    })
  }, state)
}

test('US2 derrota do boss avanca fase apos encontro', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: /iniciar rodada/i })).toBeVisible()

  await setBossEncounterState(page, {
    status: 'paused',
    stage: 4,
    bossEncounter: {
      active: true,
      lifecycle: 'active',
      bossId: 'boss-stage-4',
      profile: {
        profileId: 'phase-4-nova-diver',
        displayName: 'Nova Diver',
        movementModel: 'dive',
        feedbackPreset: 'nova',
        telegraphMs: 1150,
        patternIds: ['line-5', 'targeted-2', 'burst-3']
      },
      stage: 4,
      attempt: 2,
      startedAtMs: 100,
      endedAtMs: null,
      outcome: 'in-progress',
      damageTaken: 1,
      health: 9,
      maxHealth: 42
    }
  })

  await expect(page.getByText('Boss HP: 9/42')).toBeVisible()
  await expect(page.getByText('Nova Diver')).toBeVisible()

  await setBossEncounterState(page, {
    status: 'game-over',
    stage: 4,
    bossEncounter: {
      active: false,
      lifecycle: 'defeat',
      endedAtMs: 300,
      outcome: 'defeat',
      health: 0
    }
  })

  await expect(page.getByRole('heading', { name: 'Game Over' })).toBeVisible()
  await expect(page.getByText('Derrota contra Nova Diver na tentativa 2.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Reiniciar' })).toBeVisible()
})
