import { chromium } from '@playwright/test';

async function testAllScreens() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 Pro
    deviceScaleFactor: 3
  });
  const page = await context.newPage();
  
  console.log('🚀 Starting comprehensive screen test...');
  
  // Navigate to the app
  await page.goto('http://localhost:5173');
  
  // Wait for the app to load
  await page.waitForTimeout(2000);
  
  // Take screenshot of initial screen
  await page.screenshot({ path: 'screenshots/1-initial.png', fullPage: true });
  
  // Check if qualification options are visible
  console.log('\n📱 Screen 1: Customer Qualification');
  const qualificationButtons = await page.$$('.qualification-btn-compact');
  console.log(`Found ${qualificationButtons.length} qualification buttons`);
  
  if (qualificationButtons.length === 0) {
    console.error('❌ ERROR: No qualification buttons found!');
    
    // Check what's actually on the page
    const pageContent = await page.content();
    const hasContainer = pageContent.includes('compact-qualification-container');
    const hasContent = pageContent.includes('compact-content');
    const hasButtons = pageContent.includes('qualification-btn-compact');
    
    console.log('  - Has container:', hasContainer);
    console.log('  - Has content area:', hasContent);
    console.log('  - Has button elements:', hasButtons);
    
    // Check if Continue button is visible
    const continueBtn = await page.$('.continue-btn-compact');
    if (continueBtn) {
      const isVisible = await continueBtn.isVisible();
      console.log('  - Continue button visible:', isVisible);
    }
    
    // Check computed styles
    const contentArea = await page.$('.compact-content');
    if (contentArea) {
      const styles = await contentArea.evaluate(el => {
        const computed = window.getComputedStyle(el);
        return {
          display: computed.display,
          visibility: computed.visibility,
          opacity: computed.opacity,
          height: computed.height,
          overflow: computed.overflow
        };
      });
      console.log('  - Content area styles:', styles);
    }
  } else {
    console.log('✅ Qualification buttons are visible');
    
    // Click on Standard qualification
    await qualificationButtons[0].click();
    await page.waitForTimeout(500);
    
    // Screen 2: Lines selector
    console.log('\n📱 Screen 2: Lines Selection');
    await page.screenshot({ path: 'screenshots/2-lines.png', fullPage: true });
    
    const lineButtons = await page.$$('.line-number-btn');
    console.log(`Found ${lineButtons.length} line number buttons`);
    
    if (lineButtons.length > 0) {
      await lineButtons[3].click(); // Select 4 lines
      await page.waitForTimeout(500);
    }
    
    // Continue through remaining screens
    const screens = [
      { name: 'Carrier', selector: '.carrier-btn-compact' },
      { name: 'New Phones', selector: '.phone-btn-compact' },
      { name: 'Current Phones', selector: '.phone-btn-compact' },
      { name: 'Plan', selector: '.plan-option' },
      { name: 'Insurance', selector: '.insurance-option' },
      { name: 'Summary', selector: '.summary-section' }
    ];
    
    for (let i = 0; i < screens.length; i++) {
      const screen = screens[i];
      console.log(`\n📱 Screen ${i + 3}: ${screen.name}`);
      
      await page.screenshot({ path: `screenshots/${i + 3}-${screen.name.toLowerCase()}.png`, fullPage: true });
      
      const elements = await page.$$(screen.selector);
      console.log(`Found ${elements.length} ${screen.name} elements`);
      
      // Try to click Continue if available
      const continueBtn = await page.$('.continue-btn-compact');
      if (continueBtn && await continueBtn.isEnabled()) {
        await continueBtn.click();
        await page.waitForTimeout(500);
      }
    }
  }
  
  console.log('\n📊 Test Results Summary:');
  console.log('Screenshots saved to ./screenshots/');
  
  await browser.close();
}

// Run the test
testAllScreens().catch(console.error);