import { chromium } from 'playwright';

console.log('🔍 Testing live deployment at https://tmobile-optimizer.vercel.app');

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({
  viewport: { width: 375, height: 667 }, // iPhone SE size
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
});

const page = await context.newPage();

try {
  // Go to the production site
  await page.goto('https://tmobile-optimizer.vercel.app');
  await page.waitForLoadState('networkidle');
  
  // Take screenshot of initial page
  await page.screenshot({ path: 'screenshots/01-initial-page.png', fullPage: true });
  console.log('✅ Screenshot 1: Initial page loaded');
  
  // Check version number
  const versionText = await page.locator('.version-footer-compact').first().innerText().catch(() => 'Version not found');
  console.log(`📦 Version found: ${versionText}`);
  
  // Check if we start with customer type question
  const welcomeText = await page.locator('h2').first().innerText();
  const questionText = await page.locator('p').first().innerText();
  console.log(`🎯 First screen shows: "${welcomeText}" - "${questionText}"`);
  
  if (!questionText.includes('current T-Mobile customer')) {
    console.error('❌ ERROR: Not starting with customer type question!');
  } else {
    console.log('✅ Correctly starts with customer type question');
  }
  
  // Click "No, I'm New" 
  await page.locator('button:has-text("No, I\'m New")').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/02-after-customer-type.png', fullPage: true });
  console.log('✅ Screenshot 2: After selecting new customer');
  
  // Check we're on lines selection
  const linesText = await page.locator('h2').first().innerText();
  console.log(`📱 Next screen: "${linesText}"`);
  
  // Select 2 lines
  await page.locator('button:has-text("Couple")').click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshots/03-after-lines.png', fullPage: true });
  console.log('✅ Screenshot 3: After selecting 2 lines');
  
  // Check what screen comes next
  const nextScreenText = await page.locator('h2').first().innerText();
  console.log(`📱 Next screen: "${nextScreenText}"`);
  
  // Check for carrier buttons (not dropdown)
  const carrierButtons = await page.locator('button:has-text("AT&T")').count();
  if (carrierButtons > 0) {
    console.log('✅ Carrier selection uses buttons (not dropdown)');
    await page.screenshot({ path: 'screenshots/04-carrier-buttons.png', fullPage: true });
  } else {
    console.log('⚠️ Carrier selection may not be using buttons');
  }
  
  // Check for Next button in top-right
  const nextButton = await page.locator('button:has-text("Next")').first();
  if (await nextButton.isVisible()) {
    const box = await nextButton.boundingBox();
    if (box && box.x > 250) {
      console.log('✅ Next button found in top-right corner');
    }
  }
  
  // Check viewport width (no horizontal scroll)
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  if (bodyWidth <= 375) {
    console.log('✅ No horizontal scrolling on mobile');
  } else {
    console.log(`❌ Horizontal scrolling detected: ${bodyWidth}px width`);
  }
  
  console.log('\n📊 Deployment Test Summary:');
  console.log('- Version:', versionText);
  console.log('- Customer type question:', questionText.includes('current T-Mobile customer') ? '✅' : '❌');
  console.log('- Carrier buttons:', carrierButtons > 0 ? '✅' : '❌');
  console.log('- Mobile responsive:', bodyWidth <= 375 ? '✅' : '❌');
  
} catch (error) {
  console.error('❌ Test failed:', error.message);
  await page.screenshot({ path: 'screenshots/error-state.png', fullPage: true });
}

// Keep browser open for manual inspection
console.log('\n👀 Browser will stay open for 30 seconds for manual inspection...');
await page.waitForTimeout(30000);

await browser.close();
console.log('✅ Test complete!');