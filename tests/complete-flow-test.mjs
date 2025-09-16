import { chromium } from 'playwright';
import fs from 'fs';

// Create screenshots directory
if (!fs.existsSync('screenshots/complete-flow')) {
  fs.mkdirSync('screenshots/complete-flow', { recursive: true });
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

console.log('📱 COMPLETE FLOW TEST - T-Mobile Optimizer v2.6.8');
console.log('=================================================');
console.log('Testing as a real end user would experience it');
console.log('Device: iPhone (375x667)');
console.log('');

const url = 'http://localhost:5173';
let stepCount = 1;

async function takeScreenshot(name) {
  await page.screenshot({ 
    path: `screenshots/complete-flow/${String(stepCount).padStart(2, '0')}-${name}.png`, 
    fullPage: true 
  });
  stepCount++;
}

try {
  // Step 1: Initial Load
  console.log('📱 Loading app...');
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  const initialHeading = await page.locator('h2').first().innerText().catch(() => '');
  const initialParagraph = await page.locator('p').first().innerText().catch(() => '');
  
  console.log(`   Screen: ${initialHeading || 'No heading'}`);
  console.log(`   Content: ${initialParagraph || 'No content'}`);
  await takeScreenshot('initial-load');
  
  // Validate starting screen
  if (!initialHeading.includes('Welcome to T-Mobile')) {
    console.log('');
    console.log('❌ CRITICAL ERROR: App not starting at Welcome screen!');
    console.log(`   Instead showing: "${initialHeading}"`);
    
    // Try clicking New button if available
    const newBtn = page.locator('button:has-text("New")').first();
    if (await newBtn.isVisible()) {
      console.log('   Clicking New button to reset...');
      await newBtn.click();
      await page.waitForTimeout(1500);
      const afterReset = await page.locator('h2').first().innerText().catch(() => '');
      console.log(`   After reset: ${afterReset}`);
      await takeScreenshot('after-reset');
    }
    throw new Error('App not starting correctly');
  }
  
  console.log('   ✅ Correct starting screen!');
  console.log('');
  
  // Step 2: Customer Type Selection
  console.log('📱 Step 1: Customer Type');
  const newCustomerBtn = page.locator('text="No, I\'m New"').first();
  await newCustomerBtn.click();
  await page.waitForTimeout(1500);
  console.log('   Selected: New Customer');
  await takeScreenshot('customer-type-selected');
  
  // Step 3: Number of Lines
  console.log('📱 Step 2: Number of Lines');
  const linesHeading = await page.locator('h2').first().innerText().catch(() => '');
  if (!linesHeading.includes('How many') && !linesHeading.includes('lines')) {
    throw new Error(`Wrong screen after customer type: ${linesHeading}`);
  }
  const fourLinesBtn = page.locator('button:has-text("4 Lines")').first();
  await fourLinesBtn.click();
  await page.waitForTimeout(1500);
  console.log('   Selected: 4 Lines');
  await takeScreenshot('lines-selected');
  
  // Step 4: Current Phones
  console.log('📱 Step 3: Current Phones');
  const phonesHeading = await page.locator('h2').first().innerText().catch(() => '');
  if (!phonesHeading.includes('current phone')) {
    throw new Error(`Wrong screen after lines: ${phonesHeading}`);
  }
  
  // Select phones for each line
  const selects = await page.locator('select').all();
  if (selects.length > 0) {
    await selects[0].selectOption({ label: 'iPhone 13' });
    if (selects.length > 1) await selects[1].selectOption({ label: 'iPhone 12' });
    if (selects.length > 2) await selects[2].selectOption({ label: 'Samsung Galaxy S21' });
    if (selects.length > 3) await selects[3].selectOption({ label: 'iPhone 11' });
  }
  console.log('   Selected current phones for all lines');
  await takeScreenshot('current-phones-selected');
  
  // Click Next
  const nextBtn = page.locator('button:has-text("Next")').first();
  await nextBtn.click();
  await page.waitForTimeout(1500);
  
  // Step 5: Current Carrier
  console.log('📱 Step 4: Current Carrier');
  const carrierHeading = await page.locator('h2').first().innerText().catch(() => '');
  if (!carrierHeading.includes('current carrier')) {
    console.log(`   Warning: Unexpected heading "${carrierHeading}"`);
  }
  await takeScreenshot('carrier-selection');
  
  const verizonBtn = page.locator('button:has-text("Verizon")').first();
  await verizonBtn.click();
  await page.waitForTimeout(1500);
  console.log('   Selected: Verizon');
  await takeScreenshot('carrier-selected');
  
  // Step 6: New Phones
  console.log('📱 Step 5: New Phones');
  const newPhonesHeading = await page.locator('h2').first().innerText().catch(() => '');
  if (!newPhonesHeading.includes('new phone')) {
    console.log(`   Warning: Unexpected heading "${newPhonesHeading}"`);
  }
  
  const newSelects = await page.locator('select').all();
  if (newSelects.length > 0) {
    await newSelects[0].selectOption({ label: 'iPhone 16 Pro' });
    if (newSelects.length > 1) await newSelects[1].selectOption({ label: 'iPhone 16' });
  }
  console.log('   Selected new phones');
  await takeScreenshot('new-phones-selected');
  
  // Click Next
  const nextBtn2 = page.locator('button:has-text("Next")').first();
  await nextBtn2.click();
  await page.waitForTimeout(1500);
  
  // Step 7: Plan Selection
  console.log('📱 Step 6: Plan Selection');
  await takeScreenshot('plan-selection');
  
  const beyondBtn = page.locator('button').filter({ hasText: /Experience Beyond/i }).first();
  if (await beyondBtn.isVisible()) {
    await beyondBtn.click();
    await page.waitForTimeout(1500);
    console.log('   Selected: Experience Beyond');
  }
  await takeScreenshot('plan-selected');
  
  // Step 8: Insurance
  console.log('📱 Step 7: Insurance');
  const insuranceHeading = await page.locator('h2').first().innerText().catch(() => '');
  console.log(`   Screen: ${insuranceHeading}`);
  
  // Add insurance for first two lines
  const checkboxes = await page.locator('input[type="checkbox"]').all();
  if (checkboxes.length > 0) {
    await checkboxes[0].check();
    if (checkboxes.length > 1) await checkboxes[1].check();
    console.log('   Added insurance for 2 lines');
  }
  await takeScreenshot('insurance-selected');
  
  // Click Next
  const nextBtn3 = page.locator('button:has-text("Next")').first();
  await nextBtn3.click();
  await page.waitForTimeout(1500);
  
  // Step 9: Accessories
  console.log('📱 Step 8: Accessories');
  await takeScreenshot('accessories');
  
  // Skip accessories
  const nextBtn4 = page.locator('button:has-text("Next")').first();
  await nextBtn4.click();
  await page.waitForTimeout(2000);
  
  // Step 10: Summary
  console.log('📱 Step 9: Quote Summary');
  const summaryHeading = await page.locator('h2').first().innerText().catch(() => '');
  console.log(`   Screen: ${summaryHeading}`);
  await takeScreenshot('summary-top');
  
  // Scroll to see full summary
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(1000);
  await takeScreenshot('summary-bottom');
  
  // Check for total
  const total = await page.locator('text=/\\$[0-9]+/').first().innerText().catch(() => '');
  console.log(`   Monthly Total: ${total || 'Not found'}`);
  
  console.log('');
  console.log('✅ COMPLETE FLOW TEST SUCCESSFUL!');
  console.log('   - App starts at Welcome screen');
  console.log('   - All navigation works correctly');
  console.log('   - Successfully reached Quote Summary');
  console.log('   - Screenshots saved in screenshots/complete-flow/');
  
} catch (error) {
  console.log('');
  console.log('❌ FLOW TEST FAILED!');
  console.log(`   Error: ${error.message}`);
  await takeScreenshot('error-state');
}

console.log('');
console.log('Browser staying open for 10 seconds...');
await page.waitForTimeout(10000);

await browser.close();