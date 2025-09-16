import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

console.log('Checking https://tmobile-optimizer.vercel.app ...');

await page.goto('https://tmobile-optimizer.vercel.app', { waitUntil: 'networkidle' });

// Get the text content of the first heading and paragraph
const heading = await page.locator('h2').first().innerText().catch(() => 'No heading found');
const paragraph = await page.locator('p').first().innerText().catch(() => 'No paragraph found');

// Check for version
const versionElements = await page.locator('text=/v[0-9.]+/').all();
let version = 'Version not found';
if (versionElements.length > 0) {
  version = await versionElements[0].innerText();
}

console.log('First heading:', heading);
console.log('First paragraph:', paragraph);
console.log('Version:', version);

// Take a screenshot
await page.screenshot({ path: 'screenshots/production-check.png' });
console.log('Screenshot saved to screenshots/production-check.png');

// Check if it's the new flow or old flow
if (heading.includes('Welcome to T-Mobile') || paragraph.includes('current T-Mobile customer')) {
  console.log('✅ NEW FLOW IS LIVE!');
} else if (heading.includes('Customer Qualification')) {
  console.log('❌ OLD FLOW STILL SHOWING');
} else {
  console.log('⚠️ UNKNOWN STATE');
}

await browser.close();