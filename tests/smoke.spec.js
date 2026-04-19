import { test, expect } from '@playwright/test';

test('page loads with title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/CodePath/);
});

test('first-time user sees profile creation modal', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator('.modal-backdrop.show')).toBeVisible();
  await expect(page.locator('.modal-title')).toContainText('Willkommen');
});

test('creates profile and saves progress', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.fill('#new-profile-name', 'Testuser');
  await page.click('#create-profile-btn');
  await expect(page.locator('.modal-backdrop.show')).toBeHidden();
  await expect(page.locator('#profile-name')).toHaveText('Testuser');
});

test('progress persists after reload', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.fill('#new-profile-name', 'Persist');
  await page.click('#create-profile-btn');
  await page.click('#btn-next');
  const xpBefore = await page.locator('#xp-amount').textContent();
  await page.reload();
  await expect(page.locator('#profile-name')).toHaveText('Persist');
  await expect(page.locator('#xp-amount')).toHaveText(xpBefore);
});

test('lucide icons are rendered', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.fill('#new-profile-name', 'IconTest');
  await page.click('#create-profile-btn');
  const svgCount = await page.locator('svg.lucide').count();
  expect(svgCount).toBeGreaterThan(0);
});

test('all phases present in sidebar', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.fill('#new-profile-name', 'NavTest');
  await page.click('#create-profile-btn');
  const phases = await page.locator('.phase-btn').count();
  expect(phases).toBe(6);
});

test('profile menu opens', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.fill('#new-profile-name', 'MenuTest');
  await page.click('#create-profile-btn');
  await page.click('.profile-bar');
  await expect(page.locator('#profile-menu.show')).toBeVisible();
});

test('quiz answering awards XP', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.fill('#new-profile-name', 'QuizTest');
  await page.click('#create-profile-btn');
  // Navigate to lesson with quiz (Phase 1 Lesson 2)
  await page.click('#btn-next');
  await page.click('#btn-next');
  // After 2 "next" clicks we're at Phase 1 Lesson 3 — go back once
  await page.click('#btn-prev');
  const xpBefore = parseInt(await page.locator('#xp-amount').textContent() || '0');
  const correctOption = page.locator('[data-quiz="q1"][data-idx="0"]');
  await correctOption.click();
  await expect(correctOption).toHaveClass(/correct/);
  const xpAfter = parseInt(await page.locator('#xp-amount').textContent() || '0');
  expect(xpAfter).toBeGreaterThan(xpBefore);
});
