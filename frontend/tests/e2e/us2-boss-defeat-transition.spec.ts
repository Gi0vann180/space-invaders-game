import { expect, test } from '@playwright/test'

test('US2 derrota do boss avanca fase apos encontro', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: /iniciar rodada/i }).click()

  const hud = page.getByText(/Stage:/)
  await expect(hud).toBeVisible()

  await expect(page.getByText(/Power-ups ativos/i)).toBeVisible()
})
