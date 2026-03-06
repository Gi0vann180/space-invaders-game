import { expect, test } from '@playwright/test'

test('US1 exibe rodada em execução com canvas ativo', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Iniciar rodada' }).click()

  await expect(page.locator('canvas')).toBeVisible()
  await expect(page.getByText('Stage: 1')).toBeVisible()
  await expect(page.getByText('Lives:')).toBeVisible()
})
