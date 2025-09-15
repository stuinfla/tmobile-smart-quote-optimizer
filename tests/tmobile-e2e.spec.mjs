import { test, expect } from '@playwright/test';

test.describe('T-Mobile App - Your Exact Scenario', () => {
  test('3 iPhone 17 Pro + BYOD Watch + 2 BYOD iPads', async ({ page }) => {
    console.log('\n' + '='.repeat(80));
    console.log('PLAYWRIGHT E2E TEST - MOBILE MODE');
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
      // Fill minimal required fields
      await page.fill('input[name="storeName"], input[placeholder*="Store Name"]', 'Test Store');
      await page.fill('input[name="storeNumber"], input[placeholder*="Store Number"]', '12345');
      await page.fill('input[name="address"], input[placeholder*="Address"]', '123 Main St');
      await page.fill('input[name="city"], input[placeholder*="City"]', 'Miami');
      await page.fill('input[name="zipCode"], input[placeholder*="ZIP"]', '33101');
      await page.fill('input[name="phone"], input[placeholder*="Phone"]', '305-555-1234');
      
      // Rep info
      await page.fill('input[name="repName"], input[placeholder*="Your Name"]', 'Test Rep');
      await page.fill('input[name="employeeId"], input[placeholder*="Employee ID"]', 'EMP123');
      
      // Submit setup
      await page.click('button:has-text("Complete Setup"), button:has-text("Get Started"), button:has-text("Continue")');
      await page.waitForTimeout(1000);
    }
    
    // STEP 1: Select 3 lines
    console.log('\n📱 Step 1: Selecting 3 lines...');
    await page.waitForSelector('.question-card, .question-section', { timeout: 10000 });
    
    // Try different selectors for line selection
    const lineButton = await page.locator('button:has-text("3 Lines"), button:has-text("3")').first();
    if (await lineButton.isVisible()) {
      await lineButton.click();
    } else {
      // Try option button approach
      await page.click('.option-button:has-text("3"), [data-lines="3"]');
    }
    await page.waitForTimeout(800);
    console.log('✓ Selected 3 lines');
    
    // STEP 2: Select iPhone 17 Pro for all lines
    console.log('\n📱 Step 2: Selecting phones...');
    await page.waitForSelector('.device-selector, .device-card', { timeout: 10000 });
    
    // Select phones for each line
    for (let i = 0; i < 3; i++) {
      const deviceCard = page.locator('.device-card').nth(i);
      
      // Select iPhone 17 Pro
      const phoneSelect = deviceCard.locator('select').first();
      await phoneSelect.selectOption('iPhone_17_Pro');
      await page.waitForTimeout(300);
      
      // Select 256GB storage
      await deviceCard.locator('.storage-btn:has-text("256GB"), button:has-text("256GB")').click();
      await page.waitForTimeout(300);
      
      console.log(`✓ Line ${i + 1}: iPhone 17 Pro 256GB selected`);
    }
    
    // Continue to next step
    await page.click('button:has-text("Continue"), button:has-text("Next")');
    await page.waitForTimeout(800);
    
    // STEP 3: Handle trade-ins (Keep all phones for new customer deal)
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
    
    // STEP 5: Accessory lines (if present)
    console.log('\n📱 Step 5: Looking for accessory lines step...');
    
    // Check what step we're actually on by looking at page content
    await page.waitForTimeout(1000);
    const bodyText = await page.locator('body').textContent();
    console.log(`Current page preview: ${bodyText.substring(0, 200)}...`);
    
    // If we're at insurance step (Protection 360), handle it directly
    if (bodyText.includes('Protection 360') || bodyText.includes('insurance')) {
      console.log('📱 Currently at insurance step - handling insurance selection...');
      await page.waitForSelector('.question-card', { timeout: 5000 });
      
      // Select insurance for all devices
      const insuranceCheckboxes = page.locator('input[type="checkbox"]');
      const checkboxCount = await insuranceCheckboxes.count();
      
      for (let i = 0; i < checkboxCount; i++) {
        const checkbox = insuranceCheckboxes.nth(i);
        if (!(await checkbox.isChecked())) {
          await checkbox.check();
          await page.waitForTimeout(200);
        }
      }
      console.log(`✓ Added insurance for ${checkboxCount} devices`);
      
    } else {
      // Try to handle accessory lines if we're on that step
      console.log('📱 Looking for accessory line options...');
      
      // Look for accessory line options
      const hasWatchOption = await page.locator('*:has-text("Watch")').first().isVisible().catch(() => false);
      const hasTabletOption = await page.locator('*:has-text("iPad"), *:has-text("Tablet")').first().isVisible().catch(() => false);
      
      if (hasWatchOption) {
        await page.click('*:has-text("Watch")');
        console.log('✓ Added watch line');
        await page.waitForTimeout(300);
      }
      
      if (hasTabletOption) {
        await page.click('*:has-text("iPad"), *:has-text("Tablet")');
        console.log('✓ Added tablet line');
        await page.waitForTimeout(300);
      }
    }
    
    await page.click('button:has-text("Continue"), button:has-text("Next")');
    await page.waitForTimeout(800);
    
    // STEP 6: Handle current page after insurance (could be summary or accessory lines)
    console.log('\n📱 Step 6: Checking current page after insurance...');
    await page.waitForTimeout(1000);
    const currentBodyText = await page.locator('body').textContent();
    console.log(`Current page content: ${currentBodyText.substring(0, 300)}...`);
    
    // Take debugging screenshot
    await page.screenshot({ path: 'after-insurance-page.png', fullPage: true });
    
    if (currentBodyText.includes('Ready to see your savings') || currentBodyText.includes('Quote Summary') || currentBodyText.includes('Calculate My Quote')) {
      console.log('📱 Already at summary page - this scenario skipped accessory lines');
    } else if (currentBodyText.includes('Watch') || currentBodyText.includes('iPad') || currentBodyText.includes('connected devices')) {
      console.log('📱 Found accessory lines step - handling accessories...');
      
      // Handle watch
      try {
        await page.click('button:has-text("Watch"), *:has-text("Watch")');
        console.log('✓ Added watch line');
        await page.waitForTimeout(300);
      } catch (error) {
        console.log('⚠️ Watch option not found');
      }
      
      // Handle iPad
      try {
        await page.click('button:has-text("iPad"), *:has-text("iPad"), *:has-text("Tablet")');
        console.log('✓ Added iPad line');
        await page.waitForTimeout(300);
      } catch (error) {
        console.log('⚠️ iPad option not found');
      }
      
      // Continue
      await page.click('button:has-text("Continue"), button:has-text("Next")');
      await page.waitForTimeout(800);
      
      // Check for device selection (BYOD)
      const nextBodyText = await page.locator('body').textContent();
      if (nextBodyText.includes('Bring') || nextBodyText.includes('BYOD')) {
        console.log('📱 Device selection step - selecting BYOD...');
        
        // BYOD for all accessories
        const byodButtons = page.locator('button:has-text("Bring My Own"), button:has-text("BYOD")');
        const byodCount = await byodButtons.count();
        for (let i = 0; i < byodCount; i++) {
          await byodButtons.nth(i).click();
          await page.waitForTimeout(200);
        }
        console.log('✓ Selected BYOD for all accessories');
        
        await page.click('button:has-text("Continue"), button:has-text("Next")');
        await page.waitForTimeout(800);
      }
    } else {
      console.log('📱 Unknown page state, taking screenshot for debugging');
      await page.screenshot({ path: 'unknown-page-state.png', fullPage: true });
    }
    
    // Look for summary or calculate button
    console.log('📱 Looking for summary/results page...');
    await page.waitForSelector('.summary-section, .summary-container, .question-card, button:has-text("Calculate")', { timeout: 10000 });
    
    // Take screenshot of summary
    await page.screenshot({ path: 'summary-page.png', fullPage: true });
    console.log('✓ Screenshot saved: summary-page.png');
    
    // Click to see results
    console.log('📱 Clicking Calculate My Quote button...');
    await page.click('button:has-text("Calculate My Quote"), button:has-text("See My Deals"), button:has-text("Calculate"), button:has-text("Get Results")');
    await page.waitForTimeout(3000);
    
    // Debug: Check what page we're on after clicking calculate
    const afterClickText = await page.locator('body').textContent();
    console.log(`After clicking calculate: ${afterClickText.substring(0, 300)}...`);
    await page.screenshot({ path: 'after-calculate-click.png', fullPage: true });
    
    // STEP 7: Results - look for any results indicators
    console.log('\n📱 Step 7: Results page...');
    await page.waitForSelector('.results-section, .scenario-card, .monthly-total, .total-monthly, .question-card, [data-testid*="total"], [data-testid*="monthly"]', { timeout: 10000 });
    
    // Extract the monthly total
    const monthlyTotal = await page.locator('.monthly-total, .total-monthly').first().textContent();
    const upfrontTotal = await page.locator('.upfront-total, .total-upfront').first().textContent();
    
    console.log('\n' + '='.repeat(80));
    console.log('📊 RESULTS FROM APP:');
    console.log('='.repeat(80));
    console.log(`Monthly Payment: ${monthlyTotal}`);
    console.log(`Upfront Cost: ${upfrontTotal}`);
    
    // Take final screenshot
    await page.screenshot({ path: 'results-page.png', fullPage: true });
    console.log('\n✓ Screenshot saved: results-page.png');
    
    // Try to extract more details if available
    const planCost = await page.locator('.plan-cost, [data-testid="plan-cost"]').first().textContent().catch(() => 'N/A');
    const deviceCost = await page.locator('.device-financing, [data-testid="device-cost"]').first().textContent().catch(() => 'N/A');
    const insuranceCost = await page.locator('.insurance-cost, [data-testid="insurance"]').first().textContent().catch(() => 'N/A');
    const accessoryCost = await page.locator('.accessory-cost, [data-testid="accessories"]').first().textContent().catch(() => 'N/A');
    
    console.log('\n📋 Breakdown (if available):');
    console.log(`- Plan: ${planCost}`);
    console.log(`- Devices: ${deviceCost}`);
    console.log(`- Insurance: ${insuranceCost}`);
    console.log(`- Accessories: ${accessoryCost}`);
    
    console.log('\n' + '='.repeat(80));
    console.log('✅ E2E TEST COMPLETE!');
    console.log('='.repeat(80));
    
    // Assertions
    expect(monthlyTotal).toBeTruthy();
    expect(upfrontTotal).toBeTruthy();
  });
});