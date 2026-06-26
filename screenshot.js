const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'C:\\Users\\Ebubekir\\screenshot.png' });
  await browser.close();
  console.log('Screenshot saved!');
})();
