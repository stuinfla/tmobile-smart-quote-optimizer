import { webkit } from 'playwright';

async function testSafariFlow() {
  console.log('🔍 Testing T-Mobile Sales Edge in Safari/WebKit...\n');
  
  const browser = await webkit.launch({ 
    headless: false,
    slowMo: 1000 // Slow down to see what's happening
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
  
  console.log('📱 Opening T-Mobile Sales Edge in Safari...');
  await page.goto('http://localhost:5173', {
    waitUntil: 'networkidle'
  });
  
  await page.waitForTimeout(2000);
  
  // Test 1: Customer Type Selection and Continue Button
  console.log('\n=== TEST 1: Customer Type & Continue Button ===');
  console.log('Clicking "No, I\'m New"...');
  
  // Try different click methods for Safari
  const newButton = await page.locator('text=No, I\'m New');
  await newButton.click({ force: true });
  await page.waitForTimeout(1000);
  
  console.log('Clicking "Standard Consumer"...');
  const consumerButton = await page.locator('text=Standard Consumer');
  await consumerButton.click({ force: true });
  await page.waitForTimeout(1000);
  
  // Check if Continue button appears and is clickable
  const continueButtons = await page.locator('button:has-text("Continue")').all();
  console.log(`Found ${continueButtons.length} Continue button(s)`);
  
  if (continueButtons.length > 0) {
    console.log('Clicking Continue button...');
    // Try clicking with JavaScript if normal click fails
    await page.evaluate(() => {
      const button = document.querySelector('button.continue-button-bottom');
      if (button) {
        console.log('Found button via JS, clicking...');
        button.click();
      } else {
        console.log('Button not found via JS');
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Check if we navigated
    const currentUrl = page.url();
    const pageContent = await page.content();
    
    if (pageContent.includes('How many')) {
      console.log('✅ SUCCESS: Continue button worked! Navigated to lines screen');
      
      // Test 2: Lines Selection with Auto-Advance
      console.log('\n=== TEST 2: Lines Selection & Auto-Advance ===');
      console.log('Clicking on 3 lines...');
      
      const threeButton = await page.locator('button:has-text("3")').first();
      await threeButton.click({ force: true });
      
      console.log('Waiting for auto-advance...');
      await page.waitForTimeout(2000);
      
      // Check if we auto-advanced
      const afterLinesContent = await page.content();
      if (afterLinesContent.includes('carrier') || afterLinesContent.includes('Verizon')) {
        console.log('✅ SUCCESS: Auto-advanced to carrier selection');
        
        // Test 3: Back Button
        console.log('\n=== TEST 3: Back Button ===');
        const backButton = await page.locator('button:has-text("Back")').first();
        if (await backButton.isVisible()) {
          console.log('Back button found, clicking...');
          await backButton.click();
          await page.waitForTimeout(1000);
          
          const afterBackContent = await page.content();
          if (afterBackContent.includes('How many')) {
            console.log('✅ SUCCESS: Back button works!');
          } else {
            console.log('❌ FAILURE: Back button did not navigate back');
          }
        } else {
          console.log('❌ FAILURE: No back button found');
        }
      } else {
        console.log('❌ FAILURE: Did not auto-advance after selecting lines');
      }
    } else {
      console.log('❌ FAILURE: Continue button did NOT work!');
      console.log('Still on:', pageContent.substring(0, 200));
    }
  } else {
    console.log('❌ FAILURE: No Continue button found!');
  }
  
  // Take screenshot
  await page.screenshot({ path: 'safari-test-result.png' });
  console.log('\n📸 Screenshot saved: safari-test-result.png');
  
  await page.waitForTimeout(3000);
  await browser.close();
  
  console.log('\n✅ Test complete!');
}

testSafariFlow().catch(console.error);