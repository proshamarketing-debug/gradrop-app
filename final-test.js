const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Screenshot 1: Turkish
  await page.click('button:has-text("TR")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:\\Users\\Ebubekir\\final-home-tr.png' });
  
  // Screenshot 2: English
  await page.click('button:has-text("EN")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:\\Users\\Ebubekir\\final-home-en.png' });
  
  // Screenshot 3: Azerbaijani
  await page.click('button:has-text("AZ")');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:\\Users\\Ebubekir\\final-home-az.png' });
  
  await browser.close();
  console.log('Final screenshots done!');
})();
