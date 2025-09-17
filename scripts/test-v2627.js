import { webkit } from 'playwright';

async function testV2627() {
  console.log('🔍 TESTING v2.6.27 FIXES\n');
  
  const browser = await webkit.launch({ 
    headless: false,
    slowMo: 800
  });
  
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    bypassCSP: true
  });
  
  const page = await context.newPage();
  
  try {
    // Force fresh load with cache buster
    await page.goto(`https://tmobile-optimizer.vercel.app?test=${Date.now()}`, {
      waitUntil: 'networkidle'
    });
    
    await page.waitForTimeout(3000);
    
    console.log('=== TEST 1: CONTINUE BUTTON ===');
    
    // Click "No, I'm New"
    await page.click('text=No, I\'m New');
    console.log('✅ Clicked "No, I\'m New"');
    await page.waitForTimeout(1000);
    
    // Click "Standard Consumer"
    await page.click('text=Standard Consumer');
    console.log('✅ Clicked "Standard Consumer"');
    await page.waitForTimeout(1000);
    
    // Click Continue
    const continueBtn = await page.locator('button:has-text("Continue")').first();
    await continueBtn.click();
    console.log('✅ Clicked Continue');
    await page.waitForTimeout(2000);
    
    // Check if we advanced
    const onLinesScreen = await page.locator('text=How many').isVisible();
    if (onLinesScreen) {
      console.log('✅ SUCCESS: Continue button works - Advanced to lines!\n');
    } else {
      console.log('❌ FAILURE: Continue button did NOT advance\n');
    }
    
    console.log('=== TEST 2: NEW BUTTON ===');
    
    // Try clicking New button
    const newBtn = await page.locator('button:has-text("New")').first();
    console.log('Attempting to click New button...');
    
    try {
      await newBtn.click({ timeout: 5000 });
      console.log('✅ New button clicked successfully!');
      
      await page.waitForTimeout(2000);
      
      // Check if we're back at start
      const backAtStart = await page.locator('text=No, I\'m New').isVisible();
      if (backAtStart) {
        console.log('✅ SUCCESS: New button works - Back at customer type!\n');
      } else {
        console.log('❌ New button clicked but didn\'t reset flow\n');
      }
    } catch (error) {
      console.log('❌ FAILURE: New button still blocked!');
      console.log('Error:', error.message, '\n');
    }
    
    console.log('=== FINAL RESULTS ===');
    const continueWorks = onLinesScreen;
    const newWorks = await page.locator('text=No, I\'m New').isVisible();
    
    if (continueWorks && newWorks) {
      console.log('🎉 ALL TESTS PASSED! Both buttons work!');
    } else {
      console.log('⚠️ PARTIAL SUCCESS:');
      console.log(`Continue button: ${continueWorks ? '✅ WORKS' : '❌ BROKEN'}`);
      console.log(`New button: ${newWorks ? '✅ WORKS' : '❌ BROKEN'}`);
    }
    
  } catch (error) {
    console.log('❌ TEST CRASHED!');
    console.log(error);
  } finally {
    await page.waitForTimeout(3000);
    await browser.close();
  }
}

testV2627().catch(console.error);