import { webkit } from 'playwright';

async function testNewButtonReset() {
  console.log('🔄 TESTING NEW BUTTON RESET FUNCTIONALITY');
  console.log('🎯 Testing that New button blows out everything and resets\n');
  
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
  
  page.on('console', msg => console.log('📱 PAGE:', msg.text()));
  page.on('pageerror', error => console.log('❌ ERROR:', error.message));
  
  try {
    console.log('🌐 Loading production app...');
    await page.goto('https://tmobile-optimizer.vercel.app', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    await page.waitForTimeout(2000);
    
    // Step 1: Verify we start at customer type
    console.log('\n=== STEP 1: Initial State Verification ===');
    const initialCustomerTypeVisible = await page.locator('text=No, I\'m New').isVisible();
    console.log(`✅ Initial state - Customer Type visible: ${initialCustomerTypeVisible}`);
    
    if (!initialCustomerTypeVisible) {
      console.log('❌ App not starting at customer type screen');
      throw new Error('App not at customer type screen initially');
    }
    
    // Step 2: Go through several screens to get deep into flow
    console.log('\n=== STEP 2: Advancing Through Flow ===');
    
    console.log('🔄 Selecting customer type...');
    await page.click('text=No, I\'m New');
    await page.waitForTimeout(500);
    await page.click('text=Standard Consumer');
    await page.waitForTimeout(1500);
    
    console.log('🔄 Selecting lines...');
    await page.click('button:has-text("3")');
    await page.waitForTimeout(1500);
    
    console.log('🔄 Selecting carrier...');
    await page.click('text=Verizon');
    await page.waitForTimeout(2000);
    
    // Verify we're deep in the flow
    const deepInFlow = await page.locator('text=Trade-in, text=phone, text=Select').first().isVisible().catch(() => false);
    console.log(`📍 Deep in flow (beyond carrier): ${deepInFlow}`);
    
    // Step 3: Test the New button
    console.log('\n=== STEP 3: Testing New Button Reset ===');
    
    // Find and click the New button
    const newButton = await page.locator('button:has-text("New"), .new-button').first();
    const newButtonVisible = await newButton.isVisible();
    console.log(`🔍 New button visible: ${newButtonVisible}`);
    
    if (!newButtonVisible) {
      console.log('❌ New button not found!');
      // Take screenshot to see what's on screen
      await page.screenshot({ path: 'no-new-button.png' });
      throw new Error('New button not found');
    }
    
    console.log('🔄 Clicking New button...');
    await newButton.click();
    await page.waitForTimeout(2000); // Give time for reset
    
    // Step 4: Verify complete reset
    console.log('\n=== STEP 4: Verifying Complete Reset ===');
    
    // Should be back at customer type screen
    const backToCustomerType = await page.locator('text=No, I\'m New').isVisible();
    console.log(`✅ Back to Customer Type screen: ${backToCustomerType}`);
    
    // Should not have any previous selections visible
    const noCarrierSelected = await page.locator('text=Verizon').isVisible();
    const noLinesSelected = await page.locator('text=3 lines').isVisible().catch(() => false);
    
    console.log(`🔍 Carrier selection cleared: ${!noCarrierSelected}`);
    console.log(`🔍 Lines selection cleared: ${!noLinesSelected}`);
    
    // Check URL is reset
    const currentUrl = page.url();
    console.log(`🌐 URL after reset: ${currentUrl}`);
    
    // Test that we can start fresh flow
    console.log('\n=== STEP 5: Testing Fresh Flow Start ===');
    
    console.log('🔄 Starting fresh customer selection...');
    await page.click('text=Yes, I\'m a Customer');
    await page.waitForTimeout(1000);
    
    const freshFlowWorks = await page.locator('text=How many').isVisible();
    console.log(`✅ Fresh flow works after reset: ${freshFlowWorks}`);
    
    if (backToCustomerType && !noCarrierSelected && freshFlowWorks) {
      console.log('\n🎉 NEW BUTTON RESET: SUCCESS!');
      console.log('✅ New button properly blows out everything and resets');
    } else {
      console.log('\n❌ NEW BUTTON RESET: FAILED!');
      console.log('🚨 New button does not properly reset the flow');
      
      await page.screenshot({ path: 'new-button-reset-failed.png' });
      console.log('📸 Screenshot saved: new-button-reset-failed.png');
    }
    
  } catch (error) {
    console.log('\n❌ NEW BUTTON TEST FAILED!');
    console.log('🚨 Error:', error.message);
    await page.screenshot({ path: 'new-button-test-error.png' });
    throw error;
  } finally {
    await page.waitForTimeout(3000);
    await browser.close();
  }
}

testNewButtonReset().catch(error => {
  console.error('🚨 CRITICAL NEW BUTTON FAILURE:', error);
  process.exit(1);
});