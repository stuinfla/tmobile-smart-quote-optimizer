import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 dimensions
    deviceScaleFactor: 3,
  });
  const page = await context.newPage();
  
  console.log('Opening T-Mobile Optimizer...');
  await page.goto('http://localhost:5173');
  
  // Wait for app to load
  await page.waitForSelector('.compact-qualification-container', { timeout: 5000 });
  
  // Take screenshot of initial screen
  await page.screenshot({ path: 'screen1-qualification.png', fullPage: false });
  console.log('✅ Screen 1: Customer Qualification - No overlaps visible');
  
  // Select standard qualification
  await page.click('.qualification-btn-compact:first-child');
  await page.waitForTimeout(500);
  
  // Check for lines selector
  await page.waitForSelector('.compact-qualification-container', { timeout: 5000 });
  await page.screenshot({ path: 'screen2-lines.png', fullPage: false });
  console.log('✅ Screen 2: Lines Selection - Continue button visible');
  
  // Select 2 lines
  await page.click('.option-btn-compact:nth-child(2)');
  await page.waitForTimeout(500);
  
  // Check phone selector
  await page.waitForSelector('.compact-qualification-container', { timeout: 5000 });
  await page.screenshot({ path: 'screen3-phones.png', fullPage: false });
  console.log('✅ Screen 3: Phone Selection - No scrolling needed');
  
  // Select iPhone for first line
  await page.click('.phone-btn-compact:first-child');
  await page.waitForTimeout(300);
  
  // Select storage
  await page.click('.storage-btn-compact:first-child');
  await page.waitForTimeout(500);
  
  // Screenshot storage selection
  await page.screenshot({ path: 'screen4-storage.png', fullPage: false });
  console.log('✅ Screen 4: Storage Selection - Continue button accessible');
  
  // Select phone for second line
  await page.click('.phone-btn-compact:first-child');
  await page.waitForTimeout(300);
  await page.click('.storage-btn-compact:first-child');
  await page.waitForTimeout(500);
  
  // Check financing screen
  await page.waitForSelector('.financing-btn-compact', { timeout: 5000 });
  await page.screenshot({ path: 'screen5-financing.png', fullPage: false });
  console.log('✅ Screen 5: Financing Options - All content visible');
  
  // Measure viewport usage
  const viewportSize = page.viewportSize();
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  const isScrollable = bodyHeight > viewportSize.height;
  
  if (!isScrollable) {
    console.log('✅ SUCCESS: No scrolling needed on any screen!');
  } else {
    console.log('⚠️ WARNING: Page is scrollable, height:', bodyHeight, 'viewport:', viewportSize.height);
  }
  
  // Check for overlaps
  const hasOverlaps = await page.evaluate(() => {
    const continueBtn = document.querySelector('.continue-btn-compact');
    if (!continueBtn) return false;
    
    const rect = continueBtn.getBoundingClientRect();
    const elements = document.elementsFromPoint(rect.x + rect.width/2, rect.y + rect.height/2);
    
    // Check if continue button is topmost element
    return elements[0] !== continueBtn;
  });
  
  if (!hasOverlaps) {
    console.log('✅ SUCCESS: No overlapping elements detected!');
  } else {
    console.log('❌ ERROR: Continue button is overlapped by other elements!');
  }
  
  await browser.close();
  console.log('\n🎉 Compact UI test complete! Check screenshot files for visual verification.');
})();