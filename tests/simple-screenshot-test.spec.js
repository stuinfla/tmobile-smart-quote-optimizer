import { test } from '@playwright/test';

test.describe('Screenshot Every Screen', () => {
  test('Capture all screens in order', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    
    // Navigate to the app
    await page.goto('http://localhost:5173');
    await page.waitForTimeout(2000);
    
    // 1. Welcome screen
    await page.screenshot({ path: 'screenshots/all-screens/01-welcome.png', fullPage: true });
    console.log('✓ Screenshot 1: Welcome screen');
    
    // Click "Yes, I'm a Customer"
    await page.locator('text=Yes, I\'m a Customer').click();
    await page.waitForTimeout(1000);
    
    // 2. Lines selection
    await page.screenshot({ path: 'screenshots/all-screens/02-lines.png', fullPage: true });
    console.log('✓ Screenshot 2: Lines selection');
    
    // Select 2 lines
    await page.locator('text=Couple').click();
    await page.waitForTimeout(1000);
    
    // 3. Current phones
    await page.screenshot({ path: 'screenshots/all-screens/03-current-phones.png', fullPage: true });
    console.log('✓ Screenshot 3: Current phones');
    
    // Select "Need new phones"
    await page.locator('text=Need new phones').click();
    await page.waitForTimeout(1000);
    
    // 4. Carrier selection
    await page.screenshot({ path: 'screenshots/all-screens/04-carrier.png', fullPage: true });
    console.log('✓ Screenshot 4: Carrier selection');
    
    // Select Verizon
    await page.locator('text=Verizon').click();
    await page.waitForTimeout(1000);
    
    // 5. New phones selection
    await page.screenshot({ path: 'screenshots/all-screens/05-new-phones.png', fullPage: true });
    console.log('✓ Screenshot 5: New phones selection');
    
    // Select iPhone 17 Pro for line 1
    await page.locator('text=iPhone 17 Pro').first().click();
    await page.waitForTimeout(1000);
    
    // 6. Second phone selection
    await page.screenshot({ path: 'screenshots/all-screens/06-second-phone.png', fullPage: true });
    console.log('✓ Screenshot 6: Second phone selection');
    
    // Select iPhone 17 Pro for line 2
    await page.locator('text=iPhone 17 Pro').first().click();
    await page.waitForTimeout(1000);
    
    // 7. Plan selection
    await page.screenshot({ path: 'screenshots/all-screens/07-plan.png', fullPage: true });
    console.log('✓ Screenshot 7: Plan selection');
    
    // Select Experience Beyond
    await page.locator('text=Experience Beyond').click();
    await page.waitForTimeout(1000);
    
    // 8. Insurance selection
    await page.screenshot({ path: 'screenshots/all-screens/08-insurance.png', fullPage: true });
    console.log('✓ Screenshot 8: Insurance selection');
    
    // Select P360 insurance
    await page.locator('text=P360').click();
    await page.waitForTimeout(1000);
    
    // 9. Accessories
    await page.screenshot({ path: 'screenshots/all-screens/09-accessories.png', fullPage: true });
    console.log('✓ Screenshot 9: Accessories');
    
    // Skip accessories
    await page.locator('text=Skip Accessories').click();
    await page.waitForTimeout(1000);
    
    // 10. Summary
    await page.screenshot({ path: 'screenshots/all-screens/10-summary.png', fullPage: true });
    console.log('✓ Screenshot 10: Summary');
    
    // Calculate best deal
    await page.locator('text=Calculate Best Deal').click();
    await page.waitForTimeout(3000);
    
    // 11. Results
    await page.screenshot({ path: 'screenshots/all-screens/11-results.png', fullPage: true });
    console.log('✓ Screenshot 11: Results');
    
    // Test NEW button
    const newButton = page.locator('.new-button');
    await newButton.click({ force: true });
    await page.waitForTimeout(1000);
    
    // 12. After NEW button (should be back at welcome)
    await page.screenshot({ path: 'screenshots/all-screens/12-after-new.png', fullPage: true });
    console.log('✓ Screenshot 12: After NEW button - back at welcome');
    
    console.log('\n✅ ALL SCREENSHOTS CAPTURED SUCCESSFULLY!');
    console.log('Location: screenshots/all-screens/');
  });
});