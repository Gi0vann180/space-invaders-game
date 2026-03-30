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

test('US2 exibe vitoria de boss com feedback contextual e CTA de progressao', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: /iniciar rodada/i })).toBeVisible()

  await setBossEncounterState(page, {
    status: 'shop',
    stage: 5,
    bossEncounter: {
      active: false,
      lifecycle: 'victory',
      bossId: 'boss-stage-5',
      profile: {
        profileId: 'phase-5-void-harrier',
        displayName: 'Void Harrier',
        movementModel: 'chaotic',
        feedbackPreset: 'void',
        telegraphMs: 1050,
        patternIds: ['targeted-2', 'burst-3', 'line-5', 'burst-3']
      },
      stage: 5,
      attempt: 1,
      startedAtMs: 100,
      endedAtMs: 450,
      outcome: 'victory',
      damageTaken: 2,
      health: 0,
      maxHealth: 54
    }
  })

  await expect(page.getByRole('heading', { name: 'FASE COMPLETADA' })).toBeVisible()
  await expect(page.getByText('Boss derrotado: Void Harrier.')).toBeVisible()
  await expect(page.getByText('Recompensa aplicada. Voce desbloqueou a proxima fase da campanha.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Proxima fase' })).toBeVisible()
})

test('US2 exibe encounter ativo com leitura de HP e identidade do boss', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: /iniciar rodada/i })).toBeVisible()

  await setBossEncounterState(page, {
    status: 'paused',
    stage: 2,
    bossEncounter: {
      active: true,
      lifecycle: 'active',
      bossId: 'boss-stage-2',
      profile: {
        profileId: 'phase-2-volt-weaver',
        displayName: 'Volt Weaver',
        movementModel: 'zigzag',
        feedbackPreset: 'volt',
        telegraphMs: 1350,
        patternIds: ['line-5', 'burst-3', 'targeted-2']
      },
      stage: 2,
      attempt: 1,
      startedAtMs: 100,
      endedAtMs: null,
      outcome: 'in-progress',
      damageTaken: 0,
      health: 12,
      maxHealth: 24
    }
  })

  await expect(page.getByText('Volt Weaver')).toBeVisible()
  await expect(page.getByText('Boss HP: 12/24')).toBeVisible()
})
