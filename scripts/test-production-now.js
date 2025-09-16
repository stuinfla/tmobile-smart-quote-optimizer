import { webkit } from 'playwright';

async function testProductionNow() {
  console.log('🔍 TESTING LIVE PRODUCTION v2.6.25 RIGHT NOW\n');
  
  const browser = await webkit.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });
  
  const page = await context.newPage();
  
  page.on('console', msg => console.log('📱 CONSOLE:', msg.text()));
  page.on('pageerror', error => console.log('❌ ERROR:', error.message));
  
  try {
    console.log('Loading https://tmobile-optimizer.vercel.app...');
    await page.goto('https://tmobile-optimizer.vercel.app', {
      waitUntil: 'networkidle'
    });
    
    await page.waitForTimeout(2000);
    
    // Check version
    const versionText = await page.textContent('body');
    if (versionText.includes('2.6.25')) {
      console.log('✅ Version 2.6.25 confirmed\n');
    } else {
      console.log('⚠️ Different version detected\n');
    }
    
    // TEST 1: Click "No, I'm New"
    console.log('TEST 1: Customer Type Selection');
    console.log('Clicking "No, I\'m New"...');
    
    const newCustomerBtn = await page.locator('text=No, I\'m New');
    if (await newCustomerBtn.isVisible()) {
      await newCustomerBtn.click();
      console.log('✅ Clicked "No, I\'m New"');
    } else {
      console.log('❌ "No, I\'m New" button not visible!');
    }
    
    await page.waitForTimeout(1000);
    
    // Check if Standard Consumer appears
    console.log('\nLooking for "Standard Consumer"...');
    const standardConsumerBtn = await page.locator('text=Standard Consumer');
    if (await standardConsumerBtn.isVisible()) {
      console.log('✅ "Standard Consumer" is visible');
      await standardConsumerBtn.click();
      console.log('✅ Clicked "Standard Consumer"');
    } else {
      console.log('❌ "Standard Consumer" not visible!');
    }
    
    await page.waitForTimeout(2000);
    
    // CHECK: Does Continue button exist?
    console.log('\n🔍 CRITICAL CHECK: Looking for Continue button...');
    const continueButtons = await page.locator('button:has-text("Continue")').all();
    console.log(`Found ${continueButtons.length} Continue button(s)`);
    
    if (continueButtons.length > 0) {
      const firstContinue = continueButtons[0];
      const isVisible = await firstContinue.isVisible();
      const isEnabled = await firstContinue.isEnabled();
      
      console.log(`Continue button visible: ${isVisible}`);
      console.log(`Continue button enabled: ${isEnabled}`);
      
      if (isVisible && isEnabled) {
        console.log('Attempting to click Continue...');
        await firstContinue.click();
        await page.waitForTimeout(2000);
        
        // Check if we advanced
        const stillOnCustomerType = await page.locator('text=No, I\'m New').isVisible();
        const onLinesScreen = await page.locator('text=How many').isVisible();
        
        if (stillOnCustomerType) {
          console.log('❌ CRITICAL BUG: Still on customer type screen - Continue didn\'t work!');
        } else if (onLinesScreen) {
          console.log('✅ SUCCESS: Advanced to lines screen!');
        } else {
          console.log('🤔 On unknown screen');
        }
      }
    } else {
      console.log('❌ CRITICAL: NO CONTINUE BUTTON FOUND AT ALL!');
    }
    
    // TEST 2: New button
    console.log('\n\nTEST 2: Testing New button...');
    const newBtn = await page.locator('text=New').first();
    if (await newBtn.isVisible()) {
      console.log('✅ New button is visible');
      console.log('Clicking New button...');
      await newBtn.click();
      await page.waitForTimeout(2000);
      
      // Check if we're back at the start
      const backAtStart = await page.locator('text=No, I\'m New').isVisible();
      if (backAtStart) {
        console.log('✅ New button worked - back at customer type');
      } else {
        console.log('❌ New button FAILED - not back at start');
      }
    } else {
      console.log('❌ New button not visible!');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'production-broken.png' });
    console.log('\n📸 Screenshot saved: production-broken.png');
    
    // Get current page state
    console.log('\n📄 Current page content preview:');
    const bodyText = await page.textContent('body');
    console.log(bodyText.substring(0, 300) + '...');
    
  } catch (error) {
    console.log('\n❌ TEST CRASHED!');
    console.log(error);
    await page.screenshot({ path: 'crash-screenshot.png' });
  } finally {
    await page.waitForTimeout(3000);
    await browser.close();
  }
}

testProductionNow().catch(console.error);