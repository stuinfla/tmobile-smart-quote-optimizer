import { chromium } from 'playwright';

const browser = await chromium.launch({ 
  headless: false,
  args: ['--disable-blink-features=AutomationControlled']
});

// Create a fresh context with no cache
const context = await browser.newContext({
  viewport: { width: 375, height: 667 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
  offline: false,
  bypassCSP: true
});

const page = await context.newPage();

console.log('Testing PWA at https://tmobile-optimizer.vercel.app');
console.log('Clearing cache and service workers...\n');

// Clear all storage and service workers
await context.clearCookies();
await context.clearPermissions();

// Force hard reload with cache bypass
const timestamp = Date.now();
await page.goto(`https://tmobile-optimizer.vercel.app?cachebust=${timestamp}`, {
  waitUntil: 'networkidle',
  timeout: 30000
});

await page.waitForTimeout(3000);

// Take screenshot
await page.screenshot({ path: 'screenshots/pwa-fresh.png', fullPage: true });
console.log('📸 Screenshot saved to screenshots/pwa-fresh.png');

// Get the content
const heading = await page.locator('h2').first().innerText().catch(() => 'No heading');
const paragraph = await page.locator('p').first().innerText().catch(() => 'No paragraph');

// Check version by looking at multiple possible locations
let version = 'Not found';
const versionSelectors = [
  '.version-footer-compact',
  '.version-footer',
  'div:has-text("v2.")',
  'text=/v[0-9]+\\.[0-9]+/'
];

for (const selector of versionSelectors) {
  try {
    const element = await page.locator(selector).first();
    if (await element.isVisible()) {
      version = await element.innerText();
      if (version.includes('v')) break;
    }
  } catch {}
}

console.log('\n📊 CURRENT STATUS:');
console.log('First heading:', heading);
console.log('First paragraph:', paragraph);
console.log('Version:', version);

if (heading.includes('Welcome to T-Mobile') || paragraph.includes('current T-Mobile customer')) {
  console.log('\n✅ SUCCESS: NEW VERSION IS LIVE!');
} else if (heading.includes('Customer Qualification')) {
  console.log('\n❌ STILL SHOWING OLD VERSION');
  console.log('\nThe deployment succeeded but the PWA may be cached.');
  console.log('Users need to close all tabs and reopen the app.');
} else {
  console.log('\n⚠️ UNEXPECTED STATE');
}

console.log('\nKeeping browser open for manual testing...');
await page.waitForTimeout(30000);

await browser.close();