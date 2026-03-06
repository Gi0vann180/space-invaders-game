import { expect, test } from '@playwright/test'

test('Smoke boss/powerups: inicia rodada e mantém HUD ativo', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Iniciar rodada' }).click()

  await expect(page.locator('canvas')).toBeVisible()
  await expect(page.getByText('Stage:')).toBeVisible()
  await expect(page.getByText('Lives:')).toBeVisible()

  for (const stage of [10, 20, 30]) {
    await page.evaluate((nextStage) => {
      const store = (window as Window & { __GAME_STORE__?: { setState: (state: Record<string, unknown>) => void } }).__GAME_STORE__
      store?.setState({
        stage: nextStage,
        bossEncounter: {
          active: true,
          bossId: `boss-stage-${nextStage}`,
          health: 20,
          maxHealth: 20
        }
      })
    }, stage)

    await expect(page.getByText(`Stage: ${stage}`)).toBeVisible()
    await expect(page.getByText(/boss na fase/i)).toBeVisible()
  }
})
