const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/outfits', { waitUntil: 'networkidle' });
  
  // Switch to Turkish
  const langButtons = await page.locator('button').all();
  for (const btn of langButtons) {
    const text = await btn.textContent();
    if (text && text.trim() === 'TR') {
      await btn.click();
      break;
    }
  }
  
  await page.waitForTimeout(800);
  
  // Fill form
  const inputs = await page.locator('input').all();
  if (inputs.length >= 3) {
    await inputs[0].fill('İş');
    await inputs[1].fill('Soğuk');
    await inputs[2].fill('Formal');
  }
  
  // Click suggest
  const allBtns = await page.locator('button').all();
  for (const btn of allBtns) {
    const text = await btn.textContent();
    if (text && text.includes('Kombin Öner')) {
      await btn.click();
      break;
    }
  }
  
  // Wait longer for AI
  console.log('Waiting for AI response...');
  await page.waitForTimeout(8000);
  
  // Check if outfit appeared
  const content = await page.content();
  if (content.includes('Monokromatik') || content.includes('Analogous') || content.includes('Uyumsuz')) {
    console.log('Outfit suggestion received!');
  }
  
  await page.screenshot({ path: 'C:\\Users\\Ebubekir\\outfit-result-tr.png' });
  
  // Now switch to English to test
  const langBtns2 = await page.locator('button').all();
  for (const btn of langBtns2) {
    const text = await btn.textContent();
    if (text && text.trim() === 'EN') {
      await btn.click();
      break;
    }
  }
  
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:\\Users\\Ebubekir\\outfit-result-en.png' });
  
  // Now switch to Azerbaijani
  const langBtns3 = await page.locator('button').all();
  for (const btn of langBtns3) {
    const text = await btn.textContent();
    if (text && text.trim() === 'AZ') {
      await btn.click();
      break;
    }
  }
  
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'C:\\Users\\Ebubekir\\outfit-result-az.png' });
  
  await browser.close();
  console.log('All screenshots saved!');
})();
