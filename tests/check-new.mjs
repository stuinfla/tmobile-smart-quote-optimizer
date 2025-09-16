import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const url = 'https://tmobile-optimizer-1lgb4tyig-stuart-kerrs-projects.vercel.app';
console.log(`Checking NEW deployment at ${url} ...`);

await page.goto(url, { waitUntil: 'networkidle' });

// Get the text content
const heading = await page.locator('h2').first().innerText().catch(() => 'No heading');
const paragraph = await page.locator('p').first().innerText().catch(() => 'No paragraph');
const version = await page.locator('.version-footer-compact').first().innerText().catch(() => 'No version');

console.log('First heading:', heading);
console.log('First paragraph:', paragraph);
console.log('Version:', version);

if (heading.includes('Welcome to T-Mobile') || paragraph.includes('current T-Mobile customer')) {
  console.log('✅ NEW deployment has the CORRECT flow!');
  console.log('\n🚨 BUT the main URL (tmobile-optimizer.vercel.app) is still showing old version!');
  console.log('The deployment worked but the main domain is not updated.');
} else {
  console.log('❌ Even the new deployment has the OLD flow');
}

await browser.close();