import { test, expect } from '@playwright/test';

test('debug app loading issues', async ({ page }) => {
  // Capture console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text()
    });
    if (msg.type() === 'error') {
      console.log(`❌ Console Error: ${msg.text()}`);
    }
  });
  
  // Capture page errors
  page.on('pageerror', error => {
    console.log(`❌ Page Error: ${error.message}`);
  });
  
  // Navigate to the app
  console.log('📱 Loading app...');
  const response = await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
  console.log(`  Response status: ${response.status()}`);
  
  // Wait a bit for JavaScript to execute
  await page.waitForTimeout(3000);
  
  // Check if the root element has content
  const rootContent = await page.locator('#root').innerHTML();
  console.log(`  Root element has content: ${rootContent.length > 0 ? 'Yes' : 'No'}`);
  
  if (rootContent.length > 0) {
    console.log(`  Root content length: ${rootContent.length} characters`);
  } else {
    console.log('  ⚠️  Root element is empty!');
  }
  
  // Check for any visible text
  const bodyText = await page.locator('body').textContent();
  console.log(`  Page has text: ${bodyText.trim().length > 0 ? 'Yes' : 'No'}`);
  
  if (bodyText.trim().length > 0) {
    console.log(`  First 100 chars: "${bodyText.trim().substring(0, 100)}..."`);
  }
  
  // Look for specific elements
  const hasHeader = await page.locator('.header, header').count();
  console.log(`  Header element found: ${hasHeader > 0 ? 'Yes' : 'No'}`);
  
  const hasMain = await page.locator('.main-container, main').count();
  console.log(`  Main element found: ${hasMain > 0 ? 'Yes' : 'No'}`);
  
  const hasQuestion = await page.locator('.question-text, .question-card').count();
  console.log(`  Question element found: ${hasQuestion > 0 ? 'Yes' : 'No'}`);
  
  // Print all console messages
  if (consoleMessages.length > 0) {
    console.log('\n📋 Console Messages:');
    consoleMessages.forEach(msg => {
      console.log(`  [${msg.type}] ${msg.text}`);
    });
  }
  
  // Take screenshot
  await page.screenshot({ path: 'debug-screenshot.png', fullPage: true });
  console.log('  Screenshot saved as debug-screenshot.png');
  
  // Check for React errors
  const reactError = await page.locator('text=/error|failed|cannot|undefined/i').count();
  if (reactError > 0) {
    console.log(`  ⚠️  Found ${reactError} error-related text elements`);
  }
  
  // Try to interact with the page
  console.log('\n🔍 Checking interactivity...');
  const clickableElements = await page.locator('button, a, input, select').count();
  console.log(`  Found ${clickableElements} clickable elements`);
  
  if (clickableElements > 0) {
    const firstButton = await page.locator('button').first();
    const buttonText = await firstButton.textContent().catch(() => 'N/A');
    console.log(`  First button text: "${buttonText}"`);
  }
});