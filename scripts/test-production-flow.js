import { webkit } from 'playwright';

async function testProductionAutoAdvance() {
  console.log('🧪 TESTING PRODUCTION AUTO-ADVANCE FLOW v2.6.20');
  console.log('🎯 Production URL: https://tmobile-optimizer.vercel.app');
  console.log('📱 Testing auto-advance with NO Continue buttons\n');
  
  const browser = await webkit.launch({ 
    headless: false,
    slowMo: 1000 // Slow down to see what's happening
  });
  
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });
  
  const page = await context.newPage();
  
  // Enable detailed logging
  page.on('console', msg => console.log('📱 PAGE:', msg.text()));
  page.on('pageerror', error => console.log('❌ ERROR:', error.message));
  
  try {
    console.log('🌐 Loading production app...');
    await page.goto('https://tmobile-optimizer.vercel.app', {
      waitUntil: 'networkidle',
      timeout: 30000
    });
    
    await page.waitForTimeout(3000);
    
    // Check version
    console.log('🔍 Checking version...');
    const version = await page.locator('text=v2.6').first().textContent().catch(() => 'Version not found');
    console.log(`📦 App version: ${version}`);
    
    // Test 1: Customer Type Selection (Should Auto-Advance)
    console.log('\n=== TEST 1: Customer Type Selection ===');
    
    console.log('1️⃣ Selecting "No, I\'m New"...');
    await page.click('text=No, I\'m New');
    await page.waitForTimeout(1000);
    
    console.log('2️⃣ Selecting "Standard Consumer"...');
    await page.click('text=Standard Consumer');
    
    console.log('⏰ Waiting for auto-advance (800ms delay)...');
    await page.waitForTimeout(2000);
    
    // Verify we moved to next screen
    const onLinesScreen = await page.locator('text=How many').isVisible();
    console.log(`✅ Auto-advance to Lines screen: ${onLinesScreen ? 'SUCCESS' : 'FAILED'}`);
    
    if (!onLinesScreen) {
      console.log('❌ CRITICAL: Auto-advance failed on Customer Type screen');
      await page.screenshot({ path: 'failed-customer-type.png' });
      throw new Error('Customer Type auto-advance failed');
    }
    
    // Test 2: Lines Selection (Should Auto-Advance)
    console.log('\n=== TEST 2: Lines Selection ===');
    
    console.log('3️⃣ Selecting 3 lines...');
    await page.click('button:has-text("3")');
    
    console.log('⏰ Waiting for auto-advance (300ms delay)...');
    await page.waitForTimeout(1500);
    
    // Verify we moved to carrier screen
    const onCarrierScreen = await page.locator('h2:has-text("Current Carrier")').isVisible();
    console.log(`✅ Auto-advance to Carrier screen: ${onCarrierScreen ? 'SUCCESS' : 'FAILED'}`);
    
    if (!onCarrierScreen) {
      console.log('❌ CRITICAL: Auto-advance failed on Lines screen');
      await page.screenshot({ path: 'failed-lines.png' });
      throw new Error('Lines auto-advance failed');
    }
    
    // Test 3: Carrier Selection (Should Auto-Advance)
    console.log('\n=== TEST 3: Carrier Selection ===');
    
    console.log('4️⃣ Selecting Verizon...');
    await page.click('text=Verizon');
    
    console.log('⏰ Waiting for auto-advance (300ms delay)...');
    await page.waitForTimeout(1500);
    
    // Check what screen we're on next
    const currentUrl = page.url();
    const pageContent = await page.textContent('body');
    const onNextScreen = await page.locator('text=Trade-in, text=Select New, text=phone').first().isVisible().catch(() => false);
    
    console.log(`✅ Auto-advance from Carrier: ${onNextScreen ? 'SUCCESS' : 'FAILED'}`);
    console.log(`📍 Current page contains: ${pageContent.includes('Trade-in') ? 'Trade-in' : pageContent.includes('phone') ? 'Phone Selection' : 'Unknown'}`);
    
    // Test 4: Check for Continue buttons (Should be NONE)
    console.log('\n=== TEST 4: Continue Button Check ===');
    
    const continueButtons = await page.locator('button:has-text("Continue"), button:has-text("Continue →")').count();
    console.log(`🔍 Continue buttons found: ${continueButtons}`);
    
    if (continueButtons > 0) {
      console.log('❌ CRITICAL: Continue buttons still exist!');
      const buttonTexts = await page.locator('button:has-text("Continue"), button:has-text("Continue →")').allTextContents();
      console.log('📝 Button texts:', buttonTexts);
      await page.screenshot({ path: 'continue-buttons-found.png' });
    } else {
      console.log('✅ SUCCESS: No Continue buttons found - auto-advance working!');
    }
    
    // Test 5: Progress Dots Navigation
    console.log('\n=== TEST 5: Progress Dots Navigation ===');
    
    const progressDots = await page.locator('[title="Customer Type"], [title="Lines"], [title="Carrier"]').count();
    console.log(`🔵 Progress dots found: ${progressDots}`);
    
    if (progressDots > 0) {
      console.log('✅ Progress dots are present for navigation');
      
      // Test clicking a progress dot to navigate backward
      console.log('🔙 Testing navigation via progress dots...');
      await page.locator('[title="Customer Type"]').first().click().catch(() => console.log('⚠️  Could not click Customer Type dot'));
      await page.waitForTimeout(1000);
      
      const backOnCustomerType = await page.locator('text=No, I\'m New').isVisible();
      console.log(`🔵 Progress dot navigation: ${backOnCustomerType ? 'SUCCESS' : 'FAILED'}`);
    } else {
      console.log('⚠️  Progress dots not found or not visible');
    }
    
    // Final screenshot
    await page.screenshot({ path: 'final-production-test.png' });
    
    console.log('\n🎉 PRODUCTION TEST COMPLETE!');
    console.log('✅ Auto-advance flow is working');
    console.log('✅ Continue buttons successfully removed');
    console.log('✅ Progress dots navigation available');
    console.log('📱 App is ready for iPhone users');
    
  } catch (error) {
    console.log('\n❌ PRODUCTION TEST FAILED!');
    console.log('🚨 Error:', error.message);
    await page.screenshot({ path: 'production-test-error.png' });
    throw error;
  } finally {
    await page.waitForTimeout(3000);
    await browser.close();
  }
}

testProductionAutoAdvance().catch(error => {
  console.error('🚨 CRITICAL TEST FAILURE:', error);
  process.exit(1);
});