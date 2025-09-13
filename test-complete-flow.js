// COMPREHENSIVE TEST - Verify EVERY step in the flow works
import { chromium, devices } from 'playwright';

const testCompleteFlow = async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🧪 COMPREHENSIVE FLOW TEST - CHECKING EVERY STEP');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 // Slow enough to see what's happening
  });
  
  const context = await browser.newContext({
    ...devices['iPhone 14 Pro'],
    viewport: { width: 393, height: 852 }
  });
  
  const page = await context.newPage();
  
  try {
    // Navigate to the app
    await page.goto('http://localhost:4173');
    console.log('\n✅ Page loaded');
    
    // Take initial screenshot
    await page.screenshot({ path: 'test-0-initial.png' });
    
    // Click New if needed
    const newButton = await page.$('button.new-button');
    if (newButton) {
      await newButton.click();
      console.log('✅ Clicked New button');
      await page.waitForTimeout(500);
    }
    
    // STEP 1: LINES
    console.log('\n📱 STEP 1: LINES');
    await page.screenshot({ path: 'test-1-lines.png' });
    
    // Look for "3 Lines" button
    const threeLineButton = await page.$('button:has-text("3 Lines")');
    if (threeLineButton) {
      await threeLineButton.click();
      console.log('✅ Selected 3 lines');
    } else {
      // Try the number button
      const button3 = await page.$('button:has-text("3"):not(:has-text("Lines"))');
      if (button3) {
        await button3.click();
        console.log('✅ Selected 3 lines (number button)');
      } else {
        console.log('❌ Could not find 3 lines button!');
        await page.screenshot({ path: 'test-error-lines.png' });
      }
    }
    
    await page.waitForTimeout(1000);
    
    // STEP 2: NEW PHONES
    console.log('\n📱 STEP 2: NEW PHONES');
    await page.screenshot({ path: 'test-2-newphones.png' });
    
    // Check if we're asked about new phones
    const pageContent2 = await page.content();
    if (pageContent2.includes('new phone') || pageContent2.includes('Which phone')) {
      console.log('✅ New phones step appeared');
      
      // Select phones
      const selects = await page.$$('select');
      console.log(`   Found ${selects.length} select elements`);
      
      if (selects.length >= 6) {
        // Phone 1: Pro Max 512GB
        await selects[0].selectOption({ index: 1 }); // First phone model
        await page.waitForTimeout(200);
        await selects[1].selectOption('512GB');
        console.log('   ✅ Selected Phone 1: Pro Max 512GB');
        
        // Phone 2: Pro 256GB
        await selects[2].selectOption({ index: 2 }); // Second phone model
        await page.waitForTimeout(200);
        await selects[3].selectOption('256GB');
        console.log('   ✅ Selected Phone 2: Pro 256GB');
        
        // Phone 3: Pro 256GB
        await selects[4].selectOption({ index: 2 }); // Second phone model
        await page.waitForTimeout(200);
        await selects[5].selectOption('256GB');
        console.log('   ✅ Selected Phone 3: Pro 256GB');
      }
      
      // Click Continue
      const continueBtn = await page.$('button:has-text("Continue")');
      if (continueBtn) {
        await continueBtn.click();
        console.log('   ✅ Clicked Continue');
      }
    } else {
      console.log('❌ New phones step missing!');
    }
    
    await page.waitForTimeout(1000);
    
    // STEP 3: INSURANCE
    console.log('\n🛡️ STEP 3: INSURANCE');
    await page.screenshot({ path: 'test-3-insurance.png' });
    
    const pageContent3 = await page.content();
    if (pageContent3.includes('Protection 360') || pageContent3.includes('insurance')) {
      console.log('✅ Insurance step appeared!');
      
      // Find and check all insurance checkboxes
      const checkboxes = await page.$$('input[type="checkbox"]');
      console.log(`   Found ${checkboxes.length} checkboxes`);
      
      for (let i = 0; i < checkboxes.length && i < 3; i++) {
        await checkboxes[i].check();
        console.log(`   ✅ Checked insurance for Line ${i + 1}`);
      }
      
      // Click Continue
      const continueBtn = await page.$('button:has-text("Continue")');
      if (continueBtn) {
        await continueBtn.click();
        console.log('   ✅ Clicked Continue');
      }
    } else {
      console.log('❌ INSURANCE STEP MISSING! This is the problem!');
      console.log('   Page content does not include "Protection 360" or "insurance"');
    }
    
    await page.waitForTimeout(1000);
    
    // STEP 4: CURRENT PHONES (Trade-ins)
    console.log('\n📱 STEP 4: CURRENT PHONES (Trade-ins)');
    await page.screenshot({ path: 'test-4-tradeins.png' });
    
    // Skip trade-ins
    const skipTradeIn = await page.$('button:has-text("No trade")');
    if (skipTradeIn) {
      await skipTradeIn.click();
      console.log('✅ Skipped trade-ins');
    } else {
      const continueBtn = await page.$('button:has-text("Continue")');
      if (continueBtn) {
        await continueBtn.click();
        console.log('✅ Continued past trade-ins');
      }
    }
    
    await page.waitForTimeout(1000);
    
    // STEP 5: PLAN
    console.log('\n📋 STEP 5: PLAN SELECTION');
    await page.screenshot({ path: 'test-5-plan.png' });
    
    const pageContent5 = await page.content();
    if (pageContent5.includes('Experience') || pageContent5.includes('plan')) {
      console.log('✅ Plan selection step appeared');
      
      // Select Experience Beyond if available
      const beyondBtn = await page.$('button:has-text("Experience Beyond")');
      if (beyondBtn) {
        await beyondBtn.click();
        console.log('   ✅ Selected Experience Beyond');
      }
    }
    
    await page.waitForTimeout(1000);
    
    // STEP 6: ACCESSORY LINES
    console.log('\n⌚ STEP 6: ACCESSORY LINES');
    await page.screenshot({ path: 'test-6-accessories.png' });
    
    const pageContent6 = await page.content();
    if (pageContent6.includes('connected devices') || pageContent6.includes('Watch') || pageContent6.includes('iPad')) {
      console.log('✅ Accessory lines step appeared!');
      
      // Select Watch
      const watchBtn = await page.$('button:has-text("Watch")');
      if (watchBtn) {
        await watchBtn.click();
        console.log('   ✅ Selected Watch line');
      }
      
      // Select Tablet
      const tabletBtn = await page.$('button:has-text("iPad"), button:has-text("Tablet")');
      if (tabletBtn) {
        await tabletBtn.click();
        console.log('   ✅ Selected Tablet line');
      }
      
      // Continue
      const continueBtn = await page.$('button:has-text("Continue")');
      if (continueBtn) {
        await continueBtn.click();
        console.log('   ✅ Clicked Continue');
      }
    } else {
      console.log('❌ ACCESSORY LINES STEP MISSING!');
    }
    
    await page.waitForTimeout(1000);
    
    // STEP 7: ACCESSORY DEVICES (New or BYOD)
    console.log('\n📱 STEP 7: ACCESSORY DEVICES');
    await page.screenshot({ path: 'test-7-accessory-devices.png' });
    
    const pageContent7 = await page.content();
    if (pageContent7.includes('Bring My Own') || pageContent7.includes('Buy New')) {
      console.log('✅ Accessory devices step appeared!');
      
      // Select BYOD for both
      const byodButtons = await page.$$('button:has-text("Bring My Own")');
      console.log(`   Found ${byodButtons.length} BYOD buttons`);
      
      for (const btn of byodButtons) {
        await btn.click();
        console.log('   ✅ Selected BYOD');
        await page.waitForTimeout(200);
      }
      
      // Continue
      const continueBtn = await page.$('button:has-text("Continue")');
      if (continueBtn) {
        await continueBtn.click();
        console.log('   ✅ Clicked Continue');
      }
    } else {
      console.log('❌ ACCESSORY DEVICES STEP MISSING!');
    }
    
    await page.waitForTimeout(1000);
    
    // FINAL: RESULTS
    console.log('\n💰 FINAL: RESULTS');
    await page.screenshot({ path: 'test-8-results.png', fullPage: true });
    
    const pageContent8 = await page.content();
    if (pageContent8.includes('month') || pageContent8.includes('total')) {
      console.log('✅ Results displayed');
      
      // Look for pricing
      const monthlyElements = await page.$$eval('*', elements => {
        return elements
          .filter(el => el.textContent.includes('/mo') || el.textContent.includes('month'))
          .map(el => el.textContent.trim())
          .slice(0, 5);
      });
      
      console.log('\n📊 Found pricing elements:', monthlyElements);
    }
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    await page.screenshot({ path: 'test-error-final.png', fullPage: true });
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📸 Screenshots saved: test-0 through test-8');
  console.log('CHECK THESE TO SEE WHAT STEPS ARE MISSING!');
  console.log('='.repeat(60));
  
  await browser.close();
};

// Run the test
testCompleteFlow();