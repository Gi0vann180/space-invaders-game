import { expect, test } from '@playwright/test'

test('US3 drop raro coletado ativa tiro especial', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: /iniciar rodada/i }).click()

  await expect(page.getByText(/Power-ups ativos/i)).toBeVisible()
})
