const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/outfits', { waitUntil: 'networkidle' });
  
  // Fill in form and submit for Turkish
  await page.fill('input[placeholder*="İş"]', 'Günlük');
  await page.fill('input[placeholder*="Soğuk"]', 'Normal');
  await page.fill('input[placeholder*="Minimalist"]', 'Şık');
  
  // Click suggest button
  await page.click('button:has-text("Kombin Öner")');
  
  // Wait for result
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'C:\\Users\\Ebubekir\\screenshot-outfit-tr.png' });
  
  // Change to English
  await page.click('button:has-text("EN")');
  await page.waitForTimeout(500);
  
  // Clear form and refill for English test
  await page.reload({ waitUntil: 'networkidle' });
  await page.fill('input[placeholder*="Work"]', 'Casual');
  await page.fill('input[placeholder*="Cold"]', 'Normal');
  await page.fill('input[placeholder*="Minimalist"]', 'Chic');
  await page.click('button:has-text("Suggest Outfit")');
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'C:\\Users\\Ebubekir\\screenshot-outfit-en.png' });
  
  await browser.close();
  console.log('Test completed!');
})();
