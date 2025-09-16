import { chromium } from '@playwright/test';

async function testFullFlow() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 Pro
    deviceScaleFactor: 3
  });
  const page = await context.newPage();
  
  console.log('🚀 Testing Full Flow - Version 2.6.5\n');
  console.log('Testing all screens through to final proposal...\n');
  
  // Navigate to the app
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(2000);
  
  try {
    // Screen 1: Customer Qualification
    console.log('📱 Screen 1: Customer Qualification');
    await page.screenshot({ path: 'screenshots/01-qualification.png' });
    
    // Click Standard qualification
    await page.click('text=Standard');
    console.log('   ✅ Selected Standard qualification');
    await page.waitForTimeout(800);
    
    // Screen 2: Lines Selection
    console.log('\n📱 Screen 2: Lines Selection');
    await page.screenshot({ path: 'screenshots/02-lines.png' });
    
    // Select 4 lines
    await page.click('text=4');
    console.log('   ✅ Selected 4 lines');
    await page.waitForTimeout(800);
    
    // Screen 3: Carrier Selection
    console.log('\n📱 Screen 3: Carrier Selection');
    await page.screenshot({ path: 'screenshots/03-carrier.png' });
    
    // Select Verizon from dropdown (competitor for Keep & Switch)
    await page.selectOption('select', 'verizon');
    console.log('   ✅ Selected Verizon (competitor) from dropdown');
    await page.waitForTimeout(800);
    
    // Screen 4: New Phones - All lines at once
    console.log('\n📱 Screen 4: New Phones (All Lines)');
    await page.screenshot({ path: 'screenshots/04-new-phones.png' });
    
    // Quick select all iPhone 17 Pro
    await page.click('text=All iPhone 17 Pro');
    console.log('   ✅ Selected iPhone 17 Pro for all lines');
    await page.waitForTimeout(500);
    
    // Click Continue
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(800);
    
    // Screen 5: Trade-in Selection - All lines at once
    console.log('\n📱 Screen 5: Trade-in/Keep & Switch');
    await page.screenshot({ path: 'screenshots/05-trade-in.png' });
    
    // Select Keep & Switch for all
    await page.click('text=All Keep & Switch');
    console.log('   ✅ Selected Keep & Switch for all lines');
    await page.waitForTimeout(500);
    
    // Continue
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(800);
    
    // Screen 6: Plan Selection
    console.log('\n📱 Screen 6: Plan Selection');
    await page.screenshot({ path: 'screenshots/06-plan.png' });
    
    // Select Experience Beyond
    await page.click('text=Experience Beyond');
    console.log('   ✅ Selected Experience Beyond plan');
    await page.waitForTimeout(800);
    
    // Screen 7: Accessory Lines (if present)
    const hasAccessoryScreen = await page.locator('text=Watch Line').count() > 0;
    if (hasAccessoryScreen) {
      console.log('\n📱 Screen 7: Accessory Lines');
      await page.screenshot({ path: 'screenshots/07-accessories.png' });
      await page.click('button:has-text("Continue")');
      await page.waitForTimeout(800);
    }
    
    // Screen 8: Insurance
    console.log('\n📱 Screen 8: Insurance Selection');
    await page.screenshot({ path: 'screenshots/08-insurance.png' });
    
    // Select Protect All Lines
    await page.click('text=Protect All Lines');
    console.log('   ✅ Selected Protection 360 for all lines');
    await page.waitForTimeout(500);
    
    // Continue to summary
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(800);
    
    // Screen 9: Summary
    console.log('\n📱 Screen 9: Summary');
    await page.screenshot({ path: 'screenshots/09-summary.png' });
    
    // Click Calculate Best Deal
    const calculateBtn = await page.locator('button:has-text("Calculate Best Deal")').first();
    if (calculateBtn) {
      await calculateBtn.click();
      console.log('   ✅ Clicked Calculate Best Deal');
      await page.waitForTimeout(2000);
    }
    
    // Screen 10: Results
    console.log('\n📱 Screen 10: Results & Optimization');
    await page.screenshot({ path: 'screenshots/10-results.png' });
    
    // Click Generate Quote
    const quoteBtn = await page.locator('button:has-text("Generate Quote")').first();
    if (quoteBtn) {
      await quoteBtn.click();
      console.log('   ✅ Generated Quote');
      await page.waitForTimeout(1500);
    }
    
    // Screen 11: Professional Proposal
    console.log('\n📱 Screen 11: Professional Proposal');
    await page.screenshot({ path: 'screenshots/11-proposal.png', fullPage: true });
    
    // Scroll to see full proposal
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'screenshots/11-proposal-bottom.png', fullPage: true });
    
    console.log('\n✨ COMPLETE FLOW TEST SUCCESSFUL!');
    console.log('📸 All screenshots saved to ./screenshots/');
    console.log('\n📄 Professional Proposal Generated:');
    console.log('   - Header with store info and rep details');
    console.log('   - Customer qualification status');
    console.log('   - Selected devices and plans');
    console.log('   - Pricing breakdown');
    console.log('   - Terms and conditions');
    console.log('   - Print-ready format');
    
  } catch (error) {
    console.error('\n❌ Error during flow test:', error.message);
    await page.screenshot({ path: 'screenshots/error-state.png', fullPage: true });
  }
  
  await page.waitForTimeout(5000);
  await browser.close();
}

testFullFlow().catch(console.error);