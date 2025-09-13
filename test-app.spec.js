// Playwright test to verify T-Mobile Optimizer app in iPhone mode
// Tests that Go5G plans are completely removed and only Experience plans show

import { chromium, devices } from 'playwright';

(async () => {
  // Launch browser in iPhone 14 Pro mode
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500 // Slow down for visibility
  });
  
  const context = await browser.newContext({
    ...devices['iPhone 14 Pro'],
    viewport: { width: 393, height: 852 }
  });
  
  const page = await context.newPage();
  
  console.log('🧪 Starting T-Mobile Optimizer Tests...\n');
  
  try {
    // Navigate to the app
    await page.goto('http://localhost:4173');
    console.log('✅ Navigated to app');
    
    // Test 1: Check version number
    const versionText = await page.textContent('.version-info');
    if (versionText.includes('v2.3')) {
      console.log('✅ Version 2.3 detected');
    } else {
      console.log(`❌ Wrong version: ${versionText}`);
    }
    
    // Test 2: Check header is compact (2 lines max)
    const headerHeight = await page.evaluate(() => {
      const header = document.querySelector('.header');
      return header ? header.offsetHeight : 0;
    });
    console.log(`📏 Header height: ${headerHeight}px (should be < 80px for 2 lines)`);
    if (headerHeight < 80) {
      console.log('✅ Header is compact (2 lines or less)');
    } else {
      console.log('❌ Header is too tall');
    }
    
    // Test 3: Start new quote flow
    await page.click('text=/\\+/'); // Click the + button to start new
    await page.waitForTimeout(500);
    console.log('✅ Started new quote');
    
    // Test 4: Select number of lines
    await page.click('text=/2 Lines/');
    await page.waitForTimeout(500);
    console.log('✅ Selected 2 lines');
    
    // Test 5: Select new phones
    await page.click('text=/Yes, new phones/');
    await page.waitForTimeout(500);
    console.log('✅ Selected new phones');
    
    // Test 6: Select iPhone 16 Pro
    await page.selectOption('select:first-of-type', 'iPhone 16 Pro');
    await page.waitForTimeout(200);
    await page.selectOption('select:nth-of-type(2)', '256GB');
    await page.waitForTimeout(200);
    console.log('✅ Selected iPhone 16 Pro 256GB for line 1');
    
    // Select second phone
    await page.selectOption('select:nth-of-type(3)', 'iPhone 16');
    await page.waitForTimeout(200);
    await page.selectOption('select:nth-of-type(4)', '128GB');
    await page.waitForTimeout(200);
    console.log('✅ Selected iPhone 16 128GB for line 2');
    
    // Continue to current phones
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(500);
    
    // Test 7: Select trade-in phones
    await page.selectOption('select:first-of-type', 'iPhone 13');
    await page.selectOption('select:nth-of-type(2)', 'iPhone 12');
    console.log('✅ Selected trade-in phones');
    
    // Continue to plan selection
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(500);
    
    // Test 8: CRITICAL - Check plan names (NO Go5G!)
    console.log('\n🔍 Checking plan selection screen...');
    
    // Get all plan text content
    const pageContent = await page.textContent('body');
    
    // Check for Go5G references
    if (pageContent.includes('Go5G') || pageContent.includes('GO5G')) {
      console.log('❌❌❌ FAILED: Go5G plans still showing!');
      
      // Try to find where it appears
      const go5gElements = await page.$$('text=/Go5G/i');
      console.log(`Found ${go5gElements.length} Go5G references on the page`);
      
      // Take a screenshot for evidence
      await page.screenshot({ path: 'go5g-still-showing.png', fullPage: true });
      console.log('📸 Screenshot saved: go5g-still-showing.png');
    } else {
      console.log('✅✅✅ SUCCESS: No Go5G plans found!');
    }
    
    // Check for Experience plans
    if (pageContent.includes('Experience Beyond')) {
      console.log('✅ Experience Beyond plan found');
    } else {
      console.log('❌ Experience Beyond plan NOT found');
    }
    
    if (pageContent.includes('Experience More')) {
      console.log('✅ Experience More plan found');
    } else {
      console.log('❌ Experience More plan NOT found');
    }
    
    if (pageContent.includes('Essentials Saver')) {
      console.log('✅ Essentials Saver plan found');
    } else {
      console.log('❌ Essentials Saver plan NOT found');
    }
    
    // Test 9: Select a plan
    const planButtons = await page.$$('.plan-card');
    if (planButtons.length > 0) {
      await planButtons[0].click();
      console.log(`✅ Selected first plan (found ${planButtons.length} plans)`);
    } else {
      console.log('❌ No plan buttons found');
    }
    
    // Continue to accessories
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(500);
    
    // Test 10: Check accessories screen
    console.log('\n🔍 Checking accessories...');
    
    // Check for quantity selectors
    const watchQuantity = await page.$('select[name*="watch"]');
    const ipadQuantity = await page.$('select[name*="ipad"]');
    
    if (watchQuantity) {
      console.log('✅ Watch quantity selector found');
    } else {
      console.log('❌ Watch quantity selector NOT found');
    }
    
    if (ipadQuantity) {
      console.log('✅ iPad quantity selector found');
    } else {
      console.log('❌ iPad quantity selector NOT found');
    }
    
    // Check for insurance option
    const insuranceCheckbox = await page.$('input[type="checkbox"][name*="insurance"]');
    if (insuranceCheckbox) {
      console.log('✅ Insurance checkbox found');
    } else {
      console.log('❌ Insurance checkbox NOT found');
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'final-accessories-screen.png', fullPage: true });
    console.log('\n📸 Final screenshot saved: final-accessories-screen.png');
    
    console.log('\n✨ Test complete!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    await page.screenshot({ path: 'error-screenshot.png', fullPage: true });
    console.log('📸 Error screenshot saved: error-screenshot.png');
  }
  
  await browser.close();
})();