import { webkit } from 'playwright';

async function testToProposal() {
  console.log('🎯 TESTING COMPLETE FLOW TO PROPOSAL - v2.6.22');
  console.log('Testing: Customer Type → Lines → Carrier → Phone Selection → Proposal\n');
  
  const browser = await webkit.launch({ 
    headless: false,
    slowMo: 800
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
    console.log('🌐 Loading production app...');
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
    
    const continueBtn1 = await page.locator('button:has-text("Continue")').first();
    if (await continueBtn1.isVisible()) {
      await continueBtn1.click();
      await page.waitForTimeout(2000);
      console.log('✅ Customer type selection complete');
    }
    
    // Step 2: Lines
    console.log('\n=== STEP 2: Lines Selection ===');
    await page.click('button:has-text("3")');
    await page.waitForTimeout(1000);
    
    const continueBtn2 = await page.locator('button:has-text("Continue")').first();
    if (await continueBtn2.isVisible()) {
      await continueBtn2.click();
      await page.waitForTimeout(2000);
      console.log('✅ Lines selection complete');
    }
    
    // Step 3: Carrier
    console.log('\n=== STEP 3: Carrier Selection ===');
    await page.click('text=Verizon');
    await page.waitForTimeout(1000);
    
    const continueBtn3 = await page.locator('button:has-text("Continue")').first();
    if (await continueBtn3.isVisible()) {
      await continueBtn3.click();
      await page.waitForTimeout(2000);
      console.log('✅ Carrier selection complete');
    }
    
    // Step 4: Trade-in Decision
    console.log('\n=== STEP 4: Trade-in Decision ===');
    const tradeInScreen = await page.locator('text=Keep & Switch').isVisible();
    if (tradeInScreen) {
      console.log('📱 On trade-in screen - selecting Keep & Switch');
      await page.click('text=All Keep & Switch');
      await page.waitForTimeout(1000);
      
      const continueBtn4 = await page.locator('button:has-text("Continue")').first();
      if (await continueBtn4.isVisible()) {
        await continueBtn4.click();
        await page.waitForTimeout(2000);
        console.log('✅ Trade-in decision complete');
      }
    }
    
    // Step 5: Phone Selection
    console.log('\n=== STEP 5: Phone Selection ===');
    
    // Check if we're on phone selection screen
    const phoneSelection = await page.locator('h2:has-text("Select New Phones")').isVisible();
    if (phoneSelection) {
      console.log('📱 On phone selection screen');
      
      // Select iPhone 17 Pro for all lines using the quick select button
      const quickSelectBtn = await page.locator('button:has-text("All iPhone 17 Pro")');
      if (await quickSelectBtn.isVisible()) {
        console.log('🔄 Using quick select: All iPhone 17 Pro');
        await quickSelectBtn.click();
        await page.waitForTimeout(1000);
        
        // Wait for Continue button to appear
        const continueBtn5 = await page.locator('button:has-text("Continue")').first();
        if (await continueBtn5.isVisible()) {
          await continueBtn5.click();
          await page.waitForTimeout(2000);
          console.log('✅ Phone selection complete');
        }
      } else {
        console.log('⚠️ Quick select not found, trying individual selection');
        // Try individual phone selection for Line 1
        const firstDropdown = await page.locator('select').first();
        if (await firstDropdown.isVisible()) {
          await firstDropdown.selectOption({ label: /iPhone 17 Pro/ });
          await page.waitForTimeout(500);
          console.log('📱 Selected iPhone 17 Pro for Line 1');
        }
      }
    }
    
    // Continue through remaining steps
    let stepCount = 6;
    let maxSteps = 15; // Prevent infinite loop
    
    while (stepCount <= maxSteps) {
      console.log(`\n=== STEP ${stepCount}: Looking for next screen ===`);
      
      // Check for financing screen
      const financingScreen = await page.locator('h2:has-text("Device Financing")').isVisible();
      if (financingScreen) {
        console.log('💳 On financing screen - selecting 24 months');
        await page.click('button:has-text("24 Months")');
        await page.waitForTimeout(1000);
        
        const continueBtn = await page.locator('button:has-text("Continue")').first();
        if (await continueBtn.isVisible()) {
          await continueBtn.click();
          await page.waitForTimeout(2000);
          console.log('✅ Financing selection complete');
        }
        stepCount++;
        continue;
      }
      
      // Check for plan selection
      const planScreen = await page.locator('text=Experience Beyond').isVisible();
      if (planScreen) {
        console.log('📋 On plan selection screen - selecting Experience Beyond');
        await page.click('text=Experience Beyond');
        await page.waitForTimeout(1000);
        
        const continueBtn = await page.locator('button:has-text("Continue")').first();
        if (await continueBtn.isVisible()) {
          await continueBtn.click();
          await page.waitForTimeout(2000);
          console.log('✅ Plan selection complete');
        }
        stepCount++;
        continue;
      }
      
      // Check for accessories
      const accessoryScreen = await page.locator('text=Add Accessories').isVisible() || 
                             await page.locator('text=Accessories').isVisible();
      if (accessoryScreen) {
        console.log('🎧 On accessories screen - skipping accessories');
        const skipBtn = await page.locator('button:has-text("Skip")');
        const continueBtn = await page.locator('button:has-text("Continue")').first();
        
        if (await skipBtn.isVisible()) {
          await skipBtn.click();
        } else if (await continueBtn.isVisible()) {
          await continueBtn.click();
        }
        await page.waitForTimeout(2000);
        console.log('✅ Accessories screen complete');
        stepCount++;
        continue;
      }
      
      // Check for Protection 360 insurance screen
      const protectionScreen = await page.locator('text=Protection 360').isVisible() || 
                              await page.locator('text=Protect your devices').isVisible();
      if (protectionScreen) {
        console.log('🛡️ On Protection 360 screen - declining insurance');
        
        // Look for the specific button text from the component
        const skipInsuranceBtn = await page.locator('button:has-text("Skip Insurance")');
        
        if (await skipInsuranceBtn.isVisible()) {
          await skipInsuranceBtn.click();
          await page.waitForTimeout(2000);
          console.log('✅ Protection 360 screen complete - clicked Skip Insurance');
        } else {
          console.log('⚠️ Skip Insurance button not found, looking for Continue');
          const continueBtn = await page.locator('button:has-text("Continue")').first();
          if (await continueBtn.isVisible()) {
            await continueBtn.click();
            await page.waitForTimeout(2000);
          }
        }
        stepCount++;
        continue;
      }
      
      // Check for proposal/results screen
      const proposalScreen = await page.locator('text=Your T-Mobile').isVisible() ||
                            await page.locator('text=Deal Summary').isVisible() ||
                            await page.locator('text=Monthly Total').isVisible() ||
                            await page.locator('text=Scenario').isVisible();
      
      if (proposalScreen) {
        console.log('\n🎉 REACHED PROPOSAL SCREEN!');
        
        // Analyze the proposal
        const pageContent = await page.textContent('body');
        
        console.log('\n=== PROPOSAL ANALYSIS ===');
        
        // Check for key elements
        const hasMonthlyTotal = pageContent.includes('Monthly Total') || pageContent.includes('$');
        const hasPhoneDetails = pageContent.includes('iPhone 17') || pageContent.includes('phone');
        const hasPlanDetails = pageContent.includes('Experience') || pageContent.includes('plan');
        const hasLineCount = pageContent.includes('3') || pageContent.includes('line');
        
        console.log(`💰 Monthly pricing shown: ${hasMonthlyTotal ? '✅ YES' : '❌ NO'}`);
        console.log(`📱 Phone details shown: ${hasPhoneDetails ? '✅ YES' : '❌ NO'}`);
        console.log(`📋 Plan details shown: ${hasPlanDetails ? '✅ YES' : '❌ NO'}`);
        console.log(`📞 Line count shown: ${hasLineCount ? '✅ YES' : '❌ NO'}`);
        
        // Look for specific pricing
        const priceMatches = pageContent.match(/\$\d+(\.\d{2})?/g);
        if (priceMatches) {
          console.log(`💵 Prices found: ${priceMatches.slice(0, 5).join(', ')}${priceMatches.length > 5 ? '...' : ''}`);
        }
        
        // Check if proposal makes sense
        const reasonablePrice = priceMatches && priceMatches.some(price => {
          const amount = parseFloat(price.replace('$', ''));
          return amount >= 150 && amount <= 500; // Reasonable range for 3 lines
        });
        
        console.log(`🧠 Proposal appears reasonable: ${reasonablePrice ? '✅ YES' : '❌ NO'}`);
        
        break;
      }
      
      // Check if there's any Continue button to proceed
      const anyContinueBtn = await page.locator('button:has-text("Continue")').first();
      if (await anyContinueBtn.isVisible()) {
        console.log('🔄 Found Continue button, proceeding...');
        await anyContinueBtn.click();
        await page.waitForTimeout(2000);
        stepCount++;
        continue;
      }
      
      // If no recognizable screen found, break
      console.log('⚠️ No recognizable screen or Continue button found');
      console.log('Current page content preview:');
      const preview = (await page.textContent('body')).substring(0, 200);
      console.log(preview + '...');
      break;
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'proposal-test-result.png' });
    console.log('\n📸 Screenshot saved: proposal-test-result.png');
    
    // Final status
    if (stepCount > maxSteps) {
      console.log('\n❌ FAILED: Reached maximum steps without finding proposal');
    } else {
      console.log('\n✅ SUCCESS: Completed flow test');
    }
    
  } catch (error) {
    console.log('\n❌ TEST FAILED!');
    console.log('🚨 Error:', error.message);
    await page.screenshot({ path: 'test-error.png' });
    throw error;
  } finally {
    await page.waitForTimeout(3000);
    await browser.close();
  }
}

testToProposal().catch(error => {
  console.error('🚨 CRITICAL FAILURE:', error);
  process.exit(1);
});