import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

async function testMobileLive() {
  console.log('🔍 Testing live mobile version with Playwright...\n');
  
  const browser = await chromium.launch({ 
    headless: false // Set to false to see the browser
  });
  
  // iPhone 14 Pro viewport
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });
  
  const page = await context.newPage();
  
  console.log('📱 Opening T-Mobile Sales Edge mobile view...');
  await page.goto('https://tmobile-optimizer.vercel.app', {
    waitUntil: 'networkidle'
  });
  
  // Wait for app to fully load
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ 
    path: 'mobile-screenshot-initial.png',
    fullPage: true 
  });
  console.log('📸 Screenshot saved: mobile-screenshot-initial.png');
  
  // Check version in footer
  const versionText = await page.textContent('.version-info').catch(() => 'Version not found');
  console.log(`\n📊 Version displayed: ${versionText}`);
  
  // Check if gear button is visible and not overlapping
  const gearButton = await page.locator('.admin-fab');
  const gearBoundingBox = await gearButton.boundingBox();
  console.log(`\n⚙️ Gear button position:`);
  console.log(`   - Bottom: ${852 - (gearBoundingBox?.y || 0) - (gearBoundingBox?.height || 0)}px from bottom`);
  console.log(`   - Right: ${393 - (gearBoundingBox?.x || 0) - (gearBoundingBox?.width || 0)}px from right`);
  
  // Check footer position
  const footer = await page.locator('.app-footer');
  const footerBoundingBox = await footer.boundingBox();
  console.log(`\n📍 Footer position:`);
  console.log(`   - Height: ${footerBoundingBox?.height}px`);
  console.log(`   - Y position: ${footerBoundingBox?.y}px`);
  
  // Check for overlap
  if (gearBoundingBox && footerBoundingBox) {
    const gearBottom = gearBoundingBox.y + gearBoundingBox.height;
    const footerTop = footerBoundingBox.y;
    const overlap = gearBottom > footerTop;
    
    if (overlap) {
      console.log(`\n❌ PROBLEM: Gear button overlaps footer by ${gearBottom - footerTop}px`);
    } else {
      console.log(`\n✅ Good: Gear button is ${footerTop - gearBottom}px above footer`);
    }
  }
  
  // Test first screen interaction
  console.log('\n🎯 Testing customer type selection...');
  
  // Click "No, I'm New" button
  await page.click('text=No, I\'m New');
  await page.waitForTimeout(1000);
  
  await page.screenshot({ 
    path: 'mobile-screenshot-step2.png',
    fullPage: true 
  });
  console.log('📸 Screenshot saved: mobile-screenshot-step2.png');
  
  // Check what screen we're on now
  const pageContent = await page.content();
  if (pageContent.includes('How many lines')) {
    console.log('✅ Successfully moved to lines selection');
  } else {
    console.log('❌ Did not advance to expected screen');
  }
  
  // Generate recommendations
  console.log('\n📋 ANALYSIS & RECOMMENDATIONS:\n');
  
  const recommendations = [];
  
  // Check version format
  if (versionText.includes('2.6.12')) {
    recommendations.push('✅ Version display is correct (shows full 2.6.12)');
  } else if (versionText.includes('2.6')) {
    recommendations.push('⚠️ Version might still be truncated - shows 2.6 instead of 2.6.12');
  }
  
  // Check gear button
  if (gearBoundingBox && footerBoundingBox) {
    const gearBottom = gearBoundingBox.y + gearBoundingBox.height;
    const footerTop = footerBoundingBox.y;
    
    if (gearBottom > footerTop) {
      recommendations.push(`🔧 Gear button STILL overlaps footer - needs to be moved up by at least ${Math.ceil(gearBottom - footerTop + 20)}px`);
      recommendations.push(`   Suggested CSS: bottom: ${100 + Math.ceil(gearBottom - footerTop + 20)}px`);
    } else if (footerTop - gearBottom < 20) {
      recommendations.push('🔧 Gear button is too close to footer - add more spacing');
    }
  }
  
  // First screen recommendations
  recommendations.push('\n🎨 UI IMPROVEMENT SUGGESTIONS:');
  recommendations.push('1. The first screen asks "Are you a current T-Mobile customer?" - this could be combined with lines selection');
  recommendations.push('2. Consider a single screen: "New or Existing Customer?" + "How many lines?" in one view');
  recommendations.push('3. The gear button could be moved to top-right corner to avoid footer entirely');
  recommendations.push('4. Add a progress indicator showing steps remaining');
  
  recommendations.forEach(rec => console.log(rec));
  
  // Save analysis to file
  const analysis = {
    timestamp: new Date().toISOString(),
    version: versionText,
    gearPosition: gearBoundingBox,
    footerPosition: footerBoundingBox,
    recommendations
  };
  
  writeFileSync('mobile-analysis.json', JSON.stringify(analysis, null, 2));
  console.log('\n📄 Full analysis saved to mobile-analysis.json');
  
  // Keep browser open for 10 seconds to observe
  console.log('\n👀 Browser will remain open for 10 seconds for observation...');
  await page.waitForTimeout(10000);
  
  await browser.close();
  console.log('\n✅ Mobile testing complete!');
}

testMobileLive().catch(console.error);