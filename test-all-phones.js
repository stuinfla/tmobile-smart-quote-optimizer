// Test selecting all phones and storage properly
import { chromium } from 'playwright';

const testAllPhones = async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 TESTING ALL PHONE SELECTIONS');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 200
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Can continue?') || text.includes('Updated device:')) {
      console.log(`[STATE]:`, text);
    }
  });
  
  try {
    await page.goto('http://localhost:4173');
    
    // Click New
    await page.click('button:has-text("New")');
    await page.waitForTimeout(300);
    
    // Select 3 lines
    await page.click('button:has-text("3 Lines")');
    console.log('✅ Selected 3 lines');
    await page.waitForTimeout(800);
    
    // Get all select elements
    const selects = await page.$$('select');
    console.log(`\n📱 Found ${selects.length} phone dropdowns`);
    
    // Select phones for each line
    for (let i = 0; i < selects.length && i < 3; i++) {
      console.log(`\n🔄 Configuring Line ${i + 1}...`);
      
      // Select phone
      const phoneModel = i === 0 ? 'iPhone_17_Pro_Max' : 'iPhone_17_Pro';
      await selects[i].selectOption(phoneModel);
      console.log(`   ✅ Selected ${phoneModel}`);
      await page.waitForTimeout(400);
      
      // Wait for storage buttons to appear
      await page.waitForSelector('button.storage-btn', { timeout: 2000 });
      
      // Get all visible storage buttons
      const allStorageButtons = await page.$$('button.storage-btn');
      console.log(`   📦 Found ${allStorageButtons.length} total storage buttons`);
      
      // Find which storage buttons belong to this line
      // Each phone typically has 2-3 storage options
      let clicked = false;
      for (let j = 0; j < allStorageButtons.length; j++) {
        const btn = allStorageButtons[j];
        const isVisible = await btn.isVisible();
        
        if (isVisible) {
          // Check if this button is for the current line
          const parent = await btn.evaluateHandle(el => el.closest('.device-card'));
          const parentIndex = await page.evaluate((card, allCards) => {
            const cards = document.querySelectorAll('.device-card');
            for (let k = 0; k < cards.length; k++) {
              if (cards[k] === card) return k;
            }
            return -1;
          }, parent, null);
          
          if (parentIndex === i && !clicked) {
            const storageText = await btn.textContent();
            await btn.click();
            console.log(`   ✅ Selected storage: ${storageText.trim()}`);
            clicked = true;
            await page.waitForTimeout(300);
            break;
          }
        }
      }
      
      if (!clicked) {
        console.log(`   ⚠️ Could not find storage button for Line ${i + 1}`);
      }
    }
    
    await page.waitForTimeout(800);
    
    // Check Continue button
    const continueBtn = await page.$('button:has-text("Continue")');
    if (continueBtn) {
      const isEnabled = await continueBtn.isEnabled();
      console.log('\n' + '='.repeat(40));
      console.log('🔘 CONTINUE BUTTON STATUS:');
      console.log(`   Enabled: ${isEnabled ? '✅ YES' : '❌ NO'}`);
      console.log('='.repeat(40));
      
      if (isEnabled) {
        console.log('\n🎉 SUCCESS! Clicking Continue...');
        await continueBtn.click();
        await page.waitForTimeout(1500);
        
        // Check next step
        const pageContent = await page.content();
        if (pageContent.includes('Protection 360')) {
          console.log('✅ SUCCESSFULLY REACHED INSURANCE STEP!');
        } else if (pageContent.includes('Trade-in')) {
          console.log('✅ Reached trade-in step!');
        } else if (pageContent.includes('Choose your plan')) {
          console.log('✅ Reached plan selection!');
        } else {
          const heading = await page.$('h2');
          if (heading) {
            const text = await heading.textContent();
            console.log(`📍 Reached step: ${text}`);
          }
        }
      }
    }
    
    // Take screenshot
    await page.screenshot({ path: 'test-all-phones.png', fullPage: true });
    console.log('\n📸 Screenshot saved: test-all-phones.png');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Test complete');
  console.log('='.repeat(60));
  
  await page.waitForTimeout(5000);
  await browser.close();
};

testAllPhones();