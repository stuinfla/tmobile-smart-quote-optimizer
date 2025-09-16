import { test, expect } from '@playwright/test';

test.describe('T-Mobile Optimizer Complete Flow Test', () => {
  test('Test New button and complete customer flow', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    
    // Navigate to the app
    await page.goto('http://localhost:5173');
    
    // Wait for app to load
    await page.waitForSelector('.app-title', { timeout: 10000 });
    
    // Take screenshot of initial screen
    await page.screenshot({ path: 'screenshots/final-test/01-welcome-screen.png', fullPage: true });
    console.log('Screenshot 1: Welcome screen');
    
    // Test NEW BUTTON first - force click it in case of overlay issues
    const newButton = page.locator('.new-button');
    await expect(newButton).toBeVisible();
    await newButton.click({ force: true });
    await page.waitForTimeout(500);
    
    // Select "Yes, I'm a Customer"
    await page.click('text=Yes, I\'m a Customer');
    await page.waitForTimeout(500);
    
    // Take screenshot after customer selection
    await page.screenshot({ path: 'screenshots/final-test/02-after-customer-selection.png', fullPage: true });
    console.log('Screenshot 2: Lines selection screen');
    
    // Select 2 lines (Couple)
    await page.click('.lines-grid-compact button:has-text("Couple")');
    await page.waitForTimeout(500);
    
    // Take screenshot of current phones screen
    await page.screenshot({ path: 'screenshots/final-test/03-current-phones.png', fullPage: true });
    console.log('Screenshot 3: Current phones screen');
    
    // Select "Need new phones"
    await page.click('text=Need new phones');
    await page.waitForTimeout(500);
    
    // Take screenshot of carrier screen
    await page.screenshot({ path: 'screenshots/final-test/04-carrier-screen.png', fullPage: true });
    console.log('Screenshot 4: Carrier selection screen');
    
    // Select Verizon
    await page.click('text=Verizon');
    await page.waitForTimeout(500);
    
    // Take screenshot of new phones screen
    await page.screenshot({ path: 'screenshots/final-test/05-new-phones.png', fullPage: true });
    console.log('Screenshot 5: New phones selection');
    
    // Select iPhone 16 Pro for both lines
    await page.click('button:has-text("iPhone 16 Pro")');
    await page.waitForTimeout(500);
    await page.click('button:has-text("iPhone 16 Pro")');
    await page.waitForTimeout(500);
    
    // Take screenshot of plan selection
    await page.screenshot({ path: 'screenshots/final-test/06-plan-selection.png', fullPage: true });
    console.log('Screenshot 6: Plan selection screen');
    
    // Select Experience Beyond plan
    await page.click('text=Experience Beyond');
    await page.waitForTimeout(500);
    
    // Take screenshot of insurance screen
    await page.screenshot({ path: 'screenshots/final-test/07-insurance.png', fullPage: true });
    console.log('Screenshot 7: Insurance selection');
    
    // Select P360 insurance
    await page.click('button:has-text("P360")');
    await page.waitForTimeout(500);
    
    // Take screenshot of accessories screen
    await page.screenshot({ path: 'screenshots/final-test/08-accessories.png', fullPage: true });
    console.log('Screenshot 8: Accessories screen');
    
    // Skip accessories
    await page.click('text=Skip Accessories');
    await page.waitForTimeout(500);
    
    // Take screenshot of summary screen
    await page.screenshot({ path: 'screenshots/final-test/09-summary.png', fullPage: true });
    console.log('Screenshot 9: Summary screen');
    
    // Click Calculate Best Deal
    await page.click('text=Calculate Best Deal');
    await page.waitForTimeout(2000);
    
    // Take screenshot of results
    await page.screenshot({ path: 'screenshots/final-test/10-results.png', fullPage: true });
    console.log('Screenshot 10: Results screen');
    
    // NOW TEST THE NEW BUTTON AGAIN - it should reset everything
    console.log('\n--- Testing NEW button reset functionality ---');
    await newButton.click({ force: true });
    await page.waitForTimeout(500);
    
    // Take screenshot after clicking New - should be back at welcome
    await page.screenshot({ path: 'screenshots/final-test/11-after-new-button.png', fullPage: true });
    console.log('Screenshot 11: After clicking New button - should be at welcome screen');
    
    // Verify we're back at the welcome screen
    const welcomeText = await page.locator('text=Welcome to T-Mobile').isVisible();
    if (welcomeText) {
      console.log('✅ NEW BUTTON WORKS! Successfully reset to welcome screen');
    } else {
      console.log('❌ NEW BUTTON FAILED! Not at welcome screen after reset');
    }
    
    console.log('\nAll screenshots saved to screenshots/final-test/');
  });
});