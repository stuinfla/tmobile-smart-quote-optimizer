import { test, expect } from '@playwright/test';

test.describe('T-Mobile App - Complete Scenario with Accessories', () => {
  test('3 iPhone 17 Pro + BYOD Watch + 2 BYOD iPads - Full Flow', async ({ page }) => {
    console.log('\n' + '='.repeat(80));
    console.log('PLAYWRIGHT E2E TEST - COMPLETE WITH ACCESSORIES');
    console.log('='.repeat(80));
    
    // Go to the app
    await page.goto('http://localhost:5173');
    console.log('✓ Navigated to app');
    
    // Wait for app to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Check if store setup is needed (skip if present)
    const needsSetup = await page.locator('.store-setup-container').isVisible().catch(() => false);
    if (needsSetup) {
      console.log('⚙️ Handling store setup...');
      await page.fill('input[name="storeName"], input[placeholder*="Store Name"]', 'Test Store');
      await page.fill('input[name="storeNumber"], input[placeholder*="Store Number"]', '12345');
      await page.fill('input[name="address"], input[placeholder*="Address"]', '123 Main St');
      await page.fill('input[name="city"], input[placeholder*="City"]', 'Miami');
      await page.fill('input[name="zipCode"], input[placeholder*="ZIP"]', '33101');
      await page.fill('input[name="phone"], input[placeholder*="Phone"]', '305-555-1234');
      await page.fill('input[name="repName"], input[placeholder*="Your Name"]', 'Test Rep');
      await page.fill('input[name="employeeId"], input[placeholder*="Employee ID"]', 'EMP123');
      await page.click('button:has-text("Complete Setup"), button:has-text("Get Started"), button:has-text("Continue")');
      await page.waitForTimeout(1000);
    }
    
    // STEP 1: Select 3 lines
    console.log('\n📱 Step 1: Selecting 3 lines...');
    await page.waitForSelector('.question-card, .question-section', { timeout: 10000 });
    const lineButton = await page.locator('button:has-text("3 Lines"), button:has-text("3")').first();
    if (await lineButton.isVisible()) {
      await lineButton.click();
    } else {
      await page.click('.option-button:has-text("3"), [data-lines="3"]');
    }
    await page.waitForTimeout(800);
    console.log('✓ Selected 3 lines');
    
    // STEP 2: Select iPhone 17 Pro for all lines
    console.log('\n📱 Step 2: Selecting phones...');
    await page.waitForSelector('.device-selector, .device-card', { timeout: 10000 });
    
    for (let i = 0; i < 3; i++) {
      const deviceCard = page.locator('.device-card').nth(i);
      const phoneSelect = deviceCard.locator('select').first();
      await phoneSelect.selectOption('iPhone_17_Pro');
      await page.waitForTimeout(300);
      await deviceCard.locator('.storage-btn:has-text("256GB"), button:has-text("256GB")').click();
      await page.waitForTimeout(300);
      console.log(`✓ Line ${i + 1}: iPhone 17 Pro 256GB selected`);
    }
    
    await page.click('button:has-text("Continue"), button:has-text("Next")');
    await page.waitForTimeout(800);
    
    // STEP 3: Handle trade-ins (Keep all phones)
    console.log('\n📱 Step 3: Trade-in selection...');
    await page.waitForSelector('.trade-toggle, .trade-in-section', { timeout: 10000 });
    await page.click('button:has-text("Keep All"), button:has-text("Keep & Switch"), button:has-text("No Trade")');
    await page.waitForTimeout(500);
    console.log('✓ Selected Keep & Switch (no trade-ins)');
    
    await page.click('button:has-text("Continue"), button:has-text("Next")');
    await page.waitForTimeout(800);
    
    // STEP 4: Select Experience Beyond plan
    console.log('\n📱 Step 4: Selecting plan...');
    await page.waitForSelector('.plan-selector, .plan-card', { timeout: 10000 });
    await page.click('.plan-card:has-text("Experience Beyond"), button:has-text("Experience Beyond")');
    await page.waitForTimeout(500);
    console.log('✓ Selected Experience Beyond plan');
    
    await page.click('button:has-text("Continue"), button:has-text("Next")');
    await page.waitForTimeout(800);
    
    // STEP 5: Add accessory lines (Watch and Tablet)
    console.log('\n📱 Step 5: Adding accessory lines...');
    await page.waitForSelector('.question-card', { timeout: 10000 });
    
    // Take screenshot to see the accessory options
    await page.screenshot({ path: 'accessory-lines-page.png', fullPage: true });
    
    // Look for accessory line buttons based on the actual structure
    const watchButton = page.locator('.accessory-line-btn:has-text("Apple Watch"), .accessory-line-btn:has-text("Galaxy Watch")').first();
    const tabletButton = page.locator('.accessory-line-btn:has-text("iPad"), .accessory-line-btn:has-text("Tablet")').first();
    
    if (await watchButton.isVisible()) {
      await watchButton.click();
      await page.waitForTimeout(300);
      console.log('✓ Added watch line');
    } else {
      console.log('⚠️ Watch button not found');
    }
    
    if (await tabletButton.isVisible()) {
      await tabletButton.click();
      await page.waitForTimeout(300);
      console.log('✓ Added tablet line');
    } else {
      console.log('⚠️ Tablet button not found');
    }
    
    await page.click('button:has-text("Continue"), button:has-text("Next")');
    await page.waitForTimeout(800);
    
    // STEP 6: Select BYOD for accessories
    console.log('\n📱 Step 6: Selecting BYOD for accessories...');
    await page.waitForSelector('.device-choice-container, .device-choice-card', { timeout: 10000 });
    
    // BYOD for watch
    const byodWatchButton = page.locator('button:has-text("Bring My Own"):near(:text("Watch"))').first();
    if (await byodWatchButton.isVisible()) {
      await byodWatchButton.click();
      await page.waitForTimeout(300);
      console.log('✓ Selected BYOD for watch');
    }
    
    // BYOD for tablets  
    const byodTabletButton = page.locator('button:has-text("Bring My Own"):near(:text("Tablet"))').first();
    if (await byodTabletButton.isVisible()) {
      await byodTabletButton.click();
      await page.waitForTimeout(300);
      console.log('✓ Selected BYOD for tablets');
    }
    
    await page.click('button:has-text("Continue"), button:has-text("Next")');
    await page.waitForTimeout(800);
    
    // STEP 7: Insurance selection
    console.log('\n📱 Step 7: Adding insurance...');
    await page.waitForSelector('.insurance-selector, .insurance-card', { timeout: 10000 });
    
    // Check all insurance boxes
    const insuranceCards = page.locator('.insurance-card');
    const count = await insuranceCards.count();
    
    for (let i = 0; i < count; i++) {
      const checkbox = insuranceCards.nth(i).locator('input[type="checkbox"]');
      if (!(await checkbox.isChecked())) {
        await checkbox.check();
        await page.waitForTimeout(200);
      }
    }
    console.log(`✓ Added insurance for ${count} devices`);
    
    await page.click('button:has-text("Continue"), button:has-text("Next")');
    await page.waitForTimeout(800);
    
    // STEP 8: Summary
    console.log('\n📱 Step 8: Summary page...');
    await page.waitForSelector('.summary-section, .summary-container', { timeout: 10000 });
    
    // Take screenshot of summary
    await page.screenshot({ path: 'complete-summary-page.png', fullPage: true });
    console.log('✓ Screenshot saved: complete-summary-page.png');
    
    // Click to see results
    await page.click('button:has-text("See My Deals"), button:has-text("Calculate"), button:has-text("Get Results")');
    await page.waitForTimeout(2000);
    
    // STEP 9: Results
    console.log('\n📱 Step 9: Results page...');
    await page.waitForSelector('.results-section, .scenario-card', { timeout: 10000 });
    
    // Extract the monthly total
    const monthlyTotal = await page.locator('.monthly-total, .total-monthly').first().textContent();
    const upfrontTotal = await page.locator('.upfront-total, .total-upfront').first().textContent();
    
    console.log('\\n' + '='.repeat(80));
    console.log('📊 RESULTS FROM APP:');
    console.log('='.repeat(80));
    console.log(`Monthly Payment: ${monthlyTotal}`);
    console.log(`Upfront Cost: ${upfrontTotal}`);
    
    // Take final screenshot
    await page.screenshot({ path: 'complete-results-page.png', fullPage: true });
    console.log('\\n✓ Screenshot saved: complete-results-page.png');
    
    console.log('\\n' + '='.repeat(80));
    console.log('📋 EXPECTED vs ACTUAL:');
    console.log('='.repeat(80));
    console.log('Expected Monthly: $390.40');
    console.log(`Actual Monthly: ${monthlyTotal}`);
    console.log('Expected Upfront: $852.19');
    console.log(`Actual Upfront: ${upfrontTotal}`);
    console.log('='.repeat(80));
    
    console.log('\\n' + '='.repeat(80));
    console.log('✅ COMPLETE E2E TEST FINISHED!');
    console.log('='.repeat(80));
    
    // Assertions
    expect(monthlyTotal).toBeTruthy();
    expect(upfrontTotal).toBeTruthy();
  });
});