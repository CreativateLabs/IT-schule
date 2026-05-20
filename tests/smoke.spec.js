import { test, expect } from '@playwright/test';

// Helper: inject a local profile into localStorage, reload, then reveal the app
async function loginWithLocalProfile(page, name = 'Testuser') {
  await page.evaluate((profileName) => {
    const id = 'p_test_' + Date.now();
    const profile = { id, name: profileName, passwordHash: null, created: new Date().toISOString(), leaderboardOptIn: false };
    localStorage.setItem('cp_profiles', JSON.stringify([profile]));
    localStorage.setItem('cp_active', id);
    localStorage.setItem(`cp_p_${id}_done`, '[]');
    localStorage.setItem(`cp_p_${id}_xp`, '0');
    return id;
  }, name);
  await page.reload();
  // Skip landing — jump straight into app via evaluate
  await page.evaluate(() => {
    document.getElementById('landing').classList.remove('show');
    document.getElementById('app').classList.add('show');
    if (typeof loadActiveState === 'function') loadActiveState();
    if (typeof render === 'function') render();
  });
  await page.waitForSelector('#app.show');
}

test('page loads with title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/PyCoBase/);
});

test('landing page is shown on first visit', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.locator('#landing.show')).toBeVisible();
  await expect(page.locator('#app.show')).toHaveCount(0);
});

test('app view shows profile name after login', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await loginWithLocalProfile(page, 'SmokeTest');
  await expect(page.locator('#profile-name')).toHaveText('SmokeTest');
});

test('progress persists after reload', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await loginWithLocalProfile(page, 'Persist');
  const xpBefore = await page.locator('#xp-amount').textContent();
  // Navigate to next lesson
  await page.click('#btn-next');
  await page.reload();
  await page.evaluate(() => {
    document.getElementById('landing').classList.remove('show');
    document.getElementById('app').classList.add('show');
    if (typeof loadActiveState === 'function') loadActiveState();
    if (typeof render === 'function') render();
  });
  await page.waitForSelector('#app.show');
  await expect(page.locator('#profile-name')).toHaveText('Persist');
});

test('lucide icons are rendered', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await loginWithLocalProfile(page, 'IconTest');
  // Lucide renders SVGs with data-lucide attribute
  const svgCount = await page.locator('svg[data-lucide]').count();
  expect(svgCount).toBeGreaterThan(0);
});

test('all phases present in sidebar', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await loginWithLocalProfile(page, 'NavTest');
  const phases = await page.locator('.phase-btn').count();
  expect(phases).toBe(7);
});

test('profile menu opens on click', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await loginWithLocalProfile(page, 'MenuTest');
  await page.click('.profile-bar');
  await expect(page.locator('#profile-menu.show')).toBeVisible();
});

test('new profile modal opens from profile menu', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await loginWithLocalProfile(page, 'ModalTest');
  await page.click('.profile-bar');
  // Click "New profile" action (data-action="new")
  await page.locator('.profile-menu-item[data-action="new"]').click();
  await expect(page.locator('#modal-backdrop.show')).toBeVisible();
  await expect(page.locator('#new-profile-name')).toBeVisible();
});
