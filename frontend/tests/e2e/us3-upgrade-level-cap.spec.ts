import { expect, test } from '@playwright/test'

test('US3 mantém experiência base com HUD e comandos visíveis', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Iniciar rodada' }).click()

  await expect(page.getByText('Legenda: use ←/→ para mover e espaço para atirar.')).toBeVisible()
  await expect(page.getByText('Best:')).toBeVisible()
})
