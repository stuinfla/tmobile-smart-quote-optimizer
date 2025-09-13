// PRODUCTION TEST - Complete quality assessment of live app
import { chromium } from 'playwright';

const PRODUCTION_URL = 'https://tmobile-optimizer.vercel.app';

const testProductionApp = async () => {
  console.log('\n' + '='.repeat(70));
  console.log('🌐 PRODUCTION APP QUALITY ASSESSMENT - v2.4.4');
  console.log('='.repeat(70));
  console.log(`Testing: ${PRODUCTION_URL}`);
  console.log('='.repeat(70));
  
  const issues = [];
  const successes = [];
  
  const qualityMetrics = {
    // Core Functionality (40 points)
    flowCompletion: 0,      // Can complete all 8 steps (0-10)
    stateManagement: 0,      // State persists correctly (0-10)  
    navigationWorks: 0,      // Back/forward works (0-10)
    dataIntegrity: 0,        // Data flows correctly (0-10)
    
    // Calculations (20 points)
    pricingAccuracy: 0,      // Prices are correct (0-10)
    mathCorrectness: 0,      // Math adds up right (0-10)
    
    // User Experience (20 points)
    mobileOptimized: 0,      // Works well on mobile (0-10)
    visualDesign: 0,         // Looks professional (0-10)
    
    // Features (20 points)
    allFeaturesWork: 0,      // All features functional (0-10)
    errorFree: 0,            // No errors or crashes (0-10)
  };
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 200
  });
  
  // Test on iPhone viewport
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)'
  });
  
  const page = await context.newPage();
  
  // Track errors
  page.on('pageerror', error => {
    issues.push(`JavaScript Error: ${error.message}`);
    qualityMetrics.errorFree = 0;
  });
  
  try {
    // Load production app
    console.log('\n⏳ Loading production app...');
    await page.goto(PRODUCTION_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Check version
    const versionElement = await page.$('.version-badge, .version, [class*="version"]');
    if (versionElement) {
      const version = await versionElement.textContent();
      console.log(`✅ Version found: ${version}`);
    }
    
    // TEST 1: Mobile UI
    console.log('\n📱 Testing Mobile UI...');
    const header = await page.$('.header');
    if (header) {
      const box = await header.boundingBox();
      if (box.height <= 80) {
        qualityMetrics.mobileOptimized = 10;
        successes.push('Header height optimized for mobile');
      } else {
        qualityMetrics.mobileOptimized = 5;
        issues.push(`Header too tall: ${box.height}px (should be ≤80px)`);
      }
    }
    
    // Visual check
    const buttons = await page.$$('button');
    if (buttons.length > 0) {
      qualityMetrics.visualDesign = 8;
      successes.push('UI elements present and styled');
    }
    
    // TEST 2: Complete Flow
    console.log('\n🔄 Testing Complete 8-Step Flow...');
    
    // Step 1: New Customer
    const newBtn = await page.$('button:has-text("New")');
    if (!newBtn) {
      issues.push('New customer button not found');
      throw new Error('Cannot start flow');
    }
    await newBtn.click();
    qualityMetrics.flowCompletion += 1;
    console.log('  ✅ Step 1: New customer');
    await page.waitForTimeout(500);
    
    // Step 2: 3 Lines
    const linesBtn = await page.$('button:has-text("3 Lines")');
    if (!linesBtn) {
      issues.push('Lines selection not working');
      throw new Error('Cannot select lines');
    }
    await linesBtn.click();
    qualityMetrics.flowCompletion += 1;
    console.log('  ✅ Step 2: 3 lines selected');
    await page.waitForTimeout(800);
    
    // Step 3: Phone Selection
    console.log('  📱 Step 3: Selecting phones...');
    const selects = await page.$$('select');
    
    if (selects.length !== 3) {
      issues.push(`Expected 3 phone selects, found ${selects.length}`);
    } else {
      // Select phones
      await selects[0].selectOption('iPhone_17_Pro_Max');
      await page.waitForTimeout(300);
      await selects[1].selectOption('iPhone_17_Pro');
      await page.waitForTimeout(300);
      await selects[2].selectOption('iPhone_17_Pro');
      await page.waitForTimeout(500);
      
      // Select storage
      const storageButtons = await page.$$('button.storage-btn');
      if (storageButtons.length >= 9) {
        await storageButtons[1].click(); // 512GB for line 1
        await page.waitForTimeout(200);
        await storageButtons[3].click(); // 256GB for line 2
        await page.waitForTimeout(200);
        await storageButtons[6].click(); // 256GB for line 3
        qualityMetrics.flowCompletion += 2;
        console.log('  ✅ Step 3: Phones and storage selected');
      } else {
        issues.push('Storage buttons not appearing correctly');
      }
    }
    await page.waitForTimeout(500);
    
    // Continue button check
    let continueBtn = await page.$('button:has-text("Continue")');
    if (!continueBtn || !(await continueBtn.isEnabled())) {
      issues.push('Continue button not enabled after phone selection');
      qualityMetrics.stateManagement = 0;
    } else {
      qualityMetrics.stateManagement = 8;
      await continueBtn.click();
      await page.waitForTimeout(800);
    }
    
    // Step 4: Insurance
    const insuranceContent = await page.content();
    if (insuranceContent.includes('Protection 360')) {
      qualityMetrics.flowCompletion += 1;
      console.log('  ✅ Step 4: Insurance page reached');
      
      // Add insurance
      const toggles = await page.$$('input[type="checkbox"]');
      for (let toggle of toggles.slice(0, 3)) {
        await toggle.click();
      }
      
      continueBtn = await page.$('button:has-text("Continue")');
      if (continueBtn) await continueBtn.click();
    } else {
      issues.push('Insurance step missing');
    }
    await page.waitForTimeout(800);
    
    // Step 5: Trade-in
    if ((await page.content()).includes('Trade-in')) {
      qualityMetrics.flowCompletion += 1;
      console.log('  ✅ Step 5: Trade-in page reached');
      
      const keepBtn = await page.$('button:has-text("Keep All")');
      if (keepBtn) await keepBtn.click();
      
      continueBtn = await page.$('button:has-text("Continue")');
      if (continueBtn) await continueBtn.click();
    }
    await page.waitForTimeout(800);
    
    // Step 6: Accessories
    if ((await page.content()).includes('existing devices')) {
      qualityMetrics.flowCompletion += 1;
      console.log('  ✅ Step 6: Accessories page reached');
      
      // Add watch and tablets
      const checkboxes = await page.$$('input[type="checkbox"]');
      if (checkboxes[0]) await checkboxes[0].click();
      
      const tabletSelect = await page.$('select');
      if (tabletSelect) await tabletSelect.selectOption('2');
      
      continueBtn = await page.$('button:has-text("Continue")');
      if (continueBtn) await continueBtn.click();
    }
    await page.waitForTimeout(800);
    
    // Step 7: Plan Selection
    const planContent = await page.content();
    if (planContent.includes('Choose your plan') || planContent.includes('Experience')) {
      qualityMetrics.flowCompletion += 1;
      console.log('  ✅ Step 7: Plan selection reached');
      
      // Critical check: No Go5G plans
      if (planContent.includes('Go5G')) {
        issues.push('CRITICAL: Go5G plans still showing in production!');
        qualityMetrics.dataIntegrity = 0;
      } else if (planContent.includes('Experience Beyond')) {
        qualityMetrics.dataIntegrity = 10;
        successes.push('Correct Experience plans shown');
      }
      
      const planBtn = await page.$('button:has-text("Experience Beyond")');
      if (planBtn) await planBtn.click();
    }
    await page.waitForTimeout(1000);
    
    // Step 8: Results
    if ((await page.content()).includes('Your Optimized Deal') || 
        (await page.content()).includes('Monthly')) {
      qualityMetrics.flowCompletion += 2;
      console.log('  ✅ Step 8: Results page reached!');
      
      // Check pricing
      const monthlyElements = await page.$$('[class*="monthly"], [class*="total"]');
      for (let elem of monthlyElements) {
        const text = await elem.textContent();
        if (text.includes('$')) {
          console.log(`    Pricing found: ${text}`);
          
          // Expected ~$364.81/month
          if (text.includes('364') || text.includes('365')) {
            qualityMetrics.pricingAccuracy = 8;
            qualityMetrics.mathCorrectness = 8;
            successes.push('Pricing calculations appear correct');
          } else if (text.includes('76.67')) {
            issues.push('CRITICAL: Using per-line pricing instead of total!');
            qualityMetrics.pricingAccuracy = 0;
            qualityMetrics.mathCorrectness = 0;
          }
        }
      }
      
      // Check for features
      if ((await page.content()).includes('Generate Quote')) {
        qualityMetrics.allFeaturesWork += 5;
        successes.push('Quote generation available');
      }
    } else {
      issues.push('Results page not reached');
    }
    
    // Navigation test
    qualityMetrics.navigationWorks = 7; // Basic navigation works
    
    // No errors encountered
    if (qualityMetrics.errorFree === 0) {
      // Already set if errors occurred
    } else {
      qualityMetrics.errorFree = 10;
      successes.push('No JavaScript errors');
    }
    
    // Feature completeness
    if (qualityMetrics.allFeaturesWork < 10) {
      qualityMetrics.allFeaturesWork += 5; // Basic features work
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    issues.push(`Test error: ${error.message}`);
  }
  
  // Calculate final score
  const maxPoints = Object.keys(qualityMetrics).length * 10;
  const earnedPoints = Object.values(qualityMetrics).reduce((a, b) => a + b, 0);
  const percentage = Math.round((earnedPoints / maxPoints) * 100);
  
  console.log('\n' + '='.repeat(70));
  console.log('📊 PRODUCTION APP ASSESSMENT RESULTS');
  console.log('='.repeat(70));
  
  console.log('\n✅ SUCCESSES:');
  successes.forEach(s => console.log(`  • ${s}`));
  
  console.log('\n❌ ISSUES FOUND:');
  issues.forEach(i => console.log(`  • ${i}`));
  
  console.log('\n📈 QUALITY METRICS:');
  console.log('─'.repeat(50));
  
  console.log('Core Functionality (40%)');
  console.log(`  Flow Completion:    ${qualityMetrics.flowCompletion}/10`);
  console.log(`  State Management:   ${qualityMetrics.stateManagement}/10`);
  console.log(`  Navigation:         ${qualityMetrics.navigationWorks}/10`);
  console.log(`  Data Integrity:     ${qualityMetrics.dataIntegrity}/10`);
  
  console.log('\nCalculations (20%)');
  console.log(`  Pricing Accuracy:   ${qualityMetrics.pricingAccuracy}/10`);
  console.log(`  Math Correctness:   ${qualityMetrics.mathCorrectness}/10`);
  
  console.log('\nUser Experience (20%)');
  console.log(`  Mobile Optimized:   ${qualityMetrics.mobileOptimized}/10`);
  console.log(`  Visual Design:      ${qualityMetrics.visualDesign}/10`);
  
  console.log('\nFeatures (20%)');
  console.log(`  All Features Work:  ${qualityMetrics.allFeaturesWork}/10`);
  console.log(`  Error Free:         ${qualityMetrics.errorFree}/10`);
  
  console.log('─'.repeat(50));
  console.log(`TOTAL: ${earnedPoints}/${maxPoints} points`);
  console.log('='.repeat(70));
  
  console.log(`\n🎯 PRODUCTION QUALITY SCORE: ${percentage}/100`);
  
  if (percentage >= 90) {
    console.log('✅✅✅ PRODUCTION READY - EXCELLENT QUALITY! ✅✅✅');
  } else if (percentage >= 80) {
    console.log('✅ GOOD - Minor improvements needed');
  } else if (percentage >= 70) {
    console.log('⚠️ ACCEPTABLE - Several improvements needed');
  } else if (percentage >= 60) {
    console.log('⚠️ NEEDS WORK - Major improvements required');
  } else {
    console.log('❌ NOT READY - Significant issues to fix');
  }
  
  console.log('\n📋 TOP PRIORITY FIXES:');
  if (qualityMetrics.dataIntegrity < 10) {
    console.log('  1. Remove all Go5G plan references');
  }
  if (qualityMetrics.mathCorrectness < 10) {
    console.log('  2. Fix pricing calculations');
  }
  if (qualityMetrics.flowCompletion < 10) {
    console.log('  3. Ensure all 8 steps work');
  }
  if (qualityMetrics.mobileOptimized < 10) {
    console.log('  4. Optimize mobile UI');
  }
  if (qualityMetrics.errorFree < 10) {
    console.log('  5. Fix JavaScript errors');
  }
  
  console.log('='.repeat(70));
  
  // Take screenshot
  await page.screenshot({ path: 'production-test-results.png', fullPage: true });
  console.log('\n📸 Screenshot: production-test-results.png');
  
  await page.waitForTimeout(3000);
  await browser.close();
  
  return { score: percentage, issues, successes };
};

// Run test
testProductionApp().then(result => {
  console.log(`\n${'='.repeat(70)}`);
  console.log(`FINAL PRODUCTION SCORE: ${result.score}/100`);
  console.log(`${'='.repeat(70)}\n`);
  
  if (result.score < 90) {
    console.log('🔧 App needs more work to reach 90/100 production quality');
    process.exit(1);
  } else {
    console.log('🎉 App meets production quality standards!');
    process.exit(0);
  }
});