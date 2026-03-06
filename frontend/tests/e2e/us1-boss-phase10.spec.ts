import { expect, test } from '@playwright/test'

test('US1 identifica boss na fase 10', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /iniciar rodada/i }).click()

  await page.evaluate(() => {
    const store = (window as Window & { __GAME_STORE__?: { setState: (state: Record<string, unknown>) => void } }).__GAME_STORE__
    store?.setState({
      stage: 10,
      bossEncounter: {
        active: true,
        bossId: 'boss-stage-10',
        health: 30,
        maxHealth: 30
      }
    })
  })

  await expect(page.getByText('Stage: 10')).toBeVisible()
  await expect(page.getByText(/boss na fase/i)).toBeVisible()
  await expect(page.getByText('Boss HP: 30/30')).toBeVisible()
})
