// Test why Continue button is disabled despite dropdowns working
import { chromium } from 'playwright';

const testContinueButton = async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 TESTING CONTINUE BUTTON ISSUE');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    await page.goto('http://localhost:4173');
    
    // Get to phone selection
    const newBtn = await page.$('button:has-text("New")');
    if (newBtn) await newBtn.click();
    await page.waitForTimeout(500);
    
    // Select 3 lines
    await page.click('button:has-text("3 Lines")');
    console.log('✅ Selected 3 lines');
    await page.waitForTimeout(1000);
    
    // Now at phone selection - select phones AND storage
    console.log('\n📱 Selecting phones...');
    
    // Get all selects
    const selects = await page.$$('select');
    console.log(`Found ${selects.length} select elements`);
    
    // Phone 1: Select phone
    if (selects[0]) {
      await selects[0].selectOption('iPhone_17_Pro_Max');
      console.log('✅ Selected iPhone 17 Pro Max for Line 1');
      await page.waitForTimeout(500);
      
      // Now storage buttons should appear - click one
      const storageBtn = await page.$('button.storage-btn:has-text("512GB")');
      if (storageBtn) {
        await storageBtn.click();
        console.log('✅ Selected 512GB storage');
      } else {
        // Try first storage button
        const firstStorage = await page.$('button.storage-btn');
        if (firstStorage) {
          await firstStorage.click();
          console.log('✅ Selected first storage option');
        }
      }
    }
    
    await page.waitForTimeout(500);
    
    // Phone 2: Select phone
    if (selects[1]) {
      await selects[1].selectOption('iPhone_17_Pro');
      console.log('✅ Selected iPhone 17 Pro for Line 2');
      await page.waitForTimeout(500);
      
      // Select storage for phone 2
      const storageButtons = await page.$$('button.storage-btn');
      if (storageButtons[2]) {
        await storageButtons[2].click();
        console.log('✅ Selected storage for Line 2');
      }
    }
    
    await page.waitForTimeout(500);
    
    // Phone 3: Select phone
    if (selects[2]) {
      await selects[2].selectOption('iPhone_17_Pro');
      console.log('✅ Selected iPhone 17 Pro for Line 3');
      await page.waitForTimeout(500);
      
      // Select storage for phone 3
      const storageButtons = await page.$$('button.storage-btn');
      if (storageButtons[4]) {
        await storageButtons[4].click();
        console.log('✅ Selected storage for Line 3');
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
        console.log('✅ Continue button is ENABLED! Clicking it...');
        await continueBtn.click();
        await page.waitForTimeout(1000);
        
        // Check what step we're on now
        const pageContent = await page.content();
        if (pageContent.includes('Protection 360') || pageContent.includes('insurance')) {
          console.log('✅ SUCCESSFULLY REACHED INSURANCE STEP!');
        } else if (pageContent.includes('Trade-in')) {
          console.log('✅ Reached trade-in step');
        } else {
          console.log('📍 Reached next step');
        }
      } else {
        console.log('❌ Continue button is still disabled');
        
        // Check what's missing
        const deviceData = await page.evaluate(() => {
          // Try to access customerData if it's in React context
          const devices = window.customerData?.devices || [];
          return devices.map((d, i) => ({
            line: i + 1,
            newPhone: d.newPhone || 'not selected',
            storage: d.storage || 'not selected'
          }));
        });
        
        console.log('\n📊 Device selection status:');
        console.log(deviceData);
      }
    } else {
      console.log('❌ No Continue button found');
    }
    
    // Take screenshot of current state
    await page.screenshot({ path: 'test-continue-state.png' });
    console.log('\n📸 Screenshot saved: test-continue-state.png');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Test complete - check if we can proceed past phone selection');
  console.log('='.repeat(60));
  
  await page.waitForTimeout(5000);
  await browser.close();
};

testContinueButton();