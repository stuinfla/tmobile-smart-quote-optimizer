// MANUAL VERIFICATION TEST - Check EVERY step works
import { chromium, devices } from 'playwright';

const testEveryStep = async () => {
  console.log('\n' + '='.repeat(80));
  console.log('🔍 MANUAL VERIFICATION TEST - CHECKING EVERY SINGLE STEP');
  console.log('='.repeat(80));
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 1000 // Slow enough to see everything
  });
  
  const context = await browser.newContext({
    ...devices['iPhone 14 Pro'],
    viewport: { width: 393, height: 852 }
  });
  
  const page = await context.newPage();
  
  const checkStep = async (stepNum, stepName) => {
    console.log(`\n📸 Step ${stepNum}: ${stepName}`);
    await page.screenshot({ path: `verify-step-${stepNum}-${stepName.toLowerCase().replace(/\s+/g, '-')}.png` });
    const content = await page.content();
    
    // Check for common issues
    const hasContent = content.length > 1000;
    const hasButtons = await page.$$('button');
    const hasInputs = await page.$$('input, select');
    
    console.log(`   Content size: ${content.length} chars`);
    console.log(`   Buttons found: ${hasButtons.length}`);
    console.log(`   Input elements: ${hasInputs.length}`);
    
    // Check for specific content
    if (content.includes('insurance') || content.includes('Protection')) {
      console.log(`   ✅ Insurance content found`);
    }
    if (content.includes('Watch') || content.includes('iPad') || content.includes('Tablet')) {
      console.log(`   ✅ Accessory content found`);
    }
    if (content.includes('Experience') || content.includes('plan')) {
      console.log(`   ✅ Plan content found`);
    }
    
    return { hasContent, buttons: hasButtons.length, inputs: hasInputs.length };
  };
  
  try {
    // Navigate to the app
    await page.goto('http://localhost:4173');
    await checkStep(0, 'Initial Load');
    
    // Click New if needed
    const newButton = await page.$('button:has-text("New")');
    if (newButton) {
      await newButton.click();
      console.log('✅ Clicked New button');
      await page.waitForTimeout(1000);
    }
    
    // STEP 1: LINES
    await checkStep(1, 'Lines Selection');
    
    // Try to select 3 lines
    let selected = false;
    
    // Try method 1: Direct button with "3 Lines"
    const threeLineBtn = await page.$('button:has-text("3 Lines")');
    if (threeLineBtn) {
      await threeLineBtn.click();
      console.log('   ✅ Selected via "3 Lines" button');
      selected = true;
    }
    
    // Try method 2: Number button
    if (!selected) {
      const buttons = await page.$$('button');
      for (const btn of buttons) {
        const text = await btn.textContent();
        if (text && text.includes('3') && !text.includes('Lines')) {
          await btn.click();
          console.log('   ✅ Selected via number button');
          selected = true;
          break;
        }
      }
    }
    
    if (!selected) {
      console.log('   ❌ Could not select 3 lines!');
    }
    
    await page.waitForTimeout(1500);
    
    // STEP 2: NEW PHONES
    await checkStep(2, 'New Phones');
    
    // Check if phone selectors are present
    const phoneSelects = await page.$$('select');
    if (phoneSelects.length > 0) {
      console.log(`   ✅ Found ${phoneSelects.length} phone selectors`);
      
      // Try to select phones
      if (phoneSelects.length >= 6) {
        // Select first phone
        await phoneSelects[0].selectOption({ index: 1 });
        await page.waitForTimeout(300);
        await phoneSelects[1].selectOption({ index: 1 }); // storage
        console.log('   ✅ Selected Phone 1');
        
        // Select second phone
        await phoneSelects[2].selectOption({ index: 1 });
        await page.waitForTimeout(300);
        await phoneSelects[3].selectOption({ index: 0 }); // storage
        console.log('   ✅ Selected Phone 2');
        
        // Select third phone
        await phoneSelects[4].selectOption({ index: 1 });
        await page.waitForTimeout(300);
        await phoneSelects[5].selectOption({ index: 0 }); // storage
        console.log('   ✅ Selected Phone 3');
      }
    } else {
      console.log('   ❌ No phone selectors found!');
    }
    
    // Try to continue
    const continueBtn = await page.$('button:has-text("Continue")');
    if (continueBtn && await continueBtn.isEnabled()) {
      await continueBtn.click();
      console.log('   ✅ Clicked Continue');
      await page.waitForTimeout(1500);
    } else {
      console.log('   ❌ Continue button not found or disabled');
    }
    
    // STEP 3: INSURANCE
    await checkStep(3, 'Insurance');
    
    const insuranceCheckboxes = await page.$$('input[type="checkbox"]');
    if (insuranceCheckboxes.length > 0) {
      console.log(`   ✅ Found ${insuranceCheckboxes.length} insurance checkboxes`);
      for (let i = 0; i < insuranceCheckboxes.length; i++) {
        await insuranceCheckboxes[i].check();
        console.log(`   ✅ Checked insurance for line ${i + 1}`);
      }
    } else {
      console.log('   ❌ No insurance checkboxes found!');
    }
    
    // Continue
    const continueBtn2 = await page.$('button:has-text("Continue")');
    if (continueBtn2 && await continueBtn2.isEnabled()) {
      await continueBtn2.click();
      console.log('   ✅ Clicked Continue');
      await page.waitForTimeout(1500);
    }
    
    // STEP 4: CURRENT PHONES / TRADE-INS
    await checkStep(4, 'Trade-ins');
    
    // Try to skip trade-ins
    const skipTradeBtn = await page.$('button:has-text("Keep All")');
    if (skipTradeBtn) {
      await skipTradeBtn.click();
      console.log('   ✅ Selected Keep All Phones');
    } else {
      const noTradeBtn = await page.$('button:has-text("No trade")');
      if (noTradeBtn) {
        await noTradeBtn.click();
        console.log('   ✅ Selected No Trade');
      }
    }
    
    await page.waitForTimeout(1500);
    
    // STEP 5: PLAN SELECTION
    await checkStep(5, 'Plan Selection');
    
    const planButtons = await page.$$('button.plan-card');
    if (planButtons.length > 0) {
      console.log(`   ✅ Found ${planButtons.length} plan options`);
      await planButtons[0].click(); // Select first plan (Experience Beyond)
      console.log('   ✅ Selected Experience Beyond');
    } else {
      console.log('   ❌ No plan buttons found!');
    }
    
    await page.waitForTimeout(1500);
    
    // STEP 6: ACCESSORY LINES
    await checkStep(6, 'Accessory Lines');
    
    // Look for Watch button
    const watchBtn = await page.$('button:has-text("Watch")');
    if (watchBtn) {
      await watchBtn.click();
      console.log('   ✅ Selected Watch line');
    }
    
    // Look for Tablet/iPad button
    const tabletBtn = await page.$('button:has-text("iPad"), button:has-text("Tablet")');
    if (tabletBtn) {
      await tabletBtn.click();
      console.log('   ✅ Selected Tablet line');
    }
    
    // Continue
    const continueBtn3 = await page.$('button:has-text("Continue")');
    if (continueBtn3 && await continueBtn3.isEnabled()) {
      await continueBtn3.click();
      console.log('   ✅ Clicked Continue');
      await page.waitForTimeout(1500);
    }
    
    // STEP 7: ACCESSORY DEVICES (New vs BYOD)
    await checkStep(7, 'Accessory Devices');
    
    const byodButtons = await page.$$('button:has-text("Bring")');
    if (byodButtons.length > 0) {
      console.log(`   ✅ Found ${byodButtons.length} BYOD options`);
      for (const btn of byodButtons) {
        await btn.click();
        console.log('   ✅ Selected BYOD');
        await page.waitForTimeout(300);
      }
    } else {
      console.log('   ❌ No BYOD options found!');
    }
    
    // Continue to results
    const finalContinue = await page.$('button:has-text("Continue")');
    if (finalContinue && await finalContinue.isEnabled()) {
      await finalContinue.click();
      console.log('   ✅ Clicked Continue to results');
      await page.waitForTimeout(2000);
    }
    
    // STEP 8: RESULTS
    await checkStep(8, 'Results');
    
    // Look for pricing information
    const pageContent = await page.content();
    const monthlyMatch = pageContent.match(/\$(\d+(?:\.\d+)?)\s*\/\s*mo/);
    const upfrontMatch = pageContent.match(/due today.*?\$(\d+(?:\.\d+)?)/i);
    
    if (monthlyMatch) {
      console.log(`   💰 Monthly total found: $${monthlyMatch[1]}/mo`);
    }
    if (upfrontMatch) {
      console.log(`   💵 Upfront total found: $${upfrontMatch[1]}`);
    }
    
    // Take full page screenshot of results
    await page.screenshot({ path: 'verify-final-results-full.png', fullPage: true });
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    await page.screenshot({ path: 'verify-error-state.png', fullPage: true });
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 TEST COMPLETE - Check screenshots to see what\'s actually working');
  console.log('Screenshots saved: verify-step-*.png');
  console.log('='.repeat(80));
  
  await page.waitForTimeout(5000); // Keep browser open to see final state
  await browser.close();
};

// Run the test
testEveryStep();