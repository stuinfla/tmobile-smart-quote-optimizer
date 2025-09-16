import { chromium } from 'playwright';

const browser = await chromium.launch({ 
  headless: false,
  viewport: { width: 375, height: 667 }
});

const context = await browser.newContext({
  viewport: { width: 375, height: 667 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
  hasTouch: true,
  isMobile: true,
  bypassCSP: true
});

const page = await context.newPage();

console.log('🔍 VERIFYING LIVE PRODUCTION DEPLOYMENT');
console.log('=========================================');
console.log('URL: https://tmobile-optimizer.vercel.app');
console.log('Expected Version: 2.6.9');
console.log('');

// Force fresh load
const timestamp = Date.now();
await page.goto(`https://tmobile-optimizer.vercel.app?nocache=${timestamp}`, { 
  waitUntil: 'networkidle',
  timeout: 30000 
});
await page.waitForTimeout(3000);

// Get actual content
const heading = await page.locator('h2').first().innerText().catch(() => 'NO HEADING FOUND');
const paragraph = await page.locator('p').first().innerText().catch(() => 'NO PARAGRAPH FOUND');

// Try multiple ways to find version
let version = 'VERSION NOT FOUND';
const versionSelectors = [
  '.version-footer-compact',
  '.version-footer',
  'text=/v2\\.6\\.9/',
  'text=/2\\.6\\.9/',
  'div:has-text("v2.6")',
  'footer'
];

for (const selector of versionSelectors) {
  try {
    const element = await page.locator(selector).first();
    if (await element.isVisible()) {
      const text = await element.innerText();
      if (text.includes('2.6')) {
        version = text;
        break;
      }
    }
  } catch {}
}

console.log('📱 ACTUAL CONTENT:');
console.log('   Heading:', heading);
console.log('   Paragraph:', paragraph);
console.log('   Version:', version);
console.log('');

// Take screenshot
await page.screenshot({ path: 'screenshots/verify-live.png', fullPage: true });

// Verify results
const correctStart = heading.includes('Welcome to T-Mobile');
const correctVersion = version.includes('2.6.9');

if (correctStart && correctVersion) {
  console.log('✅ VERIFIED: Version 2.6.9 is deployed and working!');
} else {
  console.log('❌ PROBLEMS FOUND:');
  if (!correctStart) {
    console.log(`   - Wrong starting screen: "${heading}"`);
  }
  if (!correctVersion) {
    console.log(`   - Wrong version: "${version}" (should be 2.6.9)`);
  }
}

console.log('');
console.log('Keeping browser open for 15 seconds...');
await page.waitForTimeout(15000);

await browser.close();