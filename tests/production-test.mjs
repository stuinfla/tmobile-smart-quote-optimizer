import { chromium } from 'playwright';
import fs from 'fs';

// Create screenshots directory
if (!fs.existsSync('screenshots/production')) {
  fs.mkdirSync('screenshots/production', { recursive: true });
}

const browser = await chromium.launch({ 
  headless: false,
  viewport: { width: 375, height: 667 }
});

const context = await browser.newContext({
  viewport: { width: 375, height: 667 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
  hasTouch: true,
  isMobile: true
});

async function testUrl(url, name) {
  console.log(`\n📱 Testing ${name}`);
  console.log(`   URL: ${url}`);
  
  const page = await context.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    const heading = await page.locator('h2').first().innerText().catch(() => 'No heading');
    const paragraph = await page.locator('p').first().innerText().catch(() => 'No paragraph');
    const version = await page.locator('.version-footer-compact').first().innerText().catch(() => 
      page.locator('text=/v[0-9.]+/').first().innerText().catch(() => 'No version')
    );
    
    console.log(`   Screen: ${heading}`);
    console.log(`   Content: ${paragraph}`);
    console.log(`   Version: ${version}`);
    
    await page.screenshot({ 
      path: `screenshots/production/${name.toLowerCase().replace(/ /g, '-')}.png`, 
      fullPage: true 
    });
    
    if (heading.includes('Welcome to T-Mobile')) {
      console.log('   ✅ CORRECT - Shows welcome screen!');
      
      // Test clicking through first step
      const newBtn = page.locator('text="No, I\'m New"').first();
      if (await newBtn.isVisible()) {
        await newBtn.click();
        await page.waitForTimeout(2000);
        const nextHeading = await page.locator('h2').first().innerText().catch(() => '');
        console.log(`   After click: ${nextHeading}`);
        
        if (nextHeading.includes('How many')) {
          console.log('   ✅ Navigation working!');
        }
      }
    } else if (heading.includes('Customer Qualification')) {
      console.log('   ❌ WRONG - Still showing old qualification screen');
    } else {
      console.log(`   ⚠️ UNEXPECTED - Showing "${heading}"`);
    }
    
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
  } finally {
    await page.close();
  }
}

console.log('🎯 PRODUCTION DEPLOYMENT TEST');
console.log('==============================');

// Test the new deployment
await testUrl(
  'https://tmobile-optimizer-hb8en18d3-stuart-kerrs-projects.vercel.app',
  'New Deployment'
);

// Test the main production URL
await testUrl(
  'https://tmobile-optimizer.vercel.app',
  'Main Production URL'
);

console.log('\n📊 SUMMARY');
console.log('===========');
console.log('Check screenshots in screenshots/production/');
console.log('Both URLs should show "Welcome to T-Mobile!" screen');

console.log('\nBrowser staying open for manual verification...');
await browser.newContext().newPage();
await page.waitForTimeout(10000);

await browser.close();