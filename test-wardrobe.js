const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Go to home
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Switch to Turkish if needed
  await page.click('button:has-text("TR")');
  await page.waitForTimeout(500);
  
  // Go to wardrobe and add some clothing
  await page.goto('http://localhost:3000/wardrobe', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Click add clothing button (should have Turkish text)
  const addButtons = await page.locator('text=/.*Kıyafet Ekle.*/', { exact: false }).all();
  if (addButtons.length > 0) {
    await addButtons[0].click();
  }
  
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'C:\\Users\\Ebubekir\\test-wardrobe-tr.png' });
  
  await browser.close();
  console.log('Wardrobe page screenshot saved!');
})();
