import { chromium } from 'playwright';

async function testButtonFlow() {
  console.log('🔍 Testing button flow on live site...\n');
  
  const browser = await chromium.launch({ 
    headless: false // Show browser
  });
  
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });
  
  const page = await context.newPage();
  
  // Enable console logging
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  
  console.log('📱 Opening T-Mobile Sales Edge...');
  await page.goto('https://tmobile-optimizer.vercel.app', {
    waitUntil: 'networkidle'
  });
  
  await page.waitForTimeout(2000);
  
  console.log('\n1️⃣ Clicking "No, I\'m New"...');
  await page.click('text=No, I\'m New');
  await page.waitForTimeout(500);
  
  console.log('2️⃣ Clicking "Standard Consumer"...');
  await page.click('text=Standard Consumer');
  await page.waitForTimeout(500);
  
  console.log('3️⃣ Looking for Continue button...');
  const continueButton = await page.locator('text=Continue').first();
  const isVisible = await continueButton.isVisible();
  console.log(`   Continue button visible: ${isVisible}`);
  
  if (isVisible) {
    console.log('4️⃣ Clicking Continue button...');
    await continueButton.click();
    await page.waitForTimeout(2000);
    
    // Check what screen we're on now
    const url = page.url();
    const content = await page.content();
    
    console.log(`\n📍 Current URL: ${url}`);
    
    if (content.includes('How many lines')) {
      console.log('✅ SUCCESS: Moved to lines selection screen!');
    } else if (content.includes('Welcome to T-Mobile')) {
      console.log('❌ FAILURE: Still on first screen!');
      console.log('   The continue button did NOT work!');
    } else {
      console.log('❓ Unknown screen - checking content...');
      const visibleText = await page.evaluate(() => document.body.innerText);
      console.log('   Screen shows:', visibleText.substring(0, 200));
    }
    
    await page.screenshot({ path: 'after-continue-click.png' });
    console.log('📸 Screenshot saved: after-continue-click.png');
  } else {
    console.log('❌ Continue button not visible!');
  }
  
  await page.waitForTimeout(5000);
  await browser.close();
  console.log('\n✅ Test complete!');
}

testButtonFlow().catch(console.error);