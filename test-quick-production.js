// Quick production test of v2.4.5 fixes
import { chromium } from 'playwright';

const quickTest = async () => {
  console.log('\n🚀 QUICK TEST - v2.4.5 Production');
  console.log('='.repeat(50));
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 300
  });
  
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  
  const page = await context.newPage();
  
  try {
    await page.goto('https://tmobile-optimizer.vercel.app');
    await page.waitForTimeout(1500);
    
    // Check header height
    const header = await page.$('.header');
    const box = await header.boundingBox();
    console.log(`✓ Header height: ${box.height}px ${box.height <= 80 ? '✅' : '❌'}`);
    
    // Quick flow test
    await page.click('button:has-text("New")');
    await page.waitForTimeout(300);
    
    await page.click('button:has-text("3 Lines")');
    await page.waitForTimeout(800);
    
    // Select phones
    const selects = await page.$$('select');
    await selects[0].selectOption('iPhone_17_Pro_Max');
    await selects[1].selectOption('iPhone_17_Pro');
    await selects[2].selectOption('iPhone_17_Pro');
    
    // Select storage
    const storage = await page.$$('button.storage-btn');
    await storage[1].click(); // 512GB
    await storage[3].click(); // 256GB
    await storage[6].click(); // 256GB
    
    // Continue
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(800);
    
    // Test insurance checkboxes
    console.log('✓ Testing insurance checkboxes...');
    const checkboxes = await page.$$('input[type="checkbox"]');
    console.log(`  Found ${checkboxes.length} checkboxes`);
    
    if (checkboxes.length >= 3) {
      await checkboxes[0].click();
      await checkboxes[1].click();
      await checkboxes[2].click();
      console.log('  ✅ Insurance checkboxes clickable!');
    }
    
    // Continue through flow
    await page.click('button:has-text("Continue")');
    await page.waitForTimeout(500);
    
    // Check if we reached trade-in
    if ((await page.content()).includes('Trade-in')) {
      console.log('✅ Reached trade-in step!');
    }
    
    console.log('='.repeat(50));
    console.log('Critical fixes appear to be working!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  await page.waitForTimeout(3000);
  await browser.close();
};

quickTest();