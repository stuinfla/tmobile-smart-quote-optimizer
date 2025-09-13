// Test with console output visible
import { chromium } from 'playwright';

const testWithConsole = async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 TESTING WITH CONSOLE OUTPUT');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 500
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console messages from the page
  page.on('console', msg => {
    console.log(`[PAGE LOG ${msg.type()}]:`, msg.text());
  });
  
  try {
    await page.goto('http://localhost:4173');
    
    // Click New button
    const newBtn = await page.$('button:has-text("New")');
    if (newBtn) await newBtn.click();
    await page.waitForTimeout(500);
    
    // Select 3 lines - click the button directly
    console.log('\n📱 Selecting 3 lines...');
    const threeLineBtn = await page.$('button:has-text("3 Lines")');
    if (threeLineBtn) {
      await threeLineBtn.click();
      console.log('✅ Clicked 3 Lines button');
    }
    
    await page.waitForTimeout(1500);
    
    // Should now be at phone selection - wait for console logs
    console.log('\n⏳ Waiting for phone selection step...');
    await page.waitForTimeout(2000);
    
    // Check current state
    const pageContent = await page.content();
    if (pageContent.includes('Which new phones')) {
      console.log('✅ Reached phone selection step');
      
      // Check if dropdowns exist
      const dropdowns = await page.$$('select');
      console.log(`\n📊 Found ${dropdowns.length} dropdowns`);
      
      // Try to select a phone
      if (dropdowns.length > 0) {
        console.log('\n🎯 Attempting to select phone in first dropdown...');
        
        // Click to open dropdown
        await dropdowns[0].click();
        await page.waitForTimeout(500);
        
        // Try to select an option
        await dropdowns[0].selectOption('iPhone_17_Pro_Max');
        console.log('✅ Selected iPhone 17 Pro Max');
        
        await page.waitForTimeout(1000);
        
        // Check Continue button
        const continueBtn = await page.$('button:has-text("Continue")');
        if (continueBtn) {
          const isDisabled = await continueBtn.isDisabled();
          console.log(`\n🔘 Continue button disabled: ${isDisabled}`);
        }
      }
    } else {
      console.log('❌ Did not reach phone selection step');
      console.log('Page contains:', pageContent.substring(0, 500));
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Check browser console output above for React state info');
  console.log('='.repeat(60));
  
  await page.waitForTimeout(5000);
  await browser.close();
};

testWithConsole();