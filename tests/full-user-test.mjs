import { chromium } from 'playwright';
import fs from 'fs';

// Create screenshots directory
if (!fs.existsSync('screenshots/user-flow')) {
  fs.mkdirSync('screenshots/user-flow', { recursive: true });
}

const browser = await chromium.launch({ 
  headless: false,
  viewport: { width: 375, height: 667 }
});

const context = await browser.newContext({
  viewport: { width: 375, height: 667 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
  hasTouch: true,
  isMobile: true
});

const page = await context.newPage();

// Test the new deployment
const url = 'https://tmobile-optimizer-fdlhelgqs-stuart-kerrs-projects.vercel.app';
console.log('🧪 FULL END USER TEST');
console.log('=====================');
console.log(`Testing: ${url}`);
console.log('Device: iPhone (375x667)');
console.log('');

try {
  // Step 1: Load the app
  console.log('📱 Step 1: Loading app...');
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Check what screen we're on
  const heading = await page.locator('h2').first().innerText().catch(() => 'No heading');
  const paragraph = await page.locator('p').first().innerText().catch(() => 'No paragraph');
  
  console.log(`   Current screen: ${heading}`);
  console.log(`   Description: ${paragraph}`);
  
  await page.screenshot({ 
    path: 'screenshots/user-flow/01-initial-load.png', 
    fullPage: true 
  });
  
  // Check if we're on the right starting screen
  if (!heading.includes('Welcome to T-Mobile') && !paragraph.includes('current T-Mobile customer')) {
    console.log('');
    console.log('❌ CRITICAL ERROR: App is not starting at the welcome screen!');
    console.log(`   Instead seeing: "${heading}"`);
    console.log('   This is a terrible user experience!');
    
    // Try to reset the flow if there's a New button
    const newButton = page.locator('button:has-text("New")').first();
    if (await newButton.isVisible()) {
      console.log('   Found "New" button - clicking to reset...');
      await newButton.click();
      await page.waitForTimeout(1500);
      
      const newHeading = await page.locator('h2').first().innerText().catch(() => 'No heading');
      console.log(`   After reset: ${newHeading}`);
      await page.screenshot({ 
        path: 'screenshots/user-flow/01b-after-reset.png', 
        fullPage: true 
      });
    }
  }
  
  // Step 2: Customer Type Selection
  console.log('');
  console.log('📱 Step 2: Customer Type Selection');
  const customerTypeHeading = await page.locator('h2').first().innerText().catch(() => '');
  
  if (customerTypeHeading.includes('Welcome to T-Mobile')) {
    console.log('   ✅ Correct starting screen: Welcome to T-Mobile');
    
    // Click "New Customer"
    const newCustomerBtn = page.locator('button:has-text("New Customer")').first();
    if (await newCustomerBtn.isVisible()) {
      await page.screenshot({ 
        path: 'screenshots/user-flow/02-customer-type.png', 
        fullPage: true 
      });
      await newCustomerBtn.click();
      await page.waitForTimeout(1500);
      console.log('   Selected: New Customer');
    } else {
      console.log('   ❌ ERROR: Cannot find "New Customer" button');
    }
  } else {
    console.log(`   ❌ ERROR: Wrong screen - seeing "${customerTypeHeading}"`);
  }
  
  // Step 3: Number of Lines
  console.log('');
  console.log('📱 Step 3: Number of Lines');
  await page.screenshot({ 
    path: 'screenshots/user-flow/03-lines.png', 
    fullPage: true 
  });
  
  const fourLinesBtn = page.locator('button:has-text("4 Lines")').first();
  if (await fourLinesBtn.isVisible()) {
    await fourLinesBtn.click();
    await page.waitForTimeout(1500);
    console.log('   Selected: 4 Lines');
  } else {
    console.log('   ❌ ERROR: Cannot find lines selection');
  }
  
  // Step 4: Current Phones
  console.log('');
  console.log('📱 Step 4: Current Phones');
  await page.screenshot({ 
    path: 'screenshots/user-flow/04-current-phones.png', 
    fullPage: true 
  });
  
  // Select iPhone 13 for line 1
  const line1Select = page.locator('select').first();
  if (await line1Select.isVisible()) {
    await line1Select.selectOption({ label: 'iPhone 13' });
    console.log('   Line 1: iPhone 13');
  }
  
  // Click Next
  const nextBtn = page.locator('button:has-text("Next")').first();
  if (await nextBtn.isVisible()) {
    await nextBtn.click();
    await page.waitForTimeout(1500);
  }
  
  // Step 5: Current Carrier
  console.log('');
  console.log('📱 Step 5: Current Carrier');
  await page.screenshot({ 
    path: 'screenshots/user-flow/05-carrier.png', 
    fullPage: true 
  });
  
  const verizonBtn = page.locator('button:has-text("Verizon")').first();
  if (await verizonBtn.isVisible()) {
    await verizonBtn.click();
    await page.waitForTimeout(1500);
    console.log('   Selected: Verizon');
  } else {
    console.log('   ❌ ERROR: Cannot find carrier buttons');
  }
  
  // Step 6: New Phones
  console.log('');
  console.log('📱 Step 6: New Phones Selection');
  await page.screenshot({ 
    path: 'screenshots/user-flow/06-new-phones.png', 
    fullPage: true 
  });
  
  // Select iPhone 16 Pro for line 1
  const newLine1Select = page.locator('select').first();
  if (await newLine1Select.isVisible()) {
    await newLine1Select.selectOption({ label: 'iPhone 16 Pro' });
    console.log('   Line 1: iPhone 16 Pro');
  }
  
  // Click Next
  const nextBtn2 = page.locator('button:has-text("Next")').first();
  if (await nextBtn2.isVisible()) {
    await nextBtn2.click();
    await page.waitForTimeout(1500);
  }
  
  // Step 7: Plan Selection
  console.log('');
  console.log('📱 Step 7: Plan Selection');
  await page.screenshot({ 
    path: 'screenshots/user-flow/07-plan.png', 
    fullPage: true 
  });
  
  const beyondBtn = page.locator('button').filter({ hasText: /Experience Beyond/i }).first();
  if (await beyondBtn.isVisible()) {
    await beyondBtn.click();
    await page.waitForTimeout(1500);
    console.log('   Selected: Experience Beyond');
  }
  
  // Step 8: Insurance
  console.log('');
  console.log('📱 Step 8: Insurance Selection');
  await page.screenshot({ 
    path: 'screenshots/user-flow/08-insurance.png', 
    fullPage: true 
  });
  
  // Select insurance for line 1
  const insuranceCheckbox = page.locator('input[type="checkbox"]').first();
  if (await insuranceCheckbox.isVisible()) {
    await insuranceCheckbox.check();
    console.log('   Added insurance for Line 1');
  }
  
  // Click Next
  const nextBtn3 = page.locator('button:has-text("Next")').first();
  if (await nextBtn3.isVisible()) {
    await nextBtn3.click();
    await page.waitForTimeout(1500);
  }
  
  // Step 9: Accessories
  console.log('');
  console.log('📱 Step 9: Accessories');
  await page.screenshot({ 
    path: 'screenshots/user-flow/09-accessories.png', 
    fullPage: true 
  });
  
  // Skip accessories - click Next
  const nextBtn4 = page.locator('button:has-text("Next")').first();
  if (await nextBtn4.isVisible()) {
    await nextBtn4.click();
    await page.waitForTimeout(2000);
  }
  
  // Step 10: Summary
  console.log('');
  console.log('📱 Step 10: Quote Summary');
  await page.screenshot({ 
    path: 'screenshots/user-flow/10-summary.png', 
    fullPage: true 
  });
  
  // Check if we can see the total
  const total = await page.locator('text=/\\$[0-9]+/').first().innerText().catch(() => 'No total');
  console.log(`   Monthly Total: ${total}`);
  
  // Scroll down to see more
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await page.screenshot({ 
    path: 'screenshots/user-flow/10b-summary-bottom.png', 
    fullPage: true 
  });
  
  console.log('');
  console.log('✅ Test Complete!');
  console.log('📸 Screenshots saved in screenshots/user-flow/');
  
  // Final assessment
  console.log('');
  console.log('🎯 FINAL ASSESSMENT:');
  
  const finalHeading = await page.locator('h2').first().innerText().catch(() => '');
  if (finalHeading.includes('Quote Summary') || finalHeading.includes('Your Optimized')) {
    console.log('   ✅ Successfully completed the entire flow');
    console.log('   ✅ Reached the quote summary page');
  } else {
    console.log(`   ⚠️ Unexpected final screen: "${finalHeading}"`);
  }
  
} catch (error) {
  console.log('');
  console.log('❌ TEST FAILED WITH ERROR:');
  console.log(error);
  
  // Take error screenshot
  await page.screenshot({ 
    path: 'screenshots/user-flow/error-state.png', 
    fullPage: true 
  });
}

console.log('');
console.log('Keeping browser open for 10 seconds for manual inspection...');
await page.waitForTimeout(10000);

await browser.close();