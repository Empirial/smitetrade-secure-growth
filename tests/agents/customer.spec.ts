import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE_URL = 'http://localhost:8080';
const EMAIL = 'customer@test.smitetrade.co.za';
const PASSWORD = 'Test1234!';
const ROLE = 'customer';

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

test.describe('Customer Portal E2E Tests', () => {
  test('Login', async ({ page }) => {
    const scenario: ScenarioResult = { name: 'Login', status: 'fail', screenshot: null, error: null };
    try {
      await page.goto(`${BASE_URL}/customer/login`);
      await expect(page.locator('h2')).toContainText('Customer Portal');

      await page.fill('#email', EMAIL);
      await page.fill('#password', PASSWORD);

      const screenshotPath = 'test-results/customer-login-before-submit.png';
      await page.screenshot({ path: screenshotPath });
      scenario.screenshot = screenshotPath;

      await page.click('button[type="submit"]');
      await page.waitForURL('**/customer/products', { timeout: 15000 });

      const screenshotAfter = 'test-results/customer-login-success.png';
      await page.screenshot({ path: screenshotAfter });
      scenario.screenshot = screenshotAfter;

      scenario.status = 'pass';
    } catch (err: unknown) {
      scenario.error = err instanceof Error ? err.message : String(err);
      const errPath = 'test-results/customer-login-error.png';
      await page.screenshot({ path: errPath }).catch(() => {});
      scenario.screenshot = errPath;
    } finally {
      results.push(scenario);
    }
    expect(scenario.status).toBe('pass');
  });

  test('Products Page', async ({ page }) => {
    const scenario: ScenarioResult = { name: 'Products Page', status: 'fail', screenshot: null, error: null };
    try {
      await page.goto(`${BASE_URL}/customer/login`);
      await page.fill('#email', EMAIL);
      await page.fill('#password', PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForURL('**/customer/products', { timeout: 15000 });

      await page.goto(`${BASE_URL}/customer/products`);
      await page.waitForLoadState('networkidle');

      const screenshotPath = 'test-results/customer-products.png';
      await page.screenshot({ path: screenshotPath });
      scenario.screenshot = screenshotPath;

      await expect(page).toHaveURL(/\/customer\/products/);
      scenario.status = 'pass';
    } catch (err: unknown) {
      scenario.error = err instanceof Error ? err.message : String(err);
      const errPath = 'test-results/customer-products-error.png';
      await page.screenshot({ path: errPath }).catch(() => {});
      scenario.screenshot = errPath;
    } finally {
      results.push(scenario);
    }
    expect(scenario.status).toBe('pass');
  });

  test('Cart Page', async ({ page }) => {
    const scenario: ScenarioResult = { name: 'Cart Page', status: 'fail', screenshot: null, error: null };
    try {
      await page.goto(`${BASE_URL}/customer/login`);
      await page.fill('#email', EMAIL);
      await page.fill('#password', PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForURL('**/customer/products', { timeout: 15000 });

      await page.goto(`${BASE_URL}/customer/cart`);
      await page.waitForLoadState('networkidle');

      const screenshotPath = 'test-results/customer-cart.png';
      await page.screenshot({ path: screenshotPath });
      scenario.screenshot = screenshotPath;

      await expect(page).toHaveURL(/\/customer\/cart/);
      scenario.status = 'pass';
    } catch (err: unknown) {
      scenario.error = err instanceof Error ? err.message : String(err);
      const errPath = 'test-results/customer-cart-error.png';
      await page.screenshot({ path: errPath }).catch(() => {});
      scenario.screenshot = errPath;
    } finally {
      results.push(scenario);
    }
    expect(scenario.status).toBe('pass');
  });

  test('Profile Page', async ({ page }) => {
    const scenario: ScenarioResult = { name: 'Profile Page', status: 'fail', screenshot: null, error: null };
    try {
      await page.goto(`${BASE_URL}/customer/login`);
      await page.fill('#email', EMAIL);
      await page.fill('#password', PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForURL('**/customer/products', { timeout: 15000 });

      await page.goto(`${BASE_URL}/customer/profile`);
      await page.waitForLoadState('networkidle');

      const screenshotPath = 'test-results/customer-profile.png';
      await page.screenshot({ path: screenshotPath });
      scenario.screenshot = screenshotPath;

      await expect(page).toHaveURL(/\/customer\/profile/);
      scenario.status = 'pass';
    } catch (err: unknown) {
      scenario.error = err instanceof Error ? err.message : String(err);
      const errPath = 'test-results/customer-profile-error.png';
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
