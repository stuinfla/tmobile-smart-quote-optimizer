import { chromium } from 'playwright';

const browser = await chromium.launch({ 
  headless: false,
  viewport: { width: 375, height: 667 }
});

const page = await browser.newPage();

// Listen for console messages
page.on('console', msg => {
  console.log('Console:', msg.type(), msg.text());
});

// Navigate to the app
console.log('Loading http://localhost:5173...\n');
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// Check what's visible
const heading = await page.locator('h2').first().innerText().catch(() => 'No h2');
const buttons = await page.locator('button').allTextContents();

console.log('\nVisible Elements:');
console.log('Heading:', heading);
console.log('Buttons:', buttons);

// Check if CustomerTypeSelector is in the DOM
const welcomeText = await page.locator('text="Welcome to T-Mobile"').count();
console.log('\n"Welcome to T-Mobile" found:', welcomeText, 'times');

const customerQuestion = await page.locator('text="current T-Mobile customer"').count();
console.log('"current T-Mobile customer" found:', customerQuestion, 'times');

console.log('\nKeeping browser open for inspection...');
await page.waitForTimeout(15000);

await browser.close();