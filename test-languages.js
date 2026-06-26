const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Go to page
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Click EN button to change to English
  await page.click('button:has-text("EN")');
  await page.waitForTimeout(500);
  
  // Take screenshot with English
  await page.screenshot({ path: 'C:\\Users\\Ebubekir\\screenshot-en.png' });
  
  // Click TR button to change to Turkish
  await page.click('button:has-text("TR")');
  await page.waitForTimeout(500);
  
  // Take screenshot with Turkish
  await page.screenshot({ path: 'C:\\Users\\Ebubekir\\screenshot-tr.png' });
  
  // Click AZ button to change to Azerbaijani
  await page.click('button:has-text("AZ")');
  await page.waitForTimeout(500);
  
  // Take screenshot with Azerbaijani
  await page.screenshot({ path: 'C:\\Users\\Ebubekir\\screenshot-az.png' });
  
  await browser.close();
  console.log('Screenshots saved!');
})();
