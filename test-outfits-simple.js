const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Turkish version
  await page.goto('http://localhost:3000/outfits', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:\\Users\\Ebubekir\\test-outfits-tr-default.png' });
  
  // Switch to English
  await page.click('button:has-text("EN")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:\\Users\\Ebubekir\\test-outfits-en.png' });
  
  // Switch to Azerbaijani
  await page.click('button:has-text("AZ")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:\\Users\\Ebubekir\\test-outfits-az.png' });
  
  await browser.close();
  console.log('Screenshots taken!');
})();
