// Test where exactly the flow breaks in production
import { chromium } from 'playwright';

const testFlowCompletion = async () => {
  console.log('\n🔍 TESTING FLOW COMPLETION - v2.4.6 Production');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 200
  });
  
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  
  const page = await context.newPage();
  
  // Track what steps we reach
  const stepsReached = [];
  
  try {
    await page.goto('https://tmobile-optimizer.vercel.app');
    await page.waitForTimeout(1000);
    
    // Step 1: New Customer
    await page.click('button:has-text("New")');
    stepsReached.push('1. Customer Type');
    await page.waitForTimeout(300);
    
    // Step 2: Lines
    await page.click('button:has-text("3 Lines")');
    stepsReached.push('2. Number of Lines');
    await page.waitForTimeout(800);
    
    // Step 3: Phones
    const selects = await page.$$('select');
    await selects[0].selectOption('iPhone_17_Pro_Max');
    await selects[1].selectOption('iPhone_17_Pro');
    await selects[2].selectOption('iPhone_17_Pro');
    
    const storage = await page.$$('button.storage-btn');
    await storage[1].click(); // 512GB
    await storage[3].click(); // 256GB
    await storage[6].click(); // 256GB
    stepsReached.push('3. Phone Selection');
    
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(800);
    
    // Step 4: Insurance
    if ((await page.content()).includes('Protection 360')) {
      stepsReached.push('4. Insurance');
      const checkboxes = await page.$$('input[type="checkbox"]');
      for (let cb of checkboxes.slice(0, 3)) {
        await cb.click();
      }
      await page.click('button:has-text("Continue")');
      await page.waitForTimeout(800);
    }
    
    // Step 5: Trade-in
    if ((await page.content()).includes('Trade-in')) {
      stepsReached.push('5. Trade-in');
      const keepBtn = await page.$('button:has-text("Keep All")');
      if (keepBtn) await keepBtn.click();
      else await page.click('button:has-text("Continue")');
      await page.waitForTimeout(800);
    }
    
    // Step 6: Accessories
    if ((await page.content()).includes('existing devices')) {
      stepsReached.push('6. Accessory Devices');
      
      // Add watch
      const watchCheckbox = await page.$('input[type="checkbox"]');
      if (watchCheckbox) await watchCheckbox.click();
      
      // Add tablets
      const tabletSelect = await page.$('select');
      if (tabletSelect) await tabletSelect.selectOption('2');
      
      await page.click('button:has-text("Continue")');
      await page.waitForTimeout(800);
    }
    
    // Step 7: Plan Selection
    if ((await page.content()).includes('Choose your plan')) {
      stepsReached.push('7. Plan Selection');
      
      // Click Experience Beyond
      const planBtn = await page.$('button:has-text("Experience Beyond")');
      if (planBtn) {
        console.log('  Clicking Experience Beyond plan...');
        await planBtn.click();
        await page.waitForTimeout(1500);
      } else {
        // Try clicking first plan
        const firstPlan = await page.$('.plan-card');
        if (firstPlan) {
          console.log('  Clicking first plan card...');
          await firstPlan.click();
          await page.waitForTimeout(1500);
        }
      }
    }
    
    // Step 8: Results
    const finalContent = await page.content();
    if (finalContent.includes('Your Optimized Deal') || 
        finalContent.includes('Monthly Total') ||
        finalContent.includes('Results')) {
      stepsReached.push('8. Results');
      
      // Try to find pricing
      const monthlyElements = await page.$$('[class*="monthly"], [class*="total"]');
      for (let elem of monthlyElements) {
        const text = await elem.textContent();
        if (text.includes('$')) {
          console.log(`  Found pricing: ${text}`);
        }
      }
    } else {
      console.log('\n❌ DID NOT REACH RESULTS!');
      console.log('Final page contains:');
      const h2 = await page.$('h2');
      if (h2) {
        console.log(`  Heading: ${await h2.textContent()}`);
      }
      const buttons = await page.$$('button');
      console.log(`  ${buttons.length} buttons found`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('STEPS REACHED:');
  stepsReached.forEach(step => console.log(`  ✅ ${step}`));
  
  if (stepsReached.length < 8) {
    console.log(`\n❌ FLOW INCOMPLETE: Only ${stepsReached.length}/8 steps`);
    console.log('Missing steps:');
    const allSteps = [
      '1. Customer Type',
      '2. Number of Lines', 
      '3. Phone Selection',
      '4. Insurance',
      '5. Trade-in',
      '6. Accessory Devices',
      '7. Plan Selection',
      '8. Results'
    ];
    allSteps.forEach(step => {
      if (!stepsReached.some(s => s.includes(step.split('.')[1].trim()))) {
        console.log(`  ❌ ${step}`);
      }
    });
  } else {
    console.log('\n✅ ALL 8 STEPS COMPLETED!');
  }
  
  console.log('='.repeat(60));
  
  // Take screenshot
  await page.screenshot({ path: 'flow-completion-test.png', fullPage: true });
  console.log('\n📸 Screenshot: flow-completion-test.png');
  
  await page.waitForTimeout(3000);
  await browser.close();
};

testFlowCompletion();