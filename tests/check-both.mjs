import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });

// Check new deployment
const page1 = await browser.newPage();
const newUrl = 'https://tmobile-optimizer-a9o0g9qae-stuart-kerrs-projects.vercel.app';
console.log(`\n1. Checking NEW deployment at ${newUrl}...`);
await page1.goto(newUrl, { waitUntil: 'networkidle' });
await page1.waitForTimeout(2000);

const heading1 = await page1.locator('h2').first().innerText().catch(() => 'No heading');
const paragraph1 = await page1.locator('p').first().innerText().catch(() => 'No paragraph');
const version1 = await page1.locator('.version-footer-compact').first().innerText().catch(() => 'No version');

console.log('First heading:', heading1);
console.log('First paragraph:', paragraph1);
console.log('Version:', version1);

if (heading1.includes('Welcome to T-Mobile') || paragraph1.includes('current T-Mobile customer')) {
  console.log('✅ NEW deployment has the CORRECT flow!');
} else {
  console.log('❌ NEW deployment has the OLD flow');
}

// Check main URL
const page2 = await browser.newPage();
const mainUrl = 'https://tmobile-optimizer.vercel.app';
console.log(`\n2. Checking MAIN URL at ${mainUrl}...`);
await page2.goto(mainUrl, { waitUntil: 'networkidle' });
await page2.waitForTimeout(2000);

const heading2 = await page2.locator('h2').first().innerText().catch(() => 'No heading');
const paragraph2 = await page2.locator('p').first().innerText().catch(() => 'No paragraph');
const version2 = await page2.locator('.version-footer-compact').first().innerText().catch(() => 'No version');

console.log('First heading:', heading2);
console.log('First paragraph:', paragraph2);
console.log('Version:', version2);

if (heading2.includes('Welcome to T-Mobile') || paragraph2.includes('current T-Mobile customer')) {
  console.log('✅ MAIN URL has the CORRECT flow!');
} else {
  console.log('❌ MAIN URL still has the OLD flow');
  console.log('\n🚨 The deployment is working but the main domain is not updated.');
}

await browser.close();