import { webkit } from 'playwright';

async function testCompleteFlow() {
  console.log('🎯 TESTING COMPLETE END-TO-END FLOW v2.6.27\n');
  
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
  
  try {
    await page.goto(`https://tmobile-optimizer.vercel.app?v=${Date.now()}`, {
      waitUntil: 'networkidle'
    });
    
    console.log('STEP 1: Customer Type');
    await page.click('text=No, I\'m New');
    await page.click('text=Standard Consumer');
    await page.click('button:has-text("Continue")');
    console.log('✅ Advanced to Lines\n');
    
    console.log('STEP 2: Lines Selection');
    await page.click('button:has-text("3")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Continue")');
    console.log('✅ Advanced to Carrier\n');
    
    console.log('STEP 3: Carrier');
    await page.click('text=Verizon');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Continue")');
    console.log('✅ Advanced to Trade-in\n');
    
    console.log('STEP 4: Trade-in');
    // Should be Keep & Switch for Verizon - button includes emoji
    const keepSwitchBtn = await page.locator('button:has-text("Keep & Switch")').first();
    await keepSwitchBtn.click();
    await page.waitForTimeout(500);
    await page.click('button:has-text("Continue")');
    console.log('✅ Advanced to Phones\n');
    
    console.log('STEP 5: Phone Selection');
    await page.click('button:has-text("All iPhone 17 Pro")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Continue")');
    console.log('✅ Advanced to Plan\n');
    
    console.log('STEP 6: Plan Selection');
    await page.click('text=Experience Beyond');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Continue")');
    console.log('✅ Advanced to Accessories\n');
    
    console.log('STEP 7: Accessories');
    const skipBtn = await page.locator('button:has-text("Skip")').first();
    if (await skipBtn.isVisible()) {
      await skipBtn.click();
    } else {
      await page.click('button:has-text("Continue")');
    }
    console.log('✅ Advanced to Protection\n');
    
    console.log('STEP 8: Protection 360');
    await page.click('button:has-text("Skip Insurance")');
    await page.waitForTimeout(1000);
    console.log('✅ Should advance to Summary/Results\n');
    
    // Check if we reached the proposal/results
    await page.waitForTimeout(2000);
    
    const hasResults = 
      await page.locator('text=Monthly Total').isVisible() ||
      await page.locator('text=Your T-Mobile').isVisible() ||
      await page.locator('text=Deal Summary').isVisible() ||
      await page.locator('text=Quote').isVisible() ||
      await page.locator('text=Scenario').isVisible();
    
    if (hasResults) {
      console.log('🎉 SUCCESS: REACHED PROPOSAL/RESULTS!\n');
      
      // Check for pricing
      const pageText = await page.textContent('body');
      const priceMatch = pageText.match(/\$\d+(\.\d{2})?/g);
      if (priceMatch) {
        console.log('💰 Found pricing:', priceMatch.slice(0, 5).join(', '));
      }
      
      // Test New button from results
      console.log('\nTesting NEW BUTTON from results...');
      await page.click('button:has-text("New")');
      await page.waitForTimeout(2000);
      
      const backAtStart = await page.locator('text=No, I\'m New').isVisible();
      if (backAtStart) {
        console.log('✅ NEW BUTTON WORKS - Reset to beginning!\n');
      } else {
        console.log('❌ NEW BUTTON FAILED to reset\n');
      }
      
    } else {
      console.log('❌ FAILED: Did not reach proposal/results');
      const currentContent = await page.textContent('body');
      console.log('Stuck on:', currentContent.substring(0, 200));
    }
    
    // Check gear icon position
    console.log('Checking GEAR ICON...');
    const gearIcon = await page.locator('.admin-fab').first();
    if (await gearIcon.isVisible()) {
      const box = await gearIcon.boundingBox();
      console.log(`⚙️ Gear icon position: bottom=${852 - (box.y + box.height)}px from bottom`);
      if (852 - (box.y + box.height) > 200) {
        console.log('✅ Gear icon properly positioned above footer');
      } else {
        console.log('⚠️ Gear icon might be too low');
      }
    }
    
  } catch (error) {
    console.log('❌ TEST FAILED:', error.message);
    await page.screenshot({ path: 'failed-test.png' });
  } finally {
    await page.waitForTimeout(3000);
    await browser.close();
  }
}

testCompleteFlow().catch(console.error);