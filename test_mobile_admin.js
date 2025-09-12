const { chromium } = require('playwright');

async function testMobileAdminPromotions() {
    console.log('🔄 Testing T-Mobile Admin Panel Promotions in Mobile Mode...');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
        viewport: { width: 375, height: 667 }, // iPhone SE size
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15'
    });
    
    const page = await context.newPage();
    
    try {
        // Navigate to the app
        console.log('📱 Loading app...');
        await page.goto('https://tmobile-optimizer.vercel.app');
        await page.waitForLoadState('networkidle');
        console.log('✅ App loaded successfully');
        
        // Look for admin access - try triple tap on logo
        const logo = page.locator('.logo-section').first();
        if (await logo.count() > 0) {
            console.log('🔄 Trying triple-tap on logo for admin access...');
            await logo.click({ clickCount: 3 });
            await page.waitForTimeout(2000);
        }
        
        // Check for admin panel or password prompt
        let passwordInput = page.locator('input[type="password"]').first();
        if (await passwordInput.count() > 0) {
            console.log('🔐 Admin login found, entering password...');
            await passwordInput.fill('admin123');
            
            // Try to find and click login button or press Enter
            const loginBtn = page.locator('button:has-text("Login"), button:has-text("Enter")').first();
            if (await loginBtn.count() > 0) {
                await loginBtn.click();
            } else {
                await passwordInput.press('Enter');
            }
            await page.waitForTimeout(2000);
        } else {
            console.log('⚠️ No admin login found, checking for direct admin access...');
        }
        
        // Look for promotions tab
        const promotionsTab = page.locator('button:has-text("Promotions"), button:has-text("💰")').first();
        if (await promotionsTab.count() > 0) {
            console.log('✅ Admin panel accessed - found Promotions tab');
            console.log('🔄 Testing Promotions tab click...');
            
            // Click promotions tab
            await promotionsTab.click();
            await page.waitForTimeout(3000);
            
            // Check if promotions content loads
            const uploadSection = page.locator('.upload-section, .promotions-management').first();
            if (await uploadSection.count() > 0) {
                console.log('✅ Promotions tab loaded successfully!');
                
                // Check for upload functionality
                const fileInputs = await page.locator('input[type="file"]').count();
                console.log(`✅ Found ${fileInputs} file upload input(s)`);
                
                const uploadZones = await page.locator('.upload-dropzone').count();
                console.log(`✅ Found ${uploadZones} upload dropzone(s)`);
                
                // Check for manual promotion form
                const manualForm = page.locator('.manual-promotion').first();
                if (await manualForm.count() > 0) {
                    console.log('✅ Manual promotion form found');
                    console.log('🔄 Testing manual promotion creation...');
                    
                    // Fill in promotion details
                    const nameInput = page.locator('input[placeholder*="Name"]').first();
                    if (await nameInput.count() > 0) {
                        await nameInput.fill('Mobile Test Promotion');
                        console.log('✅ Promotion name entered');
                    }
                    
                    const valueInput = page.locator('input[placeholder*="Value"]').first();
                    if (await valueInput.count() > 0) {
                        await valueInput.fill('250');
                        console.log('✅ Promotion value entered');
                    }
                    
                    const descInput = page.locator('textarea[placeholder*="Description"]').first();
                    if (await descInput.count() > 0) {
                        await descInput.fill('Test promotion created from mobile admin panel');
                        console.log('✅ Promotion description entered');
                    }
                    
                    // Try to add the promotion
                    const addBtn = page.locator('button:has-text("Add Promotion")').first();
                    if (await addBtn.count() > 0) {
                        await addBtn.click();
                        await page.waitForTimeout(2000);
                        console.log('✅ Add promotion button clicked');
                        
                        // Check if promotion was added
                        const promotionCards = await page.locator('.promotion-card').count();
                        console.log(`✅ Found ${promotionCards} promotion card(s) after adding`);
                    }
                }
                
                console.log('✅ Promotions functionality is working in mobile mode!');
                return true;
                
            } else {
                console.log('❌ Promotions tab content did not load - possible freeze issue');
                // Take screenshot for debugging
                await page.screenshot({ path: 'promotions_issue.png' });
                return false;
            }
            
        } else {
            console.log('❌ Could not find Promotions tab - admin panel may not be accessible');
            // Take screenshot for debugging  
            await page.screenshot({ path: 'admin_access_issue.png' });
            return false;
        }
        
    } catch (error) {
        console.log(`❌ Error during testing: ${error.message}`);
        await page.screenshot({ path: 'test_error.png' });
        return false;
    } finally {
        await browser.close();
    }
}

// Run the test
testMobileAdminPromotions().then(success => {
    console.log(success ? '\n✅ MOBILE ADMIN TEST PASSED' : '\n❌ MOBILE ADMIN TEST FAILED');
    process.exit(success ? 0 : 1);
});
