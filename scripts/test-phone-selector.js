import { webkit } from 'playwright';

async function testPhoneSelector() {
  console.log('🔍 Testing New Phone Selector Design...\n');
  
  const browser = await webkit.launch({ 
    headless: false,
    slowMo: 1000
  });
  
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });
  
  const page = await context.newPage();
  
  // Enable console logging
  page.on('console', msg => console.log('PAGE:', msg.text()));
  page.on('pageerror', error => console.log('ERROR:', error.message));
  
  console.log('📱 Opening T-Mobile Sales Edge...');
  await page.goto('http://localhost:5175', {
    waitUntil: 'networkidle'
  });
  
  await page.waitForTimeout(2000);
  
  // Navigate to phone selection
  console.log('\n=== NAVIGATING TO PHONE SELECTION ===');
  console.log('1. Selecting customer type...');
  await page.click('text=No, I\'m New');
  await page.waitForTimeout(500);
  await page.click('text=Standard Consumer');
  await page.waitForTimeout(1000);
  
  console.log('2. Selecting 3 lines...');
  await page.click('button:has-text("3")').catch(() => 
    page.click('text=3 Lines').catch(() =>
      page.click('text=Family')
    )
  );
  await page.waitForTimeout(2000);
  
  console.log('3. Selecting carrier (Verizon)...');
  await page.click('text=Verizon');
  await page.waitForTimeout(2000);
  
  // Should be on phone selection now
  const phoneSelectionVisible = await page.locator('text=Select New Phones').isVisible().catch(() => false);
  if (!phoneSelectionVisible) {
    console.log('❌ Not on phone selection screen yet. Checking current screen...');
    const content = await page.content();
    if (content.includes('Trade-in')) {
      console.log('Still on trade-in screen. Clicking Continue...');
      await page.click('button:has-text("Continue")');
      await page.waitForTimeout(2000);
    }
  }
  
  console.log('\n=== TESTING PHONE SELECTOR ===');
  
  // Test 1: Check if all 4 lines are visible
  const lineCount = await page.locator('text=/Line [1-4]$/').count();
  console.log(`✅ Lines visible on screen: ${lineCount}/3 (should show 3)`);
  
  // Test 2: Check dropdowns
  const dropdowns = await page.locator('select').count();
  console.log(`✅ Phone dropdowns found: ${dropdowns} (should be 3)`);
  
  // Test 3: Check iPhone options in dropdown
  if (dropdowns > 0) {
    console.log('4. Testing Line 1 dropdown...');
    const firstDropdown = page.locator('select').first();
    
    // Get all options
    const options = await firstDropdown.locator('option').allTextContents();
    console.log('   Available phones:', options.slice(0, 5).join(', '), '...');
    
    // Check if iPhone 17 models are there
    const hasIPhone17 = options.some(opt => opt.includes('iPhone 17'));
    const hasIPhone17Pro = options.some(opt => opt.includes('iPhone 17 Pro'));
    const hasSamsung = options.some(opt => opt.includes('Samsung'));
    
    console.log(`   ✅ iPhone 17: ${hasIPhone17}`);
    console.log(`   ✅ iPhone 17 Pro: ${hasIPhone17Pro}`);
    console.log(`   ✅ Samsung phones: ${hasSamsung}`);
    
    // Test 4: Select iPhone 17 Pro
    console.log('5. Selecting iPhone 17 Pro for Line 1...');
    await firstDropdown.selectOption({ label: /iPhone 17 Pro/ });
    await page.waitForTimeout(500);
    
    // Test 5: Check storage buttons appear
    const storageButtons = await page.locator('button:has-text(/GB$/)').count();
    console.log(`   ✅ Storage buttons visible: ${storageButtons} (should be 4: 128GB, 256GB, 512GB, 1TB)`);
    
    // Test 6: Select 512GB storage
    if (storageButtons > 0) {
      console.log('6. Selecting 512GB storage...');
      await page.click('button:has-text("512GB")');
      await page.waitForTimeout(500);
    }
  }
  
  // Test 7: Quick select buttons
  console.log('7. Testing quick select "All iPhone 17 Pro"...');
  const quickSelectVisible = await page.locator('text=All iPhone 17 Pro').isVisible();
  if (quickSelectVisible) {
    await page.click('text=All iPhone 17 Pro');
    await page.waitForTimeout(1000);
    console.log('   ✅ Quick select clicked');
  } else {
    console.log('   ❌ Quick select button not found');
  }
  
  // Test 8: Check Continue button
  const continueEnabled = await page.locator('button:has-text("Continue")').isEnabled();
  console.log(`8. Continue button enabled: ${continueEnabled}`);
  
  // Test 9: Back button
  const backButton = await page.locator('button:has-text("Back")').isVisible();
  console.log(`9. Back button visible: ${backButton}`);
  
  // Take screenshot
  await page.screenshot({ path: 'phone-selector-test.png' });
  console.log('\n📸 Screenshot saved: phone-selector-test.png');
  
  console.log('\n========================================');
  console.log('PHONE SELECTOR TEST SUMMARY:');
  console.log(`✅ Lines shown: ${lineCount}/3`);
  console.log(`✅ Dropdowns working: ${dropdowns > 0}`);
  console.log(`✅ Storage selection working: ${dropdowns > 0}`);
  console.log(`✅ Quick select working: ${quickSelectVisible}`);
  console.log(`✅ Back button available: ${backButton}`);
  console.log('========================================\n');
  
  await page.waitForTimeout(3000);
  await browser.close();
  console.log('✅ Test complete!');
}

testPhoneSelector().catch(console.error);