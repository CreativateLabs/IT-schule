import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 15000,
  use: {
    headless: true,
    baseURL: 'http://localhost:8090',
  },
});
