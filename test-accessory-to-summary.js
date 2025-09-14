// Test completing the accessory devices step to reach summary
import { chromium } from 'playwright';

const testAccessoryToSummary = async () => {
  console.log('\n🔍 TESTING ACCESSORY → SUMMARY - v2.4.7');
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
    await page.goto('https://tmobile-optimizer.vercel.app');
    await page.waitForTimeout(1000);
    
    // Quick path to accessory devices step
    await page.click('button:has-text("New")');
    await page.waitForTimeout(200);
    
    await page.click('button:has-text("3 Lines")');
    await page.waitForTimeout(600);
    
    // Select phones quickly
    const selects = await page.$$('select');
    await selects[0].selectOption('iPhone_17_Pro_Max');
    await selects[1].selectOption('iPhone_17_Pro');
    await selects[2].selectOption('iPhone_17_Pro');
    
    const storage = await page.$$('button.storage-btn');
    await storage[1].click();
    await storage[3].click();
    await storage[6].click();
    
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(600);
    
    // Skip insurance
    if ((await page.content()).includes('Protection 360')) {
      await page.click('button:has-text("Continue")');
      await page.waitForTimeout(600);
    }
    
    // Trade-in
    const keepBtn = await page.$('button:has-text("Keep All")');
    if (keepBtn) await keepBtn.click();
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(600);
    
    // Plan selection
    const planBtn = await page.$('button:has-text("Experience Beyond")');
    if (planBtn) {
      await planBtn.click();
      await page.waitForTimeout(1000);
    }
    
    // Check current step
    let currentHeading = await page.$eval('h2', el => el.textContent);
    console.log(`\nCurrent step: "${currentHeading}"`);
    
    // Handle accessory lines step
    if (currentHeading.toLowerCase().includes('accessory') && 
        !currentHeading.toLowerCase().includes('devices')) {
      console.log('At accessory lines step - configuring...');
      
      // Add a watch
      const watchCheckbox = await page.$('input[type="checkbox"]');
      if (watchCheckbox) {
        await watchCheckbox.click();
        console.log('✅ Added watch line');
      }
      
      // Add tablets
      const tabletSelect = await page.$('select');
      if (tabletSelect) {
        await tabletSelect.selectOption('2');
        console.log('✅ Added 2 tablet lines');
      }
      
      await page.click('button:has-text("Continue")');
      await page.waitForTimeout(800);
      
      currentHeading = await page.$eval('h2', el => el.textContent);
      console.log(`New step: "${currentHeading}"`);
    }
    
    // Handle accessory devices step
    if (currentHeading.toLowerCase().includes('devices')) {
      console.log('📱 At accessory devices step...');
      
      // Select "Bring My Own" for watch
      const watchByodBtn = await page.$('button:has-text("Bring My Own")');
      if (watchByodBtn) {
        await watchByodBtn.click();
        console.log('✅ Selected bring own watch');
      }
      
      // Select bring own for tablets
      const tabletButtons = await page.$$('button:has-text("Bring My Own")');
      if (tabletButtons.length > 1) {
        await tabletButtons[1].click();
        console.log('✅ Selected bring own tablet');
      }
      
      await page.waitForTimeout(500);
      
      // Check Continue button
      const continueBtn = await page.$('button:has-text("Continue")');
      if (continueBtn) {
        const isEnabled = await continueBtn.isEnabled();
        console.log(`Continue button enabled: ${isEnabled}`);
        
        if (isEnabled) {
          await continueBtn.click();
          console.log('✅ Clicked Continue');
          await page.waitForTimeout(1000);
          
          // Check final step
          const finalHeading = await page.$eval('h2', el => el.textContent).catch(() => 'No heading');
          console.log(`Final step: "${finalHeading}"`);
          
          if (finalHeading.toLowerCase().includes('savings') ||
              finalHeading.toLowerCase().includes('summary') ||
              finalHeading.toLowerCase().includes('ready')) {
            console.log('🎉 SUCCESS! Reached summary/results step!');
            
            // Look for pricing
            const summaryContent = await page.content();
            if (summaryContent.includes('Total Lines') ||
                summaryContent.includes('Quote Summary')) {
              console.log('✅ Summary content found');
              
              // Check for pricing elements
              const priceElements = await page.$$('[class*="price"], [class*="total"], [class*="cost"]');
              for (let elem of priceElements) {
                const text = await elem.textContent();
                if (text.includes('$')) {
                  console.log(`💰 Pricing found: "${text.trim()}"`);
                }
              }
            }
          } else {
            console.log(`❌ Unexpected final step: "${finalHeading}"`);
          }
        } else {
          console.log('❌ Continue button disabled - checking required fields...');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  
  await page.screenshot({ path: 'accessory-summary-test.png', fullPage: true });
  console.log('📸 Screenshot: accessory-summary-test.png');
  
  await page.waitForTimeout(3000);
  await browser.close();
};

testAccessoryToSummary();