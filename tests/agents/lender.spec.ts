import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:8080';
const EMAIL = 'lender@test.smitetrade.co.za';
const PASSWORD = 'Test1234!';
const ROLE = 'lender';

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

async function loginAsLender(page: import('@playwright/test').Page) {
  await page.goto(`${BASE_URL}/lender/login`);
  await page.fill('#email', EMAIL);
  await page.fill('#password', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/lender/dashboard', { timeout: 15000 });
}

test.describe('Lender Portal E2E Tests', () => {
  test('Login', async ({ page }) => {
    const scenario: ScenarioResult = { name: 'Login', status: 'fail', screenshot: null, error: null };
    try {
      await page.goto(`${BASE_URL}/lender/login`);
      await expect(page.locator('h2')).toContainText('Lender Portal');

      await page.fill('#email', EMAIL);
      await page.fill('#password', PASSWORD);

      const screenshotPath = 'test-results/lender-login-before-submit.png';
      await page.screenshot({ path: screenshotPath });
      scenario.screenshot = screenshotPath;

      await page.click('button[type="submit"]');
      await page.waitForURL('**/lender/dashboard', { timeout: 15000 });

      const screenshotAfter = 'test-results/lender-login-success.png';
      await page.screenshot({ path: screenshotAfter });
      scenario.screenshot = screenshotAfter;

      scenario.status = 'pass';
    } catch (err: unknown) {
      scenario.error = err instanceof Error ? err.message : String(err);
      const errPath = 'test-results/lender-login-error.png';
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
      await loginAsLender(page);
      await page.goto(`${BASE_URL}/lender/dashboard`);
      await page.waitForLoadState('networkidle');

      const screenshotPath = 'test-results/lender-dashboard.png';
      await page.screenshot({ path: screenshotPath });
      scenario.screenshot = screenshotPath;

      await expect(page).toHaveURL(/\/lender\/dashboard/);
      scenario.status = 'pass';
    } catch (err: unknown) {
      scenario.error = err instanceof Error ? err.message : String(err);
      const errPath = 'test-results/lender-dashboard-error.png';
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
