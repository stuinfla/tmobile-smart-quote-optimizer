import { chromium } from 'playwright';
import fs from 'fs';

// Create screenshots directory
if (!fs.existsSync('screenshots/dev-test')) {
  fs.mkdirSync('screenshots/dev-test', { recursive: true });
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

const page = await context.newPage();

// Test development server
const url = 'http://localhost:5173';
console.log('🧪 Testing DEVELOPMENT server');
console.log('=============================');
console.log(`URL: ${url}`);
console.log('');

try {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  
  // Check what screen we're on
  const heading = await page.locator('h2').first().innerText().catch(() => 'No heading');
  const paragraph = await page.locator('p').first().innerText().catch(() => 'No paragraph');
  
  console.log(`Initial Screen: ${heading}`);
  console.log(`Content: ${paragraph}`);
  
  await page.screenshot({ 
    path: 'screenshots/dev-test/01-initial.png', 
    fullPage: true 
  });
  
  if (heading.includes('Welcome to T-Mobile') || paragraph.includes('current T-Mobile customer')) {
    console.log('✅ DEV SERVER CORRECT - Shows welcome screen!');
    
    // Test navigation
    const newCustomerBtn = page.locator('button:has-text("New Customer")').first();
    if (await newCustomerBtn.isVisible()) {
      await newCustomerBtn.click();
      await page.waitForTimeout(1500);
      
      const nextHeading = await page.locator('h2').first().innerText().catch(() => '');
      console.log(`After New Customer click: ${nextHeading}`);
      
      await page.screenshot({ 
        path: 'screenshots/dev-test/02-after-customer-type.png', 
        fullPage: true 
      });
      
      if (nextHeading.includes('How many lines')) {
        console.log('✅ Navigation working correctly');
        
        // Select 4 lines
        const fourLinesBtn = page.locator('button:has-text("4 Lines")').first();
        if (await fourLinesBtn.isVisible()) {
          await fourLinesBtn.click();
          await page.waitForTimeout(1500);
          console.log('Selected: 4 Lines');
          
          await page.screenshot({ 
            path: 'screenshots/dev-test/03-after-lines.png', 
            fullPage: true 
          });
        }
      }
    }
  } else if (heading.includes('Customer Qualification')) {
    console.log('❌ DEV SERVER SHOWING OLD FLOW!');
    console.log('   Still seeing Customer Qualification instead of Welcome');
    
    // Check if there's a reset button
    const newBtn = page.locator('button:has-text("New")').first();
    if (await newBtn.isVisible()) {
      console.log('   Found New button - clicking to reset...');
      await newBtn.click();
      await page.waitForTimeout(1500);
      
      const afterReset = await page.locator('h2').first().innerText().catch(() => '');
      console.log(`   After reset: ${afterReset}`);
      
      await page.screenshot({ 
        path: 'screenshots/dev-test/after-reset.png', 
        fullPage: true 
      });
    }
  } else {
    console.log(`❌ UNEXPECTED SCREEN: "${heading}"`);
  }
  
} catch (error) {
  console.log('❌ ERROR:', error.message);
  await page.screenshot({ 
    path: 'screenshots/dev-test/error.png', 
    fullPage: true 
  });
}

console.log('');
console.log('Browser staying open for 15 seconds...');
await page.waitForTimeout(15000);

await browser.close();