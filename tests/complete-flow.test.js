const { test, expect } = require('@playwright/test');

test.describe('T-Mobile Optimizer Complete Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.waitForLoadState('networkidle');
  });

  test('90-second flow from new customer to proposal', async ({ page }) => {
    // Test should complete in under 90 seconds
    test.setTimeout(90000);
    
    // Step 1: Customer Type - New customer
    await test.step('Select customer type', async () => {
      await expect(page.locator('text=Welcome to T-Mobile!')).toBeVisible();
      await expect(page.locator('text=Are you a current T-Mobile customer?')).toBeVisible();
      
      // Click "No, I'm New" button
      await page.locator('button:has-text("No, I\'m New")').click();
      await page.waitForTimeout(500); // Wait for auto-advance
    });

    // Step 2: Number of Lines
    await test.step('Select number of lines', async () => {
      await expect(page.locator('text=How many phone lines?')).toBeVisible();
      
      // Select 2 lines (Couple option)
      await page.locator('button:has-text("Couple")').click();
      await page.waitForTimeout(500);
    });

    // Step 3: Current Phones (should come before carrier now)
    await test.step('Select current phones', async () => {
      await expect(page.locator('text=Current Phone')).toBeVisible();
      
      // Select iPhone 14 for Line 1
      await page.locator('select').first().selectOption({ label: /iPhone 14/ });
      
      // Select iPhone 15 for Line 2
      await page.locator('select').nth(1).selectOption({ label: /iPhone 15/ });
      
      // Click Next button
      await page.locator('button:has-text("Next")').first().click();
    });

    // Step 4: Carrier Selection
    await test.step('Select current carrier', async () => {
      await expect(page.locator('text=Current Carrier')).toBeVisible();
      
      // Verify carrier buttons exist (not dropdown)
      await expect(page.locator('button:has-text("AT&T")')).toBeVisible();
      await expect(page.locator('button:has-text("Verizon")')).toBeVisible();
      
      // Select AT&T
      await page.locator('button:has-text("AT&T")').click();
      await page.waitForTimeout(500);
    });

    // Step 5: New Phones Selection
    await test.step('Select new phones', async () => {
      await expect(page.locator('text=Choose New Phone')).toBeVisible();
      
      // Verify iPhone 17 Air and iPhone 17 Plus are available
      const phoneOptions = await page.locator('select').first().innerText();
      expect(phoneOptions).toContain('iPhone 17 Air');
      expect(phoneOptions).toContain('iPhone 17 Plus');
      
      // Select iPhone 17 for Line 1
      await page.locator('button:has-text("iPhone 17")').first().click();
      await page.locator('button:has-text("256GB")').first().click();
      
      // Select iPhone 17 Plus for Line 2
      await page.locator('button:has-text("iPhone 17 Plus")').first().click();
      await page.locator('button:has-text("256GB")').nth(1).click();
      
      // Click Next
      await page.locator('button:has-text("Next")').first().click();
    });

    // Step 6: Plan Selection
    await test.step('Select plan', async () => {
      await expect(page.locator('text=Experience Beyond')).toBeVisible();
      await expect(page.locator('text=Experience More')).toBeVisible();
      
      // Experience Beyond should be selected by default
      const beyondButton = page.locator('button:has-text("Experience Beyond")');
      await expect(beyondButton).toHaveClass(/selected|active/);
      
      // Click Next
      await page.locator('button:has-text("Next")').first().click();
    });

    // Step 7: Insurance Selection
    await test.step('Select insurance', async () => {
      await expect(page.locator('text=Protection 360')).toBeVisible();
      
      // Verify tier-based pricing is shown (not flat $18)
      const insuranceText = await page.locator('body').innerText();
      expect(insuranceText).not.toContain('$18');
      
      // Click "Protect All Lines"
      await page.locator('button:has-text("Protect All Lines")').click();
      
      // Click Next
      await page.locator('button:has-text("Next")').first().click();
    });

    // Step 8: Accessories
    await test.step('Select accessories', async () => {
      if (await page.locator('text=Accessories').isVisible()) {
        // Skip accessories for speed
        await page.locator('button:has-text("Skip")').click();
      }
    });

    // Step 9: Summary & Calculate
    await test.step('View summary and calculate', async () => {
      await expect(page.locator('text=Summary')).toBeVisible();
      
      // Click Calculate button
      await page.locator('button:has-text("Calculate")').click();
      
      // Wait for results
      await page.waitForTimeout(1000);
    });

    // Step 10: Results & Proposal
    await test.step('Verify results and proposal', async () => {
      // Should show optimized scenarios
      await expect(page.locator('text=Best Deal')).toBeVisible();
      
      // Verify Keep & Switch option is shown for competitor customers
      await expect(page.locator('text=Keep & Switch')).toBeVisible();
      
      // Verify pricing shows Experience plans (not Go5G)
      const resultsText = await page.locator('body').innerText();
      expect(resultsText).toContain('Experience');
      expect(resultsText).not.toContain('Go5G');
      
      // Generate proposal
      if (await page.locator('button:has-text("Generate Proposal")').isVisible()) {
        await page.locator('button:has-text("Generate Proposal")').click();
        
        // Verify proposal opens
        await expect(page.locator('text=Professional Quote')).toBeVisible({ timeout: 5000 });
      }
    });
  });

  test('Mobile responsiveness at 375px', async ({ page }) => {
    // Set viewport to iPhone SE size
    await page.setViewportSize({ width: 375, height: 667 });
    
    await test.step('Verify no horizontal scrolling', async () => {
      // Check that body width doesn't exceed viewport
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(375);
      
      // Navigate through first few steps
      await page.locator('button:has-text("No, I\'m New")').click();
      await page.waitForTimeout(500);
      
      // Check no scrolling after navigation
      const bodyWidthAfter = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidthAfter).toBeLessThanOrEqual(375);
    });
    
    await test.step('Verify buttons are not overlapping', async () => {
      // Get all visible buttons
      const buttons = await page.locator('button:visible').all();
      
      for (let i = 0; i < buttons.length - 1; i++) {
        const box1 = await buttons[i].boundingBox();
        const box2 = await buttons[i + 1].boundingBox();
        
        if (box1 && box2) {
          // Check buttons don't overlap
          const overlap = !(box1.x + box1.width <= box2.x || 
                          box2.x + box2.width <= box1.x || 
                          box1.y + box1.height <= box2.y || 
                          box2.y + box2.height <= box1.y);
          
          expect(overlap).toBe(false);
        }
      }
    });
  });

  test('NEW button resets flow completely', async ({ page }) => {
    await test.step('Navigate to middle of flow', async () => {
      // Go through a few steps
      await page.locator('button:has-text("No, I\'m New")').click();
      await page.waitForTimeout(500);
      await page.locator('button:has-text("Couple")').click();
      await page.waitForTimeout(500);
    });
    
    await test.step('Click NEW button', async () => {
      // Find and click NEW button
      await page.locator('button:has-text("NEW")').click();
      
      // Verify we're back at the beginning
      await expect(page.locator('text=Welcome to T-Mobile!')).toBeVisible();
      await expect(page.locator('text=Are you a current T-Mobile customer?')).toBeVisible();
    });
  });

  test('Next buttons visible on every screen', async ({ page }) => {
    const steps = [
      { action: () => page.locator('button:has-text("No, I\'m New")').click(), wait: 500 },
      { action: () => page.locator('button:has-text("Couple")').click(), wait: 500 },
    ];
    
    for (const step of steps) {
      await step.action();
      await page.waitForTimeout(step.wait);
      
      // Verify Next button is visible in top-right
      const nextButton = page.locator('button:has-text("Next")').first();
      await expect(nextButton).toBeVisible();
      
      // Verify it's positioned in top-right
      const box = await nextButton.boundingBox();
      if (box) {
        expect(box.x).toBeGreaterThan(250); // Should be on right side
        expect(box.y).toBeLessThan(100); // Should be near top
      }
    }
  });
});