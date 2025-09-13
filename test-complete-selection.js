// Test complete phone AND storage selection
import { chromium } from 'playwright';

const testCompleteSelection = async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 TESTING COMPLETE PHONE + STORAGE SELECTION');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    if (msg.text().includes('Can continue?')) {
      console.log(`[CONTINUE CHECK]:`, msg.text());
    }
  });
  
  try {
    await page.goto('http://localhost:4173');
    
    // Click New
    await page.click('button:has-text("New")');
    await page.waitForTimeout(500);
    
    // Select 3 lines
    await page.click('button:has-text("3 Lines")');
    console.log('✅ Selected 3 lines');
    await page.waitForTimeout(1000);
    
    // Now select phones AND storage for each line
    console.log('\n📱 Selecting phones and storage...');
    
    // Line 1: iPhone 17 Pro Max
    const select1 = await page.$('select:nth-of-type(1)');
    if (select1) {
      await select1.selectOption('iPhone_17_Pro_Max');
      console.log('✅ Line 1: Selected iPhone 17 Pro Max');
      await page.waitForTimeout(500);
      
      // Click 512GB storage button
      const storage1 = await page.$('.device-card:nth-of-type(1) button.storage-btn:has-text("512GB")');
      if (storage1) {
        await storage1.click();
        console.log('✅ Line 1: Selected 512GB storage');
      } else {
        // Try alternative selector
        const allStorageButtons = await page.$$('button.storage-btn');
        if (allStorageButtons[1]) {
          await allStorageButtons[1].click();
          console.log('✅ Line 1: Selected storage (button 2)');
        }
      }
    }
    
    await page.waitForTimeout(500);
    
    // Line 2: iPhone 17 Pro
    const select2 = await page.$('select:nth-of-type(2)');
    if (select2) {
      await select2.selectOption('iPhone_17_Pro');
      console.log('✅ Line 2: Selected iPhone 17 Pro');
      await page.waitForTimeout(500);
      
      // Click 256GB storage button
      const allStorageButtons = await page.$$('button.storage-btn');
      // Find the first storage button for Line 2 (should be around index 3-5)
      for (let i = 3; i < allStorageButtons.length && i < 6; i++) {
        const isVisible = await allStorageButtons[i].isVisible();
        if (isVisible) {
          await allStorageButtons[i].click();
          console.log(`✅ Line 2: Selected storage (button ${i + 1})`);
          break;
        }
      }
    }
    
    await page.waitForTimeout(500);
    
    // Line 3: iPhone 17 Pro
    const select3 = await page.$('select:nth-of-type(3)');
    if (select3) {
      await select3.selectOption('iPhone_17_Pro');
      console.log('✅ Line 3: Selected iPhone 17 Pro');
      await page.waitForTimeout(500);
      
      // Click 256GB storage button
      const allStorageButtons = await page.$$('button.storage-btn');
      // Find the first storage button for Line 3 (should be around index 6-8)
      for (let i = 6; i < allStorageButtons.length && i < 9; i++) {
        const isVisible = await allStorageButtons[i].isVisible();
        if (isVisible) {
          await allStorageButtons[i].click();
          console.log(`✅ Line 3: Selected storage (button ${i + 1})`);
          break;
        }
      }
    }
    
    await page.waitForTimeout(1000);
    
    // Check Continue button status
    const continueBtn = await page.$('button:has-text("Continue")');
    if (continueBtn) {
      const isDisabled = await continueBtn.isDisabled();
      const isEnabled = await continueBtn.isEnabled();
      console.log('\n🔘 Continue button status:');
      console.log(`   Disabled: ${isDisabled}`);
      console.log(`   Enabled: ${isEnabled}`);
      
      if (isEnabled) {
        console.log('✅ SUCCESS! Continue button is ENABLED!');
        console.log('🚀 Clicking Continue...');
        await continueBtn.click();
        await page.waitForTimeout(1500);
        
        // Check what step we reached
        const pageContent = await page.content();
        if (pageContent.includes('Protection 360')) {
          console.log('✅ REACHED INSURANCE STEP!');
        } else if (pageContent.includes('Trade-in')) {
          console.log('✅ Reached trade-in step!');
        } else if (pageContent.includes('existing devices')) {
          console.log('✅ Reached accessory devices step!');
        } else {
          console.log('📍 Reached next step');
        }
      } else {
        console.log('❌ Continue button is still disabled');
        console.log('⚠️ All phones and storage must be selected');
      }
    }
    
    // Take screenshot
    await page.screenshot({ path: 'test-complete-selection.png' });
    console.log('\n📸 Screenshot saved: test-complete-selection.png');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Test complete - checking if proper selection enables Continue');
  console.log('='.repeat(60));
  
  await page.waitForTimeout(5000);
  await browser.close();
};

testCompleteSelection();