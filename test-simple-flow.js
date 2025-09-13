// Simple test - select phones and click storage buttons in order
import { chromium } from 'playwright';

const testSimpleFlow = async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 SIMPLE FLOW TEST');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto('http://localhost:4173');
    
    // Step 1: New customer
    await page.click('button:has-text("New")');
    console.log('✅ Step 1: New customer');
    await page.waitForTimeout(500);
    
    // Step 2: Select 3 lines
    await page.click('button:has-text("3 Lines")');
    console.log('✅ Step 2: Selected 3 lines');
    await page.waitForTimeout(1000);
    
    // Step 3: Select phones
    const selects = await page.$$('select');
    console.log(`\n📱 Step 3: Selecting phones (found ${selects.length} dropdowns)`);
    
    // Line 1: iPhone 17 Pro Max
    if (selects[0]) {
      await selects[0].selectOption('iPhone_17_Pro_Max');
      console.log('   ✅ Line 1: iPhone 17 Pro Max');
    }
    await page.waitForTimeout(500);
    
    // Line 2: iPhone 17 Pro  
    if (selects[1]) {
      await selects[1].selectOption('iPhone_17_Pro');
      console.log('   ✅ Line 2: iPhone 17 Pro');
    }
    await page.waitForTimeout(500);
    
    // Line 3: iPhone 17 Pro
    if (selects[2]) {
      await selects[2].selectOption('iPhone_17_Pro');
      console.log('   ✅ Line 3: iPhone 17 Pro');
    }
    await page.waitForTimeout(1000);
    
    // Step 4: Select storage - just click visible storage buttons
    console.log('\n📦 Step 4: Selecting storage...');
    
    // Get all storage buttons
    let storageButtons = await page.$$('button.storage-btn:visible');
    console.log(`   Found ${storageButtons.length} visible storage buttons`);
    
    // Click storage for Line 1 (512GB - should be 2nd button)
    if (storageButtons[1]) {
      await storageButtons[1].click();
      console.log('   ✅ Line 1: Selected 512GB');
    }
    await page.waitForTimeout(500);
    
    // Re-get buttons as DOM may have changed
    storageButtons = await page.$$('button.storage-btn:visible');
    
    // Click storage for Line 2 (256GB - should be first visible after Line 1)
    if (storageButtons[3]) {
      await storageButtons[3].click();
      console.log('   ✅ Line 2: Selected 256GB');
    }
    await page.waitForTimeout(500);
    
    // Re-get buttons again
    storageButtons = await page.$$('button.storage-btn:visible');
    
    // Click storage for Line 3 (256GB)
    if (storageButtons[6]) {
      await storageButtons[6].click();
      console.log('   ✅ Line 3: Selected 256GB');
    }
    await page.waitForTimeout(1000);
    
    // Step 5: Check Continue button
    console.log('\n🔘 Step 5: Checking Continue button...');
    const continueBtn = await page.$('button:has-text("Continue")');
    if (continueBtn) {
      const isEnabled = await continueBtn.isEnabled();
      
      if (isEnabled) {
        console.log('   ✅✅✅ CONTINUE BUTTON IS ENABLED! ✅✅✅');
        console.log('\n🚀 Clicking Continue...');
        await continueBtn.click();
        await page.waitForTimeout(2000);
        
        // Check what step we reached
        const h2 = await page.$('h2');
        if (h2) {
          const stepText = await h2.textContent();
          console.log(`\n📍 Reached: "${stepText}"`);
          
          if (stepText.includes('Protection')) {
            console.log('   ✅ SUCCESS! Reached insurance step!');
            
            // Try to continue through insurance
            const skipBtn = await page.$('button:has-text("Skip")');
            if (skipBtn) {
              await skipBtn.click();
              console.log('   ✅ Skipped insurance');
              await page.waitForTimeout(1500);
              
              // Check next step
              const nextH2 = await page.$('h2');
              if (nextH2) {
                const nextText = await nextH2.textContent();
                console.log(`   📍 Next step: "${nextText}"`);
              }
            }
          }
        }
      } else {
        console.log('   ❌ Continue button is DISABLED');
        console.log('   ⚠️  Not all phones/storage selected properly');
      }
    }
    
    // Take screenshot
    await page.screenshot({ path: 'test-simple-flow.png', fullPage: true });
    console.log('\n📸 Screenshot saved: test-simple-flow.png');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Test complete');
  console.log('='.repeat(60));
  
  await page.waitForTimeout(5000);
  await browser.close();
};

testSimpleFlow();