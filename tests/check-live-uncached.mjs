import { chromium } from 'playwright';

const browser = await chromium.launch({ 
  headless: false,
  viewport: { width: 375, height: 667 }
});
const page = await browser.newPage();

const timestamp = Date.now();
const url = `https://tmobile-optimizer.vercel.app?nocache=${timestamp}`;
console.log(`Checking ${url} ...`);

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// Get the text content
const heading = await page.locator('h2').first().innerText().catch(() => 'No heading found');
const paragraph = await page.locator('p').first().innerText().catch(() => 'No paragraph found');

// Check for version in footer
let version = 'Version not found';
const footerCompact = await page.locator('.version-footer-compact').first().innerText().catch(() => '');
const footerRegular = await page.locator('.version-footer').first().innerText().catch(() => '');
const versionText = await page.locator('text=/v[0-9.]+/').first().innerText().catch(() => '');

if (footerCompact) version = footerCompact;
else if (footerRegular) version = footerRegular;
else if (versionText) version = versionText;

console.log('\n📊 PRODUCTION STATUS:');
console.log('First heading:', heading);
console.log('First paragraph:', paragraph);
console.log('Version:', version);

// Take screenshot
await page.screenshot({ path: 'screenshots/live-site.png', fullPage: true });
console.log('\n📸 Screenshot saved to screenshots/live-site.png');

// Check if it's the new flow
if (heading.includes('Welcome to T-Mobile') || paragraph.includes('current T-Mobile customer')) {
  console.log('\n✅ SUCCESS: NEW FLOW IS LIVE!');
} else if (heading.includes('Customer Qualification')) {
  console.log('\n❌ PROBLEM: OLD FLOW STILL SHOWING');
  console.log('The deployment didn\'t update the main URL');
} else {
  console.log('\n⚠️ UNEXPECTED STATE');
}

console.log('\nKeeping browser open for 20 seconds for inspection...');
await page.waitForTimeout(20000);

await browser.close();