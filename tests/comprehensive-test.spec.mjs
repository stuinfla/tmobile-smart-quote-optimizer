import { test, expect, devices } from '@playwright/test';

// Test on iPhone viewport
test.use({
  ...devices['iPhone 13'],
});

test.describe('T-Mobile Sales Edge - Comprehensive Test', () => {
  test('complete flow with all features', async ({ page }) => {
    console.log('🚀 Starting comprehensive test...');
    
    // Navigate to the app
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    
    // Step 1: Select number of lines
    console.log('Step 1: Selecting lines...');
    await page.waitForSelector('.question-text:has-text("How many phone lines")', { timeout: 10000 });
    const familyButton = await page.locator('button.quick-btn.best-value:has-text("Family")');
    await familyButton.click();
    await page.waitForTimeout(500);
    
    // Step 2: Select new phones
    console.log('Step 2: Selecting new phones...');
    await page.waitForSelector('.question-text:has-text("Which new phones")', { timeout: 10000 });
    
    // Select phones for each line
    for (let i = 0; i < 4; i++) {
      const phoneSelect = await page.locator(`select`).nth(i);
      await phoneSelect.selectOption('iPhone_17');
      await page.waitForTimeout(200);
      
      // Select storage
      const storageButton = await page.locator(`.device-card`).nth(i).locator('.storage-btn:has-text("256GB")');
      await storageButton.click();
      await page.waitForTimeout(200);
    }
    
    // Continue button
    const continueAfterPhones = await page.locator('button.navigation-btn:has-text("Continue")');
    await continueAfterPhones.click();
    await page.waitForTimeout(500);
    
    // Step 3: Trade-in options
    console.log('Step 3: Selecting trade-in options...');
    await page.waitForSelector('.question-text:has-text("Trade-in or Keep")', { timeout: 10000 });
    
    // Keep all phones
    const keepPhonesBtn = await page.locator('button.toggle-btn:has-text("Keep All Phones")');
    await keepPhonesBtn.click();
    await page.waitForTimeout(200);
    
    // Continue
    const continueAfterTrade = await page.locator('button.navigation-btn:has-text("Continue")');
    await continueAfterTrade.click();
    await page.waitForTimeout(500);
    
    // Step 4: Plan selection
    console.log('Step 4: Selecting plan...');
    await page.waitForSelector('.question-text:has-text("plan")', { timeout: 10000 });
    
    // Select Experience Beyond (should be default)
    const experienceBeyond = await page.locator('button.plan-option').first();
    const isSelected = await experienceBeyond.evaluate(el => el.classList.contains('selected'));
    if (!isSelected) {
      await experienceBeyond.click();
      await page.waitForTimeout(200);
    }
    
    // Continue
    const continueAfterPlan = await page.locator('button.navigation-btn:has-text("Continue")');
    await continueAfterPlan.click();
    await page.waitForTimeout(500);
    
    // Step 5: Accessory lines
    console.log('Step 5: Testing accessory lines...');
    await page.waitForSelector('.question-text:has-text("connected devices")', { timeout: 10000 });
    
    // Test watch selection
    const watchButton = await page.locator('.accessory-line-btn').filter({ hasText: 'Watch' });
    console.log('  - Clicking watch button...');
    await watchButton.click();
    await page.waitForTimeout(200);
    
    // Verify watch is selected
    const watchSelected = await watchButton.evaluate(el => el.classList.contains('selected'));
    expect(watchSelected).toBe(true);
    console.log('  ✓ Watch selected');
    
    // Test tablet selection  
    const tabletButton = await page.locator('.accessory-line-btn').filter({ hasText: 'Tablet' });
    console.log('  - Clicking tablet button...');
    await tabletButton.click();
    await page.waitForTimeout(200);
    
    // Verify tablet is selected
    const tabletSelected = await tabletButton.evaluate(el => el.classList.contains('selected'));
    expect(tabletSelected).toBe(true);
    console.log('  ✓ Tablet selected');
    
    // Test Home Internet selection
    const homeInternetButton = await page.locator('.accessory-line-btn').filter({ hasText: 'Home Internet' });
    console.log('  - Clicking home internet button...');
    await homeInternetButton.click();
    await page.waitForTimeout(200);
    
    // Verify home internet is selected
    const homeInternetSelected = await homeInternetButton.evaluate(el => el.classList.contains('selected'));
    expect(homeInternetSelected).toBe(true);
    console.log('  ✓ Home Internet selected');
    
    // Continue
    const continueAfterAccessories = await page.locator('button.navigation-btn:has-text("Continue")');
    await continueAfterAccessories.click();
    await page.waitForTimeout(500);
    
    // Step 6: Accessory device selection
    console.log('Step 6: Selecting accessory devices...');
    await page.waitForSelector('.question-text:has-text("buying new or bringing")', { timeout: 10000 });
    
    // Select new watch
    const newWatchBtn = await page.locator('button.choice-btn:has-text("Buy New Watch")');
    await newWatchBtn.click();
    await page.waitForTimeout(200);
    
    // Select new tablet
    const newTabletBtn = await page.locator('button.choice-btn:has-text("Buy New iPad")');
    await newTabletBtn.click();
    await page.waitForTimeout(200);
    
    // Continue
    const continueAfterDevices = await page.locator('button.navigation-btn:has-text("Continue")');
    await continueAfterDevices.click();
    await page.waitForTimeout(500);
    
    // Step 7: Insurance selection
    console.log('Step 7: Testing insurance selection...');
    await page.waitForSelector('.question-text:has-text("Protection 360")', { timeout: 10000 });
    
    // Test insurance checkboxes
    const insuranceCheckboxes = await page.locator('input[type="checkbox"]').all();
    console.log(`  - Found ${insuranceCheckboxes.length} insurance checkboxes`);
    
    // Try to check first two devices
    for (let i = 0; i < Math.min(2, insuranceCheckboxes.length); i++) {
      console.log(`  - Clicking checkbox ${i + 1}...`);
      await insuranceCheckboxes[i].click();
      await page.waitForTimeout(200);
      
      // Verify it's checked
      const isChecked = await insuranceCheckboxes[i].isChecked();
      expect(isChecked).toBe(true);
      console.log(`  ✓ Checkbox ${i + 1} checked`);
    }
    
    // Continue
    const continueAfterInsurance = await page.locator('button.navigation-btn:has-text("Continue")');
    await continueAfterInsurance.click();
    await page.waitForTimeout(500);
    
    // Step 8: Summary page
    console.log('Step 8: Verifying summary page...');
    await page.waitForSelector('.question-text:has-text("Ready to see your savings")', { timeout: 10000 });
    
    // Verify summary content
    const summaryList = await page.locator('.summary-list');
    const summaryText = await summaryList.textContent();
    
    expect(summaryText).toContain('4 phone lines');
    expect(summaryText).toContain('Protection 360 on 2 devices');
    expect(summaryText).toContain('Apple Watch line');
    expect(summaryText).toContain('Tablet line');
    expect(summaryText).toContain('Home Internet');
    console.log('  ✓ Summary shows all selections');
    
    // Step 9: Calculate quote
    console.log('Step 9: Calculating quote...');
    const calculateButton = await page.locator('button:has-text("Calculate My Quote")');
    await calculateButton.click();
    console.log('  - Clicked Calculate button');
    
    // Wait for results
    await page.waitForTimeout(1000);
    
    // Check if carrier modal appears (for Keep & Switch)
    const carrierModal = await page.locator('.carrier-modal').count();
    if (carrierModal > 0) {
      console.log('  - Carrier selection modal appeared');
      const skipButton = await page.locator('button:has-text("Not Listed")');
      await skipButton.click();
      await page.waitForTimeout(500);
    }
    
    // Step 10: Verify results page
    console.log('Step 10: Verifying results...');
    await page.waitForSelector('.results-display', { timeout: 10000 });
    
    // Check for scenario cards
    const scenarioCards = await page.locator('.scenario-card').count();
    expect(scenarioCards).toBeGreaterThan(0);
    console.log(`  ✓ Found ${scenarioCards} scenario cards`);
    
    // Check for pricing information
    const monthlyPrice = await page.locator('.monthly-total').first();
    const priceText = await monthlyPrice.textContent();
    expect(priceText).toContain('$');
    console.log(`  ✓ Monthly price displayed: ${priceText}`);
    
    // Check for quote generator
    const quoteSection = await page.locator('.quote-generator').count();
    expect(quoteSection).toBeGreaterThan(0);
    console.log('  ✓ Quote generator present');
    
    console.log('✅ All tests passed!');
  });
  
  test('verify all interactive elements are clickable', async ({ page }) => {
    console.log('🔍 Testing interactive elements...');
    
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
    
    // Test line selection buttons
    await page.waitForSelector('.quick-btn');
    const quickButtons = await page.locator('.quick-btn').all();
    for (const btn of quickButtons) {
      const isClickable = await btn.isEnabled();
      expect(isClickable).toBe(true);
    }
    console.log('  ✓ Quick selection buttons are clickable');
    
    // Select 2 lines to proceed
    await page.locator('button:has-text("Couple")').click();
    await page.waitForTimeout(500);
    
    // Test phone selectors
    await page.waitForSelector('select');
    const phoneSelects = await page.locator('select').all();
    for (const select of phoneSelects) {
      const isEnabled = await select.isEnabled();
      expect(isEnabled).toBe(true);
    }
    console.log('  ✓ Phone selectors are enabled');
    
    // Select phones and storage
    for (let i = 0; i < 2; i++) {
      await page.locator('select').nth(i).selectOption('iPhone_17');
      await page.waitForTimeout(200);
      await page.locator('.device-card').nth(i).locator('.storage-btn').first().click();
    }
    
    // Continue to trade-in
    await page.locator('button:has-text("Continue")').click();
    await page.waitForTimeout(500);
    
    // Skip to insurance page
    await page.locator('button:has-text("Keep All")').click();
    await page.locator('button:has-text("Continue")').click(); // After trade-in
    await page.waitForTimeout(500);
    await page.locator('button:has-text("Continue")').click(); // After plan
    await page.waitForTimeout(500);
    await page.locator('button:has-text("Skip connected")').click(); // Skip accessories
    await page.waitForTimeout(500);
    
    // Test insurance checkboxes
    await page.waitForSelector('input[type="checkbox"]');
    const checkboxes = await page.locator('input[type="checkbox"]').all();
    console.log(`  - Testing ${checkboxes.length} insurance checkboxes...`);
    
    for (let i = 0; i < checkboxes.length; i++) {
      const checkbox = checkboxes[i];
      const isEnabled = await checkbox.isEnabled();
      expect(isEnabled).toBe(true);
      
      // Try to click it
      await checkbox.click();
      await page.waitForTimeout(100);
      const isChecked = await checkbox.isChecked();
      expect(isChecked).toBe(true);
      
      // Uncheck it
      await checkbox.click();
      await page.waitForTimeout(100);
      const isUnchecked = await checkbox.isChecked();
      expect(isUnchecked).toBe(false);
    }
    console.log('  ✓ All insurance checkboxes are functional');
    
    console.log('✅ All interactive elements work!');
  });
});