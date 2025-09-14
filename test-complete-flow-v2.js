// Test complete flow from plan selection to results - v2.4.7
import { chromium } from 'playwright';

const testCompleteFlow = async () => {
  console.log('\n🔍 TESTING COMPLETE FLOW - v2.4.7 Production');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 200
  });
  
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto('https://tmobile-optimizer.vercel.app');
    await page.waitForTimeout(1000);
    
    console.log('🚀 Starting complete 8-step flow...\n');
    
    // Step 1: Customer Type
    await page.click('button:has-text("New")');
    console.log('✅ Step 1: New customer');
    await page.waitForTimeout(300);
    
    // Step 2: Lines  
    await page.click('button:has-text("3 Lines")');
    console.log('✅ Step 2: 3 lines selected');
    await page.waitForTimeout(800);
    
    // Step 3: Phone Selection
    const selects = await page.$$('select');
    await selects[0].selectOption('iPhone_17_Pro_Max');
    await selects[1].selectOption('iPhone_17_Pro');
    await selects[2].selectOption('iPhone_17_Pro');
    
    const storage = await page.$$('button.storage-btn');
    await storage[1].click(); // 512GB
    await storage[3].click(); // 256GB  
    await storage[6].click(); // 256GB
    
    await page.click('button:has-text("Continue")');
    console.log('✅ Step 3: Phones selected');
    await page.waitForTimeout(800);
    
    // Step 4: Insurance
    if ((await page.content()).includes('Protection 360')) {
      const checkboxes = await page.$$('input[type="checkbox"]');
      for (let cb of checkboxes.slice(0, 3)) {
        await cb.click();
      }
      await page.click('button:has-text("Continue")');
      console.log('✅ Step 4: Insurance added');
      await page.waitForTimeout(800);
    }
    
    // Step 5: Trade-in (we know this works)
    const keepBtn = await page.$('button:has-text("Keep All")');
    if (keepBtn) await keepBtn.click();
    await page.click('button:has-text("Continue")');
    console.log('✅ Step 5: Trade-in selected');
    await page.waitForTimeout(800);
    
    // Step 6: Accessory Lines? (might be skipped)
    let currentHeading = await page.$eval('h2', el => el.textContent);
    console.log(`Current step: "${currentHeading}"`);
    
    if (currentHeading.toLowerCase().includes('accessory') || 
        currentHeading.toLowerCase().includes('lines')) {
      console.log('📱 At accessory lines step...');
      // Skip or configure accessories
      const continueBtn = await page.$('button:has-text("Continue")');
      if (continueBtn && await continueBtn.isEnabled()) {
        await continueBtn.click();
        await page.waitForTimeout(800);
        currentHeading = await page.$eval('h2', el => el.textContent);
      }
    }
    
    if (currentHeading.toLowerCase().includes('devices')) {
      console.log('📱 At accessory devices step...');
      // Add devices
      const watchCheckbox = await page.$('input[type="checkbox"]');
      if (watchCheckbox) await watchCheckbox.click();
      
      const tabletSelect = await page.$('select');
      if (tabletSelect) await tabletSelect.selectOption('2');
      
      const continueBtn = await page.$('button:has-text("Continue")');
      if (continueBtn) await continueBtn.click();
      await page.waitForTimeout(800);
      currentHeading = await page.$eval('h2', el => el.textContent);
    }
    
    // Step 7: Plan Selection
    if (currentHeading.toLowerCase().includes('plan')) {
      console.log('✅ Step 6/7: At plan selection');
      
      // Check for Go5G references (critical test)
      const pageContent = await page.content();
      if (pageContent.includes('Go5G')) {
        console.log('❌ CRITICAL: Go5G plans still showing!');
      } else {
        console.log('✅ No Go5G plans (good)');
      }
      
      // Select Experience Beyond
      const planBtn = await page.$('button:has-text("Experience Beyond")');
      if (planBtn) {
        await planBtn.click();
        console.log('✅ Selected Experience Beyond plan');
        await page.waitForTimeout(1500);
      } else {
        // Try first plan button
        const firstPlan = await page.$('.plan-card');
        if (firstPlan) {
          await firstPlan.click();
          await page.waitForTimeout(1500);
        }
      }
    }
    
    // Step 8: Results/Summary
    await page.waitForTimeout(1000);
    const finalContent = await page.content();
    const finalHeading = await page.$eval('h2', el => el.textContent).catch(() => 'No heading');
    
    console.log(`\nFinal step: "${finalHeading}"`);
    
    if (finalContent.includes('Your Optimized Deal') ||
        finalContent.includes('Monthly Total') ||
        finalContent.includes('Results') ||
        finalHeading.toLowerCase().includes('summary')) {
      
      console.log('🎉 SUCCESS! Reached results/summary step!');
      
      // Check for pricing display
      const monthlyElements = await page.$$('[class*="monthly"], [class*="total"], .price');
      let foundPricing = false;
      
      for (let elem of monthlyElements) {
        const text = await elem.textContent();
        if (text.includes('$') && text.match(/\d+/)) {
          console.log(`💰 Found pricing: "${text.trim()}"`);
          foundPricing = true;
          
          // Check if it's the wrong per-line pricing
          if (text.includes('76.67') || text.includes('$76')) {
            console.log('❌ CRITICAL: Still using per-line pricing!');
          } else if (text.includes('230') || text.includes('364')) {
            console.log('✅ Pricing looks correct!');
          }
        }
      }
      
      if (!foundPricing) {
        console.log('⚠️ No pricing display found');
      }
      
    } else {
      console.log(`❌ Did not reach results. Final step: "${finalHeading}"`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  
  await page.screenshot({ path: 'complete-flow-test.png', fullPage: true });
  console.log('📸 Screenshot: complete-flow-test.png');
  
  await page.waitForTimeout(3000);
  await browser.close();
};

testCompleteFlow();