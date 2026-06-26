const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Go to outfits
  await page.goto('http://localhost:3000/outfits', { waitUntil: 'networkidle' });
  
  // Ensure Turkish
  const buttons = await page.locator('button').all();
  for (const btn of buttons) {
    const text = await btn.textContent();
    if (text === 'TR') {
      await btn.click();
      break;
    }
  }
  
  await page.waitForTimeout(1000);
  
  // Fill form with Turkish inputs
  const inputs = await page.locator('input').all();
  if (inputs.length >= 3) {
    await inputs[0].fill('Günlük');
    await inputs[1].fill('Normal');
    await inputs[2].fill('Klasik');
  }
  
  // Click suggest button (Kombin Öner)
  const buttons2 = await page.locator('button').all();
  for (const btn of buttons2) {
    const text = await btn.textContent();
    if (text && text.includes('Kombin Öner')) {
      await btn.click();
      break;
    }
  }
  
  // Wait for AI response
  await page.waitForTimeout(5000);
  
  await page.screenshot({ path: 'C:\\Users\\Ebubekir\\outfit-suggestion-tr.png' });
  
  console.log('Turkish outfit suggestion captured!');
  
  await browser.close();
})();
