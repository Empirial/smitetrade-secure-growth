import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:8080';
const EMAIL = 'owner@test.smitetrade.co.za';
const PASSWORD = 'Test1234!';
const ROLE = 'owner';

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

async function loginAsOwner(page: import('@playwright/test').Page) {
  await page.goto(`${BASE_URL}/owner/login`);
  await page.fill('#email', EMAIL);
  await page.fill('#password', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/owner/dashboard', { timeout: 15000 });
}

test.describe('Owner Portal E2E Tests', () => {
  test('Login', async ({ page }) => {
    const scenario: ScenarioResult = { name: 'Login', status: 'fail', screenshot: null, error: null };
    try {
      await page.goto(`${BASE_URL}/owner/login`);
      await expect(page.locator('h2')).toContainText('Owner Portal');

      await page.fill('#email', EMAIL);
      await page.fill('#password', PASSWORD);

      const screenshotPath = 'test-results/owner-login-before-submit.png';
      await page.screenshot({ path: screenshotPath });
      scenario.screenshot = screenshotPath;

      await page.click('button[type="submit"]');
      await page.waitForURL('**/owner/dashboard', { timeout: 15000 });

      const screenshotAfter = 'test-results/owner-login-success.png';
      await page.screenshot({ path: screenshotAfter });
      scenario.screenshot = screenshotAfter;

      scenario.status = 'pass';
    } catch (err: unknown) {
      scenario.error = err instanceof Error ? err.message : String(err);
      const errPath = 'test-results/owner-login-error.png';
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
      await loginAsOwner(page);
      await page.goto(`${BASE_URL}/owner/dashboard`);
      await page.waitForLoadState('networkidle');

      const screenshotPath = 'test-results/owner-dashboard.png';
      await page.screenshot({ path: screenshotPath });
      scenario.screenshot = screenshotPath;

      await expect(page).toHaveURL(/\/owner\/dashboard/);
      scenario.status = 'pass';
    } catch (err: unknown) {
      scenario.error = err instanceof Error ? err.message : String(err);
      const errPath = 'test-results/owner-dashboard-error.png';
      await page.screenshot({ path: errPath }).catch(() => {});
      scenario.screenshot = errPath;
    } finally {
      results.push(scenario);
    }
    expect(scenario.status).toBe('pass');
  });

  test('Inventory Page', async ({ page }) => {
    const scenario: ScenarioResult = { name: 'Inventory Page', status: 'fail', screenshot: null, error: null };
    try {
      await loginAsOwner(page);
      await page.goto(`${BASE_URL}/owner/inventory`);
      await page.waitForLoadState('networkidle');

      const screenshotPath = 'test-results/owner-inventory.png';
      await page.screenshot({ path: screenshotPath });
      scenario.screenshot = screenshotPath;

      await expect(page).toHaveURL(/\/owner\/inventory/);
      scenario.status = 'pass';
    } catch (err: unknown) {
      scenario.error = err instanceof Error ? err.message : String(err);
      const errPath = 'test-results/owner-inventory-error.png';
      await page.screenshot({ path: errPath }).catch(() => {});
      scenario.screenshot = errPath;
    } finally {
      results.push(scenario);
    }
    expect(scenario.status).toBe('pass');
  });

  test('Staff Page', async ({ page }) => {
    const scenario: ScenarioResult = { name: 'Staff Page', status: 'fail', screenshot: null, error: null };
    try {
      await loginAsOwner(page);
      await page.goto(`${BASE_URL}/owner/staff`);
      await page.waitForLoadState('networkidle');

      const screenshotPath = 'test-results/owner-staff.png';
      await page.screenshot({ path: screenshotPath });
      scenario.screenshot = screenshotPath;

      await expect(page).toHaveURL(/\/owner\/staff/);
      scenario.status = 'pass';
    } catch (err: unknown) {
      scenario.error = err instanceof Error ? err.message : String(err);
      const errPath = 'test-results/owner-staff-error.png';
      await page.screenshot({ path: errPath }).catch(() => {});
      scenario.screenshot = errPath;
    } finally {
      results.push(scenario);
    }
    expect(scenario.status).toBe('pass');
  });

  test('Reports Page', async ({ page }) => {
    const scenario: ScenarioResult = { name: 'Reports Page', status: 'fail', screenshot: null, error: null };
    try {
      await loginAsOwner(page);
      await page.goto(`${BASE_URL}/owner/reports`);
      await page.waitForLoadState('networkidle');

      const screenshotPath = 'test-results/owner-reports.png';
      await page.screenshot({ path: screenshotPath });
      scenario.screenshot = screenshotPath;

      await expect(page).toHaveURL(/\/owner\/reports/);
      scenario.status = 'pass';
    } catch (err: unknown) {
      scenario.error = err instanceof Error ? err.message : String(err);
      const errPath = 'test-results/owner-reports-error.png';
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
