import { expect, test } from '@playwright/test'

test('US2 HUD mostra fase ativa com jogo iniciado', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Iniciar rodada' }).click()

  await expect(page.getByText('Stage: 1')).toBeVisible()
  await expect(page.locator('canvas')).toBeVisible()
})
