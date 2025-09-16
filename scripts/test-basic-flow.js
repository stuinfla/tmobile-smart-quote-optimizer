import { webkit } from 'playwright';

async function testBasicFlow() {
  console.log('🧪 TESTING BASIC FLOW - NO LOOP BACK');
  console.log('🎯 Testing that flow advances properly with Continue buttons\n');
  
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
    console.log('🌐 Loading production app v2.6.22...');
    await page.goto('https://tmobile-optimizer.vercel.app', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    await page.waitForTimeout(2000);
    
    // Step 1: Customer Type
    console.log('\n=== STEP 1: Customer Type ===');
    await page.click('text=No, I\'m New');
    await page.waitForTimeout(500);
    await page.click('text=Standard Consumer');
    await page.waitForTimeout(1000);
    
    // Look for Continue button and click it
    console.log('🔍 Looking for Continue button...');
    const continueBtn1 = await page.locator('button:has-text("Continue")').first();
    const btn1Visible = await continueBtn1.isVisible();
    console.log(`Continue button visible: ${btn1Visible}`);
    
    if (btn1Visible) {
      await continueBtn1.click();
      await page.waitForTimeout(2000);
    }
    
    // Verify we're on lines screen
    const onLinesScreen = await page.locator('text=How many').isVisible();
    console.log(`✅ Reached Lines screen: ${onLinesScreen ? 'SUCCESS' : 'FAILED'}`);
    
    if (!onLinesScreen) {
      console.log('❌ CRITICAL: Failed to advance from customer type');
      throw new Error('Failed to advance from customer type');
    }
    
    // Step 2: Lines
    console.log('\n=== STEP 2: Lines Selection ===');
    await page.click('button:has-text("3")');
    await page.waitForTimeout(1000);
    
    // Look for Continue button
    const continueBtn2 = await page.locator('button:has-text("Continue")').first();
    const btn2Visible = await continueBtn2.isVisible();
    console.log(`Continue button visible: ${btn2Visible}`);
    
    if (btn2Visible) {
      await continueBtn2.click();
      await page.waitForTimeout(2000);
    }
    
    // Verify we're on carrier screen
    const onCarrierScreen = await page.locator('h2:has-text("Current Carrier")').isVisible();
    console.log(`✅ Reached Carrier screen: ${onCarrierScreen ? 'SUCCESS' : 'FAILED'}`);
    
    if (!onCarrierScreen) {
      console.log('❌ CRITICAL: Failed to advance from lines');
      
      // Check if we looped back to customer type
      const backToCustomerType = await page.locator('text=No, I\'m New').isVisible();
      if (backToCustomerType) {
        console.log('🚨 CONFIRMED: Flow looped back to customer type!');
        throw new Error('Flow loops back to customer type - CRITICAL BUG');
      }
      
      throw new Error('Failed to advance from lines');
    }
    
    // Step 3: Carrier
    console.log('\n=== STEP 3: Carrier Selection ===');
    await page.click('text=Verizon');
    await page.waitForTimeout(1000);
    
    // Look for Continue button
    const continueBtn3 = await page.locator('button:has-text("Continue")').first();
    const btn3Visible = await continueBtn3.isVisible();
    console.log(`Continue button visible: ${btn3Visible}`);
    
    if (btn3Visible) {
      await continueBtn3.click();
      await page.waitForTimeout(2000);
    }
    
    // Check what screen we're on next
    const currentUrl = page.url();
    const pageContent = await page.textContent('body');
    
    console.log(`🌐 Current URL: ${currentUrl}`);
    console.log(`📄 Page contains trade-in: ${pageContent.includes('Trade-in')}`);
    console.log(`📄 Page contains phone: ${pageContent.includes('phone') || pageContent.includes('iPhone')}`);
    console.log(`📄 Page contains Select New: ${pageContent.includes('Select New')}`);
    
    // Critical test: Make sure we didn't loop back
    const loopedBack = await page.locator('text=No, I\'m New').isVisible();
    if (loopedBack) {
      console.log('\n❌ CRITICAL BUG: FLOW LOOPED BACK TO CUSTOMER TYPE!');
      throw new Error('Flow loops back to customer type after carrier selection');
    } else {
      console.log('\n✅ SUCCESS: Flow did not loop back to customer type');
    }
    
    console.log('\n🎉 BASIC FLOW TEST: SUCCESS!');
    console.log('✅ Customer Type → Lines → Carrier works');
    console.log('✅ No loop back to customer type');
    console.log('✅ Continue buttons function properly');
    
  } catch (error) {
    console.log('\n❌ BASIC FLOW TEST FAILED!');
    console.log('🚨 Error:', error.message);
    await page.screenshot({ path: 'basic-flow-test-error.png' });
    throw error;
  } finally {
    await page.waitForTimeout(3000);
    await browser.close();
  }
}

testBasicFlow().catch(error => {
  console.error('🚨 CRITICAL FLOW FAILURE:', error);
  process.exit(1);
});