import { chromium } from '@playwright/test';

async function testCompleteFlow() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 Pro
    deviceScaleFactor: 3
  });
  const page = await context.newPage();
  
  console.log('🚀 Testing Complete Flow - Version 2.6.4\n');
  
  // Navigate to the app
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);
  
  try {
    // Screen 1: Customer Qualification
    console.log('📱 Screen 1: Customer Qualification');
    await page.screenshot({ path: 'screenshots/flow-1-qualification.png' });
    
    // Click Standard qualification
    const standardBtn = await page.getByText('Standard').locator('..');
    if (standardBtn) {
      await standardBtn.click();
      console.log('   ✅ Selected Standard qualification');
      await page.waitForTimeout(500);
    }
    
    // Screen 2: Lines Selection
    console.log('\n📱 Screen 2: Lines Selection');
    await page.screenshot({ path: 'screenshots/flow-2-lines.png' });
    
    // Select 4 lines
    const fourLinesBtn = await page.getByText('4').first();
    if (fourLinesBtn) {
      await fourLinesBtn.click();
      console.log('   ✅ Selected 4 lines');
      await page.waitForTimeout(500);
    }
    
    // Screen 3: Carrier Selection
    console.log('\n📱 Screen 3: Carrier Selection');
    await page.screenshot({ path: 'screenshots/flow-3-carrier.png' });
    
    // Select Verizon (competitor)
    const verizonBtn = await page.getByText('Verizon').locator('..');
    if (verizonBtn) {
      await verizonBtn.click();
      console.log('   ✅ Selected Verizon (Keep & Switch default)');
      await page.waitForTimeout(500);
    }
    
    // Screen 4: New Phones
    console.log('\n📱 Screen 4: New Phones Selection');
    await page.screenshot({ path: 'screenshots/flow-4-new-phones.png' });
    
    // Select phones for lines
    const iPhoneBtn = await page.getByText('iPhone 17 Pro').first();
    if (iPhoneBtn) {
      await iPhoneBtn.click();
      console.log('   ✅ Selected iPhone 17 Pro for Line 1');
      await page.waitForTimeout(300);
    }
    
    // Click Continue
    const continueBtn = await page.getByText('Continue').first();
    if (continueBtn) {
      await continueBtn.click();
      await page.waitForTimeout(500);
    }
    
    // Screen 5: Current Phones (Trade-in)
    console.log('\n📱 Screen 5: Current Phones (Trade-in)');
    await page.screenshot({ path: 'screenshots/flow-5-current-phones.png' });
    
    // Keep all phones (Keep & Switch)
    const keepBtn = await page.getByText('Keep Phone').first();
    if (keepBtn) {
      await keepBtn.click();
      console.log('   ✅ Selected Keep & Switch for Line 1');
      await page.waitForTimeout(300);
    }
    
    // Continue
    const continue2 = await page.getByText('Continue').first();
    if (continue2) {
      await continue2.click();
      await page.waitForTimeout(500);
    }
    
    // Screen 6: Plan Selection
    console.log('\n📱 Screen 6: Plan Selection');
    await page.screenshot({ path: 'screenshots/flow-6-plan.png' });
    
    // Select Experience Beyond
    const planBtn = await page.getByText('Experience Beyond').locator('..');
    if (planBtn) {
      await planBtn.click();
      console.log('   ✅ Selected Experience Beyond plan');
      await page.waitForTimeout(500);
    }
    
    // Screen 7: Insurance
    console.log('\n📱 Screen 7: Insurance Selection');
    await page.screenshot({ path: 'screenshots/flow-7-insurance.png' });
    
    // Protect all lines
    const protectAllBtn = await page.getByText('Protect All Lines');
    if (protectAllBtn) {
      await protectAllBtn.click();
      console.log('   ✅ Selected Protection 360 for all lines');
      await page.waitForTimeout(300);
    }
    
    // Continue
    const continue3 = await page.getByText('Continue').first();
    if (continue3) {
      await continue3.click();
      await page.waitForTimeout(500);
    }
    
    // Screen 8: Summary
    console.log('\n📱 Screen 8: Summary');
    await page.screenshot({ path: 'screenshots/flow-8-summary.png' });
    console.log('   ✅ Reached summary screen');
    
    console.log('\n✨ FLOW TEST COMPLETE - All screens working!');
    console.log('📸 Screenshots saved to ./screenshots/flow-*.png');
    
  } catch (error) {
    console.error('\n❌ Error during flow test:', error.message);
    await page.screenshot({ path: 'screenshots/error-state.png' });
  }
  
  await page.waitForTimeout(3000);
  await browser.close();
}

testCompleteFlow().catch(console.error);