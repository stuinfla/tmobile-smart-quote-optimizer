// Test to diagnose why phone dropdowns are empty
import { chromium } from 'playwright';

const testPhoneData = async () => {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 TESTING PHONE DATA ISSUE');
  console.log('='.repeat(60));
  
  const browser = await chromium.launch({ 
    headless: false,
    devtools: true // Open DevTools to see console
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console Error:', msg.text());
    }
  });
  
  // Add logging to the page
  await page.addInitScript(() => {
    // Log when phoneData is accessed
    window.phoneDataLogged = false;
    const originalConsoleLog = console.log;
    console.log = function(...args) {
      originalConsoleLog.apply(console, args);
    };
  });
  
  try {
    await page.goto('http://localhost:4173');
    console.log('✅ Page loaded');
    
    // Click new and select 3 lines
    const newBtn = await page.$('button:has-text("New")');
    if (newBtn) await newBtn.click();
    
    await page.waitForTimeout(500);
    
    // Select 3 lines
    const threeLineBtn = await page.$('button:has-text("3 Lines"), button:has-text("3"):not(:has-text("Lines"))');
    if (threeLineBtn) {
      await threeLineBtn.click();
      console.log('✅ Selected 3 lines');
    }
    
    await page.waitForTimeout(1000);
    
    // Now we should be at phone selection
    console.log('\n📱 Checking phone selection step...');
    
    // Check if phoneData exists in the page context
    const phoneDataCheck = await page.evaluate(() => {
      // Try to access phoneData if it's in global scope
      try {
        // Check if select elements exist
        const selects = document.querySelectorAll('select');
        const options = document.querySelectorAll('select option');
        const optgroups = document.querySelectorAll('select optgroup');
        
        return {
          selectCount: selects.length,
          optionCount: options.length,
          optgroupCount: optgroups.length,
          firstSelectHTML: selects[0]?.innerHTML || 'No select found',
          hasPhoneData: typeof phoneData !== 'undefined'
        };
      } catch (e) {
        return { error: e.message };
      }
    });
    
    console.log('\n📊 Phone dropdown analysis:');
    console.log(phoneDataCheck);
    
    // Check the actual DOM structure
    const dropdownHTML = await page.evaluate(() => {
      const firstSelect = document.querySelector('select');
      if (firstSelect) {
        return {
          childNodes: firstSelect.childNodes.length,
          options: Array.from(firstSelect.options).map(opt => ({
            value: opt.value,
            text: opt.text,
            label: opt.label
          })),
          innerHTML: firstSelect.innerHTML.substring(0, 500)
        };
      }
      return null;
    });
    
    console.log('\n📝 First dropdown details:');
    console.log(dropdownHTML);
    
    // Try to check React props
    const reactCheck = await page.evaluate(() => {
      const select = document.querySelector('select');
      if (select) {
        // React 16+ uses different property names
        const reactProps = select._reactProps || select.__reactProps || select.__reactEventHandlers;
        const reactFiber = select._reactInternalFiber || select._reactInternalInstance;
        
        return {
          hasReactProps: !!reactProps,
          hasReactFiber: !!reactFiber,
          selectValue: select.value,
          selectLength: select.length
        };
      }
      return null;
    });
    
    console.log('\n⚛️ React component check:');
    console.log(reactCheck);
    
    // Check if the component is actually trying to render phoneData
    const componentSource = await page.evaluate(() => {
      // Check if there are any error boundaries or try-catch preventing render
      const errorElements = document.querySelectorAll('[class*="error"]');
      return {
        errorElements: errorElements.length,
        pageText: document.body.innerText.substring(0, 1000)
      };
    });
    
    console.log('\n📄 Component rendering check:');
    console.log('Error elements found:', componentSource.errorElements);
    
  } catch (error) {
    console.error('\n❌ Test error:', error);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Check the browser DevTools console for any errors!');
  console.log('='.repeat(60));
  
  // Keep browser open for inspection
  await page.waitForTimeout(10000);
  await browser.close();
};

testPhoneData();