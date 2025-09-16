import { chromium } from '@playwright/test';

async function checkErrors() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3
  });
  const page = await context.newPage();
  
  // Listen for console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console Error:', msg.text());
    }
  });
  
  // Listen for page errors
  page.on('pageerror', error => {
    console.log('❌ Page Error:', error.message);
  });
  
  console.log('🔍 Checking for JavaScript errors...\n');
  
  // Navigate to the app
  await page.goto('http://localhost:5173');
  await page.waitForTimeout(3000);
  
  // Try to get the actual HTML being rendered
  const html = await page.evaluate(() => {
    const container = document.querySelector('.compact-qualification-container');
    if (container) {
      return container.outerHTML.substring(0, 500);
    }
    const body = document.body;
    return body.innerHTML.substring(0, 500);
  });
  
  console.log('HTML Preview:', html);
  
  // Check if React is rendering anything
  const reactRoot = await page.evaluate(() => {
    const root = document.getElementById('root');
    return {
      exists: !!root,
      childCount: root ? root.children.length : 0,
      firstChildClass: root && root.firstElementChild ? root.firstElementChild.className : 'none'
    };
  });
  
  console.log('\nReact Root:', reactRoot);
  
  await page.screenshot({ path: 'screenshots/error-check.png' });
  
  await page.waitForTimeout(2000);
  await browser.close();
}

checkErrors().catch(console.error);