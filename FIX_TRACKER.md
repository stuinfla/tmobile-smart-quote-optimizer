# T-Mobile Sales Edge - Production Fix Tracker
## Target: 90/100 Quality Score (Currently: 44/100)

---

## CRITICAL FIXES REQUIRED

### 🔴 Priority 1: Complete 8-Step Flow
- [x] **IDENTIFIED: Flow breaks at Step 5 (Trade-in)**
  - Issue: canContinue() logic error for currentPhones step
  - Current: `d.currentPhone !== undefined` fails for empty string
  - Fix needed: Check for non-empty string
  
- [ ] **Fix Step 5 → 6 transition (Trade-in → Accessories)**
  - Issue: Flow stops after trade-in selection
  - Expected: Should continue to accessory devices
  - Test: Verify Continue button works after selecting trade-in option
  
- [ ] **Fix Results Display Component**
  - Issue: Results page not rendering
  - Expected: Show monthly total, upfront costs, savings
  - Test: Verify all calculations display correctly

- [ ] **Fix Quote Generation**
  - Issue: Quote button may not work
  - Expected: Generate professional quote PDF/view
  - Test: Click generate quote and verify output

### 🔴 Priority 2: Pricing Calculations
- [ ] **Fix Line Pricing Logic**
  - Issue: May still use per-line instead of total
  - Expected: 3 lines = $230 total (not $76.67 each)
  - Test: Verify exact pricing matches expected values
  
- [ ] **Fix Phone Financing Math**
  - Formula: (List Price - Promotion) ÷ 24 months
  - Test: iPhone 17 Pro Max 512GB should be ~$58.33/month
  
- [ ] **Fix Insurance Calculations**
  - Expected: $18/month per phone (not per account)
  - Test: 3 phones with insurance = $54/month total
  
- [ ] **Fix Accessory Pricing**
  - iPad data: $5 (5GB) or $20 (unlimited)
  - Watch cellular: $10/month
  - Test: Add 1 watch + 2 iPads, verify $30-$50/month

- [ ] **Fix Activation Fees**
  - Expected: $35 per device (ALL devices)
  - Test: 3 phones + 1 watch + 2 iPads = $210 activation

### 🔴 Priority 3: Data Integrity
- [ ] **Remove ALL Go5G References**
  - Search entire codebase for "Go5G" or "GO5G"
  - Replace with Experience plans only
  - Test: No Go5G plans visible anywhere

- [ ] **Verify September 2025 Pricing**
  - Experience Beyond: $230 for 3 lines
  - Experience More: $210 for 3 lines
  - Test: Plan prices match documentation

### 🟡 Priority 4: User Experience
- [ ] **Fix Navigation Between Steps**
  - Back button should work
  - Progress indicator needed
  - Test: Navigate back and forth smoothly

- [ ] **Polish Mobile UI**
  - Ensure all buttons are tappable
  - Fix any layout issues
  - Test: Complete flow on iPhone viewport

- [ ] **Add Loading States**
  - Show spinner during calculations
  - Prevent double-clicks
  - Test: No duplicate submissions

---

## TEST SCENARIOS

### Scenario 1: Basic 3-Line Deal (Expected from CORRECTED_PRICING.md)
**Setup:**
- 3 new lines from Verizon (no trade-ins)
- iPhone 17 Pro Max 512GB + 2x iPhone 17 Pro 256GB
- Insurance on all 3 phones
- 1 existing Apple Watch, 2 existing iPads
- Experience Beyond plan

**Expected Results:**
- Monthly: ~$364.81
  - Plan: $230
  - Phones: $50.67 (financing after credits)
  - Insurance: $54
  - Accessories: $30
- Upfront: ~$826.60
  - Taxes on phones: $301.60
  - Activation: $210 (6 devices × $35)
  - First month: $315

### Scenario 2: Single Line
- 1 line, iPhone 17, no accessories
- Test all calculations scale correctly

### Scenario 3: Family of 5
- 5 lines with mixed phones
- Test pricing at scale

---

## DEPLOYMENT PROCESS

1. **Build**: `npm run build`
2. **Commit**: Git commit with clear message
3. **Deploy**: `npm run deploy` 
4. **Wait**: 2 minutes for CDN propagation
5. **Test**: Run production test suite
6. **Verify**: Check exact values match expected
7. **Document**: Update this tracker with results

---

## COMPLETION CRITERIA

A fix is ONLY considered complete when:
1. ✅ Deployed to production (version incremented)
2. ✅ Tested on production URL
3. ✅ Results are logically correct (not just "working")
4. ✅ Values match expected calculations
5. ✅ User experience is smooth
6. ✅ No console errors
7. ✅ Mobile responsive

---

## VERSION HISTORY

- v2.4.6: Fixed JS error in plan features
- v2.4.5: Fixed insurance toggles, header height
- v2.4.4: Fixed phone selection state
- v2.4.3: Added missing UI steps
- Current Production: v2.4.6 (44/100 quality)

---

## NOTES

- Production URL: https://tmobile-optimizer.vercel.app
- Test in iPhone viewport (390x844)
- Clear cache between tests
- Document all findings