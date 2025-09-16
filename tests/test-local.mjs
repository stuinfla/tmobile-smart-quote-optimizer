import { chromium } from 'playwright';

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

// Test local preview
const url = 'http://localhost:4173';
console.log('🧪 Testing LOCAL preview build');
console.log('==============================');
console.log(`URL: ${url}`);
console.log('');

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// Check what screen we're on
const heading = await page.locator('h2').first().innerText().catch(() => 'No heading');
const paragraph = await page.locator('p').first().innerText().catch(() => 'No paragraph');

console.log(`Screen: ${heading}`);
console.log(`Content: ${paragraph}`);

// Take screenshot
await page.screenshot({ 
  path: 'screenshots/local-test.png', 
  fullPage: true 
});

if (heading.includes('Welcome to T-Mobile') || paragraph.includes('current T-Mobile customer')) {
  console.log('✅ LOCAL BUILD IS CORRECT - Shows welcome screen!');
  
  // Test clicking through a few steps
  const newCustomerBtn = page.locator('button:has-text("New Customer")').first();
  if (await newCustomerBtn.isVisible()) {
    await newCustomerBtn.click();
    await page.waitForTimeout(1500);
    
    const nextHeading = await page.locator('h2').first().innerText().catch(() => '');
    console.log(`After click: ${nextHeading}`);
    
    if (nextHeading.includes('How many lines')) {
      console.log('✅ Navigation working correctly');
    }
  }
} else {
  console.log('❌ LOCAL BUILD IS BROKEN!');
  console.log(`   Showing: "${heading}"`);
}

console.log('');
console.log('Browser staying open for inspection...');
await page.waitForTimeout(10000);

await browser.close();