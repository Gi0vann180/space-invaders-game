import { expect, test } from '@playwright/test'

test('US4 ciclo avancado aumenta dificuldade', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: /iniciar rodada/i }).click()
  await expect(page.getByText(/Stage:/)).toBeVisible()
})
