const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Switch to Azerbaijani
  const btns = await page.locator('button').all();
  for (const btn of btns) {
    const text = await btn.textContent();
    if (text && text.trim() === 'AZ') {
      await btn.click();
      break;
    }
  }
  
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:\\Users\\Ebubekir\\az-test-fixed.png' });
  
  // Go to Outfits page
  await page.goto('http://localhost:3000/outfits', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:\\Users\\Ebubekir\\az-outfits-fixed.png' });
  
  await browser.close();
  console.log('Done!');
})();
