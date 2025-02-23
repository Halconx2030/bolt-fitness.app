import { test, expect } from '@playwright/test';

test.describe('Flujo de ejercicios', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada prueba
    await page.goto('/login');
    await page.getByLabel(/correo electrónico/i).fill('test@example.com');
    await page.getByLabel(/contraseña/i).fill('password123');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test('muestra lista de ejercicios', async ({ page }) => {
    await page.goto('/exercises');

    await expect(page.getByRole('heading', { name: /ejercicios/i })).toBeVisible();
    const exercises = await page.getByRole('link', { name: /press|sentadillas|dominadas/i }).all();
    expect(exercises.length).toBeGreaterThan(0);
  });

  test('filtra ejercicios por grupo muscular', async ({ page }) => {
    await page.goto('/exercises');

    await page.getByRole('combobox', { name: /grupo muscular/i }).selectOption('Pecho');
    await expect(page.getByText(/press de banca/i)).toBeVisible();

    await page.getByRole('combobox', { name: /grupo muscular/i }).selectOption('Piernas');
    await expect(page.getByText(/sentadillas/i)).toBeVisible();
  });

  test('muestra detalles del ejercicio', async ({ page }) => {
    await page.goto('/exercises');
    await page.getByText(/press de banca/i).click();

    await expect(page.getByRole('heading', { name: /press de banca/i })).toBeVisible();
    await expect(page.getByText(/grupo muscular: pecho/i)).toBeVisible();
    await expect(page.getByText(/dificultad:/i)).toBeVisible();
    await expect(page.getByText(/equipo necesario:/i)).toBeVisible();
  });

  test('maneja errores de carga', async ({ page }) => {
    // Simular error de red
    await page.route('**/api/exercises', route => route.abort());
    await page.goto('/exercises');

    await expect(page.getByRole('alert')).toContainText(/error al cargar/i);
  });

  test('implementa paginación correctamente', async ({ page }) => {
    await page.goto('/exercises');

    // Verificar elementos de paginación
    await expect(page.getByRole('button', { name: /siguiente/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /anterior/i })).toBeDisabled();

    // Navegar a la siguiente página
    await page.getByRole('button', { name: /siguiente/i }).click();
    await expect(page.getByRole('button', { name: /anterior/i })).toBeEnabled();
  });

  test('permite búsqueda de ejercicios', async ({ page }) => {
    await page.goto('/exercises');

    const searchInput = page.getByPlaceholder(/buscar ejercicios/i);
    await searchInput.fill('press');
    await searchInput.press('Enter');

    const results = await page.getByRole('link', { name: /press/i }).all();
    expect(results.length).toBeGreaterThan(0);

    // Verificar que solo se muestran resultados relevantes
    await expect(page.getByText(/sentadillas/i)).not.toBeVisible();
  });
});
