import { chromium } from '@playwright/test';

async function debugTest() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 Pro
    deviceScaleFactor: 3
  });
  const page = await context.newPage();
  
  console.log('🔍 Debugging qualification screen...\n');
  
  // Navigate to the app
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(3000);
  
  // Check what's visible
  const hasContainer = await page.$('.compact-qualification-container');
  const hasContent = await page.$('.compact-content');
  const hasCard = await page.$('.question-card-compact');
  const hasGrid = await page.$('.qualification-grid-compact');
  const hasButtons = await page.$$('.qualification-btn-compact');
  const hasTitle = await page.$('.question-title-compact');
  
  console.log('DOM Elements:');
  console.log('  ✓ Container:', !!hasContainer);
  console.log('  ✓ Content area:', !!hasContent);
  console.log('  ✓ Question card:', !!hasCard);
  console.log('  ✓ Grid:', !!hasGrid);
  console.log('  ✓ Buttons:', hasButtons.length);
  console.log('  ✓ Title:', !!hasTitle);
  
  // Check visibility
  if (hasTitle) {
    const titleText = await hasTitle.textContent();
    const titleVisible = await hasTitle.isVisible();
    console.log('\nTitle:');
    console.log('  Text:', titleText);
    console.log('  Visible:', titleVisible);
  }
  
  if (hasGrid) {
    const gridVisible = await hasGrid.isVisible();
    const gridBox = await hasGrid.boundingBox();
    console.log('\nGrid:');
    console.log('  Visible:', gridVisible);
    console.log('  Bounding box:', gridBox);
  }
  
  if (hasButtons.length > 0) {
    console.log('\nButtons:');
    for (let i = 0; i < hasButtons.length; i++) {
      const btn = hasButtons[i];
      const visible = await btn.isVisible();
      const text = await btn.textContent();
      const box = await btn.boundingBox();
      console.log(`  Button ${i + 1}:`, text.trim().substring(0, 20), '| Visible:', visible, '| Position:', box?.y);
    }
  }
  
  // Check computed styles on content area
  if (hasContent) {
    const styles = await hasContent.evaluate(el => {
      const computed = window.getComputedStyle(el);
      return {
        display: computed.display,
        visibility: computed.visibility,
        opacity: computed.opacity,
        height: computed.height,
        top: computed.top,
        bottom: computed.bottom,
        overflow: computed.overflow,
        position: computed.position
      };
    });
    console.log('\nContent area styles:', styles);
  }
  
  // Take screenshot
  await page.screenshot({ path: 'screenshots/debug.png', fullPage: true });
  console.log('\n📸 Screenshot saved to screenshots/debug.png');
  
  // Wait a bit before closing
  await page.waitForTimeout(5000);
  await browser.close();
}

debugTest().catch(console.error);