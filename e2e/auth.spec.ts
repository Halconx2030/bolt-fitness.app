import { test, expect } from '@playwright/test';

test.describe('Flujo de autenticación', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('muestra formulario de login', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: /iniciar sesión/i })).toBeVisible();
    await expect(page.getByLabel(/correo electrónico/i)).toBeVisible();
    await expect(page.getByLabel(/contraseña/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible();
  });

  test('muestra error con credenciales inválidas', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/correo electrónico/i).fill('test@invalid.com');
    await page.getByLabel(/contraseña/i).fill('wrongpassword');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    await expect(page.getByRole('alert')).toContainText(/credenciales inválidas/i);
  });

  test('redirige al dashboard después de login exitoso', async ({ page }) => {
    await page.goto('/login');

    await page.getByLabel(/correo electrónico/i).fill('test@example.com');
    await page.getByLabel(/contraseña/i).fill('password123');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole('heading', { name: /próximos ejercicios/i })).toBeVisible();
  });
});
