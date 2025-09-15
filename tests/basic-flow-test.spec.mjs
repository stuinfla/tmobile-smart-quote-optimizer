import { test, expect } from '@playwright/test';

test('basic flow test - mobile viewport', async ({ page }) => {
  // Set iPhone viewport
  await page.setViewportSize({ width: 390, height: 844 });
  
  console.log('📱 Testing on mobile viewport...');
  
  // Navigate to the app
  await page.goto('http://localhost:5173');
  console.log('  ✓ Page loaded');
  
  // Take screenshot of initial state
  await page.screenshot({ path: 'test-initial-state.png' });
  
  // Wait for app to be ready
  await page.waitForTimeout(2000);
  
  // Check if we're on the lines selection page
  const questionText = await page.locator('.question-text').first().textContent();
  console.log(`  Current question: "${questionText}"`);
  
  // Try to find and click a line selection button
  const lineButtons = await page.locator('.option-button, .quick-btn').count();
  console.log(`  Found ${lineButtons} line selection buttons`);
  
  if (lineButtons > 0) {
    // Click on 2 lines
    const twoLineButton = await page.locator('.option-button, .quick-btn').filter({ hasText: /2|Couple/i }).first();
    await twoLineButton.click();
    console.log('  ✓ Selected 2 lines');
    await page.waitForTimeout(1000);
  }
  
  // Check if we moved to phones selection
  await page.waitForTimeout(1000);
  const newQuestionText = await page.locator('.question-text').first().textContent();
  console.log(`  New question: "${newQuestionText}"`);
  
  // Take screenshot
  await page.screenshot({ path: 'test-after-lines.png' });
  
  // Try to select phones
  const phoneSelects = await page.locator('select').count();
  console.log(`  Found ${phoneSelects} phone selectors`);
  
  if (phoneSelects > 0) {
    // Select first phone
    await page.locator('select').first().selectOption({ index: 1 });
    await page.waitForTimeout(500);
    
    // Check for storage buttons
    const storageButtons = await page.locator('.storage-btn').count();
    console.log(`  Found ${storageButtons} storage buttons`);
    
    if (storageButtons > 0) {
      await page.locator('.storage-btn').first().click();
      console.log('  ✓ Selected storage');
    }
    
    // Select second phone
    if (phoneSelects > 1) {
      await page.locator('select').nth(1).selectOption({ index: 1 });
      await page.waitForTimeout(500);
      
      const storageButtons2 = await page.locator('.device-card').nth(1).locator('.storage-btn').count();
      if (storageButtons2 > 0) {
        await page.locator('.device-card').nth(1).locator('.storage-btn').first().click();
        console.log('  ✓ Selected second phone and storage');
      }
    }
  }
  
  // Try to continue
  const continueButton = await page.locator('button').filter({ hasText: /Continue|Next/i }).first();
  if (await continueButton.count() > 0) {
    await continueButton.click();
    console.log('  ✓ Clicked continue');
    await page.waitForTimeout(1000);
  }
  
  // Check current state
  const currentQuestion = await page.locator('.question-text').first().textContent();
  console.log(`  Current page: "${currentQuestion}"`);
  
  // Take final screenshot
  await page.screenshot({ path: 'test-final-state.png' });
  
  console.log('✅ Basic flow test completed');
});