const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.error('PAGE ERROR:', error));

    console.log("Navigating to /owner/orders...");
    await page.goto('http://localhost:8080/owner/orders', { waitUntil: 'networkidle' });

    const content = await page.evaluate(() => document.querySelector('main')?.innerHTML || 'NO MAIN TAG');
    console.log("Main content length:", content.length);
    if (content.length < 500) {
        console.log("Small content:", content.trim().substring(0, 100));
    }

    await browser.close();
})();
