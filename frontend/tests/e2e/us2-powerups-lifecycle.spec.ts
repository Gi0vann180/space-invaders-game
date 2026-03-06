import { expect, test } from '@playwright/test'

test('US2 exibe painel de power-ups ativos com timer', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Iniciar rodada' }).click()

  await expect(page.getByText('Power-ups ativos')).toBeVisible()
  await expect(page.getByText('Nenhum')).toBeVisible()

  await expect(page.getByText(/laser:|homing-missile:|shield:/)).toBeVisible({ timeout: 12000 })
})
