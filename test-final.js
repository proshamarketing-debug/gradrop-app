const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/outfits', { waitUntil: 'networkidle' });
  
  // Click TR
  const btns = await page.locator('button').all();
  for (const btn of btns) {
    const text = await btn.textContent();
    if (text && text.trim() === 'TR') {
      await btn.click();
      break;
    }
  }
  
  await page.waitForTimeout(500);
  
  // Fill form
  const inputs = await page.locator('input').all();
  if (inputs.length >= 3) {
    await inputs[0].fill('Dış');
    await inputs[1].fill('Soğuk');
    await inputs[2].fill('Akıllı Günlük');
  }
  
  // Click button
  const allBtns = await page.locator('button').all();
  for (const btn of allBtns) {
    const text = await btn.textContent();
    if (text && text.includes('Kombin Öner')) {
      await btn.click();
      break;
    }
  }
  
  // Wait for AI
  console.log('Waiting for AI...');
  await page.waitForTimeout(12000);
  
  const pageContent = await page.content();
  const hasResult = pageContent.includes('Monokromatik') || pageContent.includes('Analogous') || pageContent.includes('Tamamlayıcı');
  
  if (hasResult) {
    console.log('✅ Outfit suggestion received!');
  } else {
    console.log('⚠️ No outfit suggestion yet');
  }
  
  await page.screenshot({ path: 'C:\\Users\\Ebubekir\\final-test-tr.png' });
  
  await browser.close();
})();
