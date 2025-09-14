// Test CRITICAL pricing fix in v2.4.8 - Should show $230 TOTAL not $76.67/line
import { chromium } from 'playwright';

const testPricingFix = async () => {
  console.log('\n🔍 TESTING PRICING FIX - v2.4.8');
  console.log('='.repeat(50));
  console.log('CRITICAL: 3 lines should show $230 TOTAL, not $76.67 per line');
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
  });
  
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  
  const page = await context.newPage();
  
  try {
    // Force cache refresh
    await page.goto('https://tmobile-optimizer.vercel.app', { 
      waitUntil: 'networkidle',
      timeout: 10000
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Test 1: Line selection pricing
    console.log('\n📋 Testing Line Selection Pricing:');
    await page.click('button:has-text("New")');
    await page.waitForTimeout(500);
    
    // Check 3 line pricing
    const threeLinesBtn = await page.$('button:has-text("3 Lines")');
    if (threeLinesBtn) {
      const priceText = await threeLinesBtn.textContent();
      console.log(`3 Lines button text: "${priceText}"`);
      
      if (priceText.includes('230')) {
        console.log('✅ SUCCESS: Shows $230 total for 3 lines');
      } else if (priceText.includes('76')) {
        console.log('❌ FAILED: Still shows $76.67 per line!');
      } else {
        console.log('⚠️ UNKNOWN: Unexpected pricing format');
      }
    }
    
    // Click 3 lines and continue
    await page.click('button:has-text("3 Lines")');
    await page.waitForTimeout(1000);
    
    // Test 2: Plan selection pricing  
    console.log('\n📋 Testing Plan Selection Pricing:');
    
    // Quick skip to plan selection
    const selects = await page.$$('select');
    if (selects.length >= 3) {
      await selects[0].selectOption('iPhone_17_Pro_Max');
      await selects[1].selectOption('iPhone_17_Pro');
      await selects[2].selectOption('iPhone_17_Pro');
      
      const storage = await page.$$('button.storage-btn');
      if (storage.length >= 7) {
        await storage[1].click(); // 512GB
        await storage[3].click(); // 256GB  
        await storage[6].click(); // 256GB
      }
      
      await page.click('button:has-text("Continue")');
      await page.waitForTimeout(800);
      
      // Skip insurance if present
      if ((await page.content()).includes('Protection 360')) {
        await page.click('button:has-text("Continue")');
        await page.waitForTimeout(800);
      }
      
      // Skip trade-in
      const keepBtn = await page.$('button:has-text("Keep All")');
      if (keepBtn) await keepBtn.click();
      await page.click('button:has-text("Continue")');
      await page.waitForTimeout(800);
      
      // Now check plan pricing
      const experienceBeyondCard = await page.$('.plan-card:has-text("Experience Beyond")');
      if (experienceBeyondCard) {
        const cardText = await experienceBeyondCard.textContent();
        console.log(`Experience Beyond card text: "${cardText}"`);
        
        if (cardText.includes('$230')) {
          console.log('✅ SUCCESS: Plan shows $230 total for 3 lines');
        } else if (cardText.includes('$76')) {
          console.log('❌ FAILED: Plan still shows $76.67 per line!');
        } else {
          console.log('⚠️ CHECKING: Need to look closer at plan pricing');
          
          const priceElement = await experienceBeyondCard.$('.price-amount');
          if (priceElement) {
            const priceValue = await priceElement.textContent();
            console.log(`Price element value: "${priceValue}"`);
            
            if (priceValue.includes('230')) {
              console.log('✅ SUCCESS: Price element shows $230');
            } else if (priceValue.includes('76')) {
              console.log('❌ FAILED: Price element still shows $76.67');
            } else {
              console.log(`❓ UNEXPECTED: Price value is "${priceValue}"`);
            }
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  
  await page.screenshot({ path: 'pricing-fix-test-v248.png', fullPage: true });
  console.log('📸 Screenshot: pricing-fix-test-v248.png');
  
  await page.waitForTimeout(3000);
  await browser.close();
};

testPricingFix();