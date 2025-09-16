import { webkit } from 'playwright';

async function testContinueButton() {
  console.log('🔍 Testing Continue Button Functionality...\n');
  
  const browser = await webkit.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });
  
  const page = await context.newPage();
  
  // Enable console logging
  page.on('console', msg => console.log('PAGE:', msg.text()));
  page.on('pageerror', error => console.log('ERROR:', error.message));
  
  console.log('📱 Opening T-Mobile Sales Edge...');
  await page.goto('http://localhost:5175', {
    waitUntil: 'networkidle'
  });
  
  await page.waitForTimeout(2000);
  
  // Navigate through each screen testing Continue button
  console.log('\n=== TESTING CONTINUE BUTTONS ===');
  
  // Screen 1: Customer Type
  console.log('1. Customer Type Screen');
  await page.click('text=No, I\'m New');
  await page.waitForTimeout(300);
  await page.click('text=Standard Consumer');
  await page.waitForTimeout(500);
  
  // Check if Continue works
  const continueBtn1 = await page.locator('button:has-text("Continue")').first();
  if (await continueBtn1.isVisible()) {
    console.log('   Continue button visible, clicking...');
    await continueBtn1.click();
    await page.waitForTimeout(1500);
    
    const onLinesScreen = await page.locator('text=How many').isVisible();
    console.log(`   ✅ Screen 1 Continue: ${onLinesScreen ? 'WORKS' : 'FAILED'}`);
    
    if (onLinesScreen) {
      // Screen 2: Lines
      console.log('2. Lines Screen');
      await page.click('button:has-text("3")');
      await page.waitForTimeout(2000); // Auto-advance
      
      const onCarrierScreen = await page.locator('text=carrier').isVisible();
      console.log(`   ✅ Screen 2 Auto-advance: ${onCarrierScreen ? 'WORKS' : 'FAILED'}`);
      
      if (onCarrierScreen) {
        // Screen 3: Carrier
        console.log('3. Carrier Screen');
        await page.click('text=Verizon');
        await page.waitForTimeout(2000); // Auto-advance
        
        const onNextScreen = await page.locator('text=Trade-in').isVisible() || 
                            await page.locator('text=Select New').isVisible();
        console.log(`   ✅ Screen 3 Auto-advance: ${onNextScreen ? 'WORKS' : 'FAILED'}`);
        
        if (onNextScreen) {
          // Check what screen we're on
          const onTradeIn = await page.locator('text=Trade-in').isVisible();
          const onPhoneSelect = await page.locator('text=Select New').isVisible();
          
          if (onTradeIn) {
            console.log('4. Trade-in Screen');
            // Skip trade-in if needed
            const continueBtn4 = await page.locator('button:has-text("Continue")').first();
            if (await continueBtn4.isVisible() && await continueBtn4.isEnabled()) {
              await continueBtn4.click();
              await page.waitForTimeout(1500);
            }
          }
          
          // Check for phone selection screen
          const finalCheck = await page.locator('text=Select New').isVisible();
          if (finalCheck) {
            console.log('5. Phone Selection Screen');
            
            // Check if Continue button is enabled
            const continueBtn5 = await page.locator('button:has-text("Continue")').first();
            const isEnabled = await continueBtn5.isEnabled();
            console.log(`   Continue button enabled: ${isEnabled}`);
            
            if (isEnabled) {
              console.log('   Clicking Continue...');
              await continueBtn5.click();
              await page.waitForTimeout(1500);
              
              const advanced = await page.url() !== 'http://localhost:5175';
              console.log(`   ✅ Screen 5 Continue: ${advanced ? 'WORKS' : 'FAILED'}`);
            } else {
              console.log('   ❌ Continue button disabled - checking why...');
              
              // Check if all devices have newPhone and storage
              const deviceStatus = await page.evaluate(() => {
                // Check localStorage or global state if available
                return 'Device status check needed';
              });
              console.log(`   Device status: ${deviceStatus}`);
            }
          }
        }
      }
    }
  } else {
    console.log('   ❌ Continue button not found on customer type screen');
  }
  
  await page.screenshot({ path: 'continue-button-test.png' });
  console.log('\n📸 Screenshot saved: continue-button-test.png');
  
  await page.waitForTimeout(2000);
  await browser.close();
  console.log('✅ Test complete!');
}

testContinueButton().catch(console.error);