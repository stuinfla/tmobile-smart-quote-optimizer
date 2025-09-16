# MANDATORY DEPLOYMENT CHECKLIST
## NEVER CLAIM SUCCESS WITHOUT COMPLETING ALL STEPS

### ✅ Step 1: Build Locally
- [ ] Run `npm run build`
- [ ] Check for build errors

### ✅ Step 2: Test Locally  
- [ ] Run `npm run preview`
- [ ] Use Playwright to test local preview
- [ ] Verify correct version number
- [ ] Test complete user flow
- [ ] Take screenshots

### ✅ Step 3: Deploy
- [ ] Commit changes
- [ ] Push to git
- [ ] Deploy to Vercel

### ✅ Step 4: WAIT
- [ ] Wait FULL 60 seconds for propagation
- [ ] Do NOT skip this

### ✅ Step 5: VERIFY PRODUCTION WITH PLAYWRIGHT
- [ ] Test the ACTUAL production URL
- [ ] Verify EXACT version number (e.g., 2.6.9 not 2.6)
- [ ] Click through ENTIRE flow
- [ ] Take screenshots of EVERY screen
- [ ] Save all screenshots

### ✅ Step 6: Only Report Success After Verification
- [ ] ONLY say it works after Playwright confirms it
- [ ] Show evidence (screenshots)
- [ ] Report exact version number shown