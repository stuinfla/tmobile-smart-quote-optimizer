// Test the trade-in step specifically to see Continue button state
import { chromium } from 'playwright';

const testTradeInStep = async () => {
  console.log('\n🔍 TESTING TRADE-IN STEP - v2.4.7');
  console.log('='.repeat(50));
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
  });
  
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  
  const page = await context.newPage();
  
  try {
    // Force reload to get latest version
    await page.goto('https://tmobile-optimizer.vercel.app', { 
      waitUntil: 'networkidle',
      timeout: 10000
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    
    // Get to trade-in step
    await page.click('button:has-text("New")');
    await page.waitForTimeout(300);
    
    await page.click('button:has-text("3 Lines")');
    await page.waitForTimeout(800);
    
    // Select phones and storage
    const selects = await page.$$('select');
    await selects[0].selectOption('iPhone_17_Pro_Max');
    await selects[1].selectOption('iPhone_17_Pro');
    await selects[2].selectOption('iPhone_17_Pro');
    
    const storage = await page.$$('button.storage-btn');
    await storage[1].click();
    await storage[3].click();
    await storage[6].click();
    
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(800);
    
    // Skip insurance or add it
    if ((await page.content()).includes('Protection 360')) {
      console.log('At insurance step - continuing...');
      await page.click('button:has-text("Continue")');
      await page.waitForTimeout(800);
    }
    
    // Now at trade-in step
    console.log('\n📱 At Trade-in Step...');
    const heading = await page.$('h2');
    if (heading) {
      console.log(`Heading: ${await heading.textContent()}`);
    }
    
    // Check initial Continue button state
    const continueBtn = await page.$('button:has-text("Continue")');
    if (continueBtn) {
      const isDisabled = await continueBtn.isDisabled();
      console.log(`Continue button disabled initially: ${isDisabled}`);
    }
    
    // Click "Keep All Phones" button
    console.log('\nClicking "Keep All Phones"...');
    const keepBtn = await page.$('button:has-text("Keep All")');
    if (keepBtn) {
      await keepBtn.click();
      console.log('✅ Clicked Keep All Phones button');
      await page.waitForTimeout(500);
      
      // Check Continue button state after selection
      if (continueBtn) {
        const isDisabledAfter = await continueBtn.isDisabled();
        console.log(`Continue button disabled after selection: ${isDisabledAfter}`);
        
        if (!isDisabledAfter) {
          console.log('🎉 Continue button is ENABLED! Clicking...');
          await continueBtn.click();
          await page.waitForTimeout(1500);
          
          // Check what step we reached
          const newHeading = await page.$('h2');
          if (newHeading) {
            const newText = await newHeading.textContent();
            console.log(`New heading: ${newText}`);
            
            if (newText.includes('accessory') || newText.includes('devices')) {
              console.log('✅ SUCCESS! Reached accessory devices step!');
            } else if (newText.includes('plan')) {
              console.log('✅ SUCCESS! Reached plan selection step!');
            } else {
              console.log(`📍 Reached: ${newText}`);
            }
          }
        } else {
          console.log('❌ Continue button still disabled after selection');
          
          // Check device states
          const deviceStates = await page.evaluate(() => {
            // Try to access React state
            const selects = document.querySelectorAll('select');
            return Array.from(selects).map((sel, i) => ({
              line: i + 1,
              value: sel.value,
              options: sel.options.length
            }));
          });
          console.log('Device states:', deviceStates);
        }
      }
    } else {
      console.log('❌ Keep All Phones button not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  
  await page.screenshot({ path: 'trade-in-test.png' });
  console.log('📸 Screenshot: trade-in-test.png');
  
  await page.waitForTimeout(3000);
  await browser.close();
};

testTradeInStep();