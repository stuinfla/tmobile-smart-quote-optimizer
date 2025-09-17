import { webkit } from 'playwright';

async function debugTradeIn() {
  console.log('🔍 DEBUGGING TRADE-IN SCREEN\n');
  
  const browser = await webkit.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto(`https://tmobile-optimizer.vercel.app?v=${Date.now()}`, {
      waitUntil: 'networkidle'
    });
    
    // Navigate to trade-in
    await page.click('text=No, I\'m New');
    await page.click('text=Standard Consumer');
    await page.click('button:has-text("Continue")');
    
    await page.click('button:has-text("3")');
    await page.click('button:has-text("Continue")');
    
    await page.click('text=Verizon');
    await page.click('button:has-text("Continue")');
    
    await page.waitForTimeout(2000);
    
    // Now on trade-in screen - see what's there
    console.log('On trade-in screen. Looking for buttons...\n');
    
    const pageContent = await page.textContent('body');
    console.log('Page contains:', pageContent.substring(0, 500));
    
    // Look for any buttons
    const buttons = await page.locator('button').all();
    console.log(`\nFound ${buttons.length} buttons:`);
    
    for (let i = 0; i < buttons.length; i++) {
      const text = await buttons[i].textContent();
      console.log(`Button ${i}: "${text.trim()}"`);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'tradein-screen.png' });
    console.log('\n📸 Screenshot saved: tradein-screen.png');
    
  } catch (error) {
    console.log('Error:', error.message);
  } finally {
    await page.waitForTimeout(5000);
    await browser.close();
  }
}

debugTradeIn().catch(console.error);