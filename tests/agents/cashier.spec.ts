import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:8080';
const EMAIL = 'cashier@test.smitetrade.co.za';
const PASSWORD = 'Test1234!';
const ROLE = 'cashier';

interface ScenarioResult {
  name: string;
  status: 'pass' | 'fail';
  screenshot: string | null;
  error: string | null;
}

const results: ScenarioResult[] = [];

async function saveReport() {
  const reportDir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }
  const reportPath = path.join(reportDir, `${ROLE}-report.json`);
  const report = { role: ROLE, scenarios: results };
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
}

async function loginAsCashier(page: import('@playwright/test').Page) {
  await page.goto(`${BASE_URL}/cashier/login`);
  await page.fill('#email', EMAIL);
  await page.fill('#password', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/cashier/dashboard', { timeout: 15000 });
}

test.describe('Cashier Portal E2E Tests', () => {
  test('Login', async ({ page }) => {
    const scenario: ScenarioResult = { name: 'Login', status: 'fail', screenshot: null, error: null };
    try {
      await page.goto(`${BASE_URL}/cashier/login`);
      await expect(page.locator('h2')).toContainText('Cashier Portal');

      await page.fill('#email', EMAIL);
      await page.fill('#password', PASSWORD);

      const screenshotPath = 'test-results/cashier-login-before-submit.png';
      await page.screenshot({ path: screenshotPath });
      scenario.screenshot = screenshotPath;

      await page.click('button[type="submit"]');
      await page.waitForURL('**/cashier/dashboard', { timeout: 15000 });

      const screenshotAfter = 'test-results/cashier-login-success.png';
      await page.screenshot({ path: screenshotAfter });
      scenario.screenshot = screenshotAfter;

      scenario.status = 'pass';
    } catch (err: unknown) {
      scenario.error = err instanceof Error ? err.message : String(err);
      const errPath = 'test-results/cashier-login-error.png';
      await page.screenshot({ path: errPath }).catch(() => {});
      scenario.screenshot = errPath;
    } finally {
      results.push(scenario);
    }
    expect(scenario.status).toBe('pass');
  });

  test('Dashboard Page', async ({ page }) => {
    const scenario: ScenarioResult = { name: 'Dashboard Page', status: 'fail', screenshot: null, error: null };
    try {
      await loginAsCashier(page);
      await page.goto(`${BASE_URL}/cashier/dashboard`);
      await page.waitForLoadState('networkidle');

      const screenshotPath = 'test-results/cashier-dashboard.png';
      await page.screenshot({ path: screenshotPath });
      scenario.screenshot = screenshotPath;

      await expect(page).toHaveURL(/\/cashier\/dashboard/);
      scenario.status = 'pass';
    } catch (err: unknown) {
      scenario.error = err instanceof Error ? err.message : String(err);
      const errPath = 'test-results/cashier-dashboard-error.png';
      await page.screenshot({ path: errPath }).catch(() => {});
      scenario.screenshot = errPath;
    } finally {
      results.push(scenario);
    }
    expect(scenario.status).toBe('pass');
  });

  test('POS Page', async ({ page }) => {
    const scenario: ScenarioResult = { name: 'POS Page', status: 'fail', screenshot: null, error: null };
    try {
      await loginAsCashier(page);
      await page.goto(`${BASE_URL}/cashier/pos`);
      await page.waitForLoadState('networkidle');

      const screenshotPath = 'test-results/cashier-pos.png';
      await page.screenshot({ path: screenshotPath });
      scenario.screenshot = screenshotPath;

      await expect(page).toHaveURL(/\/cashier\/pos/);
      scenario.status = 'pass';
    } catch (err: unknown) {
      scenario.error = err instanceof Error ? err.message : String(err);
      const errPath = 'test-results/cashier-pos-error.png';
      await page.screenshot({ path: errPath }).catch(() => {});
      scenario.screenshot = errPath;
    } finally {
      results.push(scenario);
    }
    expect(scenario.status).toBe('pass');
  });

  test.afterAll(async () => {
    await saveReport();
  });
});
