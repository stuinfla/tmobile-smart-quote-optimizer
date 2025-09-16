import { webkit } from 'playwright';

async function testCompleteFlowToProposal() {
  console.log('🎯 TESTING COMPLETE FLOW TO PROPOSAL');
  console.log('📱 Testing phone selection interface & proposal generation\n');
  
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
    
    // Customer Type
    console.log('\n=== STEP 1: Customer Type ===');
    await page.click('text=No, I\'m New');
    await page.waitForTimeout(500);
    await page.click('text=Standard Consumer');
    await page.waitForTimeout(1500);
    
    // Lines
    console.log('\n=== STEP 2: Lines ===');
    await page.click('button:has-text("3")');
    await page.waitForTimeout(1500);
    
    // Carrier
    console.log('\n=== STEP 3: Carrier ===');
    await page.click('text=Verizon');
    await page.waitForTimeout(1500);
    
    // Check current screen and phone selection interface
    console.log('\n=== STEP 4: Phone Selection Interface Analysis ===');
    
    // Check if we're on phone selection
    const phoneSelectionVisible = await page.locator('text=Select New, text=phone, text=iPhone').first().isVisible().catch(() => false);
    console.log(`📱 On phone selection screen: ${phoneSelectionVisible}`);
    
    if (phoneSelectionVisible) {
      // Check for the problematic "six boxes in each line" interface
      const lineBoxes = await page.locator('[style*="line"], .line-container, [class*="line"]').count();
      console.log(`📦 Line containers found: ${lineBoxes}`);
      
      // Check for dropdown vs radio button approach
      const dropdowns = await page.locator('select, [role="combobox"]').count();
      const radioButtons = await page.locator('input[type="radio"], .radio-button').count();
      const gridItems = await page.locator('.grid, [style*="grid"], [class*="grid"]').count();
      
      console.log(`🔽 Dropdowns found: ${dropdowns}`);
      console.log(`🔘 Radio buttons found: ${radioButtons}`);
      console.log(`🏗️  Grid layouts found: ${gridItems}`);
      
      // Check if using efficient dropdown approach or wasteful card approach
      const phoneCards = await page.locator('.phone-card, [class*="phone-card"], [class*="device-card"]').count();
      console.log(`📋 Phone cards found: ${phoneCards}`);
      
      if (phoneCards > 10) {
        console.log('⚠️  WARNING: Still using card-based approach with many cards per line');
      } else if (dropdowns > 0) {
        console.log('✅ Good: Using dropdown approach');
      }
      
      // Try to interact with phone selection
      console.log('\n🔄 Testing phone selection interaction...');
      
      // Look for first phone selection element
      const firstPhoneOption = await page.locator('text=iPhone 17, text=iPhone 15, button:has-text("iPhone"), select option:has-text("iPhone")').first();
      if (await firstPhoneOption.isVisible()) {
        await firstPhoneOption.click();
        await page.waitForTimeout(1000);
        console.log('📱 Clicked first iPhone option');
      }
    }
    
    // Continue through flow - look for any way to advance
    console.log('\n=== STEP 5: Advancing Through Flow ===');
    
    // Check for navigation dots
    const navDots = await page.locator('[title*="Step"], .progress-dot, .nav-dot').count();
    console.log(`🔵 Navigation dots found: ${navDots}`);
    
    if (navDots > 0) {
      console.log('🔄 Trying to advance via navigation dots...');
      // Try to click the next dot
      await page.locator('[title*="Plan"], [title*="Insurance"], .progress-dot').nth(4).click().catch(() => console.log('Could not click nav dot'));
      await page.waitForTimeout(1500);
    }
    
    // Check for any auto-advance or manual advancement options
    const continueOptions = await page.locator('button:not(:disabled), [onclick], .clickable').count();
    console.log(`🖱️  Clickable elements found: ${continueOptions}`);
    
    // Try to get to results/proposal
    console.log('\n=== STEP 6: Searching for Proposal/Results ===');
    
    const proposalVisible = await page.locator('text=proposal, text=quote, text=results, text=summary').first().isVisible().catch(() => false);
    console.log(`📋 Proposal/results visible: ${proposalVisible}`);
    
    if (!proposalVisible) {
      // Try to navigate manually to find the proposal
      console.log('🔍 Manually searching for proposal...');
      
      // Check URL for any results/summary path
      const currentUrl = page.url();
      console.log(`🌐 Current URL: ${currentUrl}`);
      
      // Try clicking through all visible clickable elements to find proposal
      const allButtons = await page.locator('button:visible, [role="button"]:visible').all();
      console.log(`🔘 Found ${allButtons.length} clickable buttons`);
      
      for (let i = 0; i < Math.min(allButtons.length, 5); i++) {
        const buttonText = await allButtons[i].textContent().catch(() => '');
        console.log(`🔘 Button ${i}: "${buttonText}"`);
        
        if (buttonText.toLowerCase().includes('continue') || 
            buttonText.toLowerCase().includes('next') || 
            buttonText.toLowerCase().includes('summary') ||
            buttonText.toLowerCase().includes('quote')) {
          console.log(`🎯 Clicking promising button: "${buttonText}"`);
          await allButtons[i].click();
          await page.waitForTimeout(2000);
          
          const nowHasProposal = await page.locator('text=proposal, text=quote, text=results, text=summary').first().isVisible().catch(() => false);
          if (nowHasProposal) {
            console.log('✅ Found proposal after clicking button!');
            break;
          }
        }
      }
    }
    
    // Final check for proposal
    console.log('\n=== STEP 7: Final Proposal Analysis ===');
    
    const finalProposalCheck = await page.locator('text=proposal, text=quote, text=results, text=summary').first().isVisible().catch(() => false);
    console.log(`📋 Final proposal visible: ${finalProposalCheck}`);
    
    if (finalProposalCheck) {
      // Analyze the proposal content
      const proposalText = await page.locator('body').textContent();
      
      console.log('💰 Proposal contains pricing info:', proposalText.includes('$'));
      console.log('📱 Proposal contains phone info:', proposalText.includes('iPhone') || proposalText.includes('Galaxy'));
      console.log('📋 Proposal contains plan info:', proposalText.includes('Experience') || proposalText.includes('Unlimited'));
      console.log('💳 Proposal contains monthly payment:', proposalText.includes('/month') || proposalText.includes('monthly'));
      
      // Check for gear/settings overlap issue
      console.log('\n🔧 Checking gear icon position...');
      const gearIcon = await page.locator('.gear, .settings, [class*="gear"], [class*="settings"]').first();
      if (await gearIcon.isVisible()) {
        const gearBox = await gearIcon.boundingBox();
        console.log(`⚙️  Gear position: ${gearBox ? `${gearBox.x}, ${gearBox.y}` : 'Not found'}`);
        
        // Check if gear overlaps with bottom content
        if (gearBox && gearBox.y > 700) {
          console.log('⚠️  WARNING: Gear icon may be overlapping with bottom content');
        } else {
          console.log('✅ Gear icon position looks good');
        }
      } else {
        console.log('❌ Gear icon not found');
      }
    } else {
      console.log('❌ Could not reach proposal/results screen');
      
      // Take screenshot of where we ended up
      await page.screenshot({ path: 'stuck-flow.png' });
      console.log('📸 Screenshot saved: stuck-flow.png');
    }
    
    // Final screenshot
    await page.screenshot({ path: 'complete-flow-test.png' });
    console.log('📸 Final screenshot: complete-flow-test.png');
    
  } catch (error) {
    console.log('\n❌ FLOW TEST FAILED!');
    console.log('🚨 Error:', error.message);
    await page.screenshot({ path: 'flow-test-error.png' });
    throw error;
  } finally {
    await page.waitForTimeout(3000);
    await browser.close();
  }
}

testCompleteFlowToProposal().catch(error => {
  console.error('🚨 CRITICAL FLOW FAILURE:', error);
  process.exit(1);
});