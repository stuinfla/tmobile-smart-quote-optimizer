import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const url = 'https://tmobile-optimizer-ph6c3n9lt-stuart-kerrs-projects.vercel.app';
console.log(`Checking ${url} ...`);

await page.goto(url, { waitUntil: 'networkidle' });

// Get the text content
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

// Check if it's the new flow
if (heading.includes('Welcome to T-Mobile') || paragraph.includes('current T-Mobile customer')) {
  console.log('✅ This deployment has the NEW FLOW!');
} else if (heading.includes('Customer Qualification')) {
  console.log('❌ This deployment has the OLD FLOW');
} else {
  console.log('⚠️ Unknown state');
}

await browser.close();