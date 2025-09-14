# T-Mobile Application Fix List

## Critical Issues Found

After thoroughly analyzing the T-Mobile application, I've identified several critical issues affecting calculations, flow, and user experience. Here's a comprehensive fix list organized by priority:

## 🔴 PRIORITY 1: Critical Calculation Issues

### 1. Insurance Calculation Not Using Proper Pricing
**Location**: `src/utils/optimizerFixed.js` lines 275-281
**Issue**: Insurance is hardcoded at $18/month instead of using device-specific pricing from `insuranceData.js`
**Fix Required**:
```javascript
// CURRENT (WRONG):
monthlyInsurance = insuredLines * 18; // Hardcoded $18

// SHOULD BE:
let monthlyInsurance = 0;
this.customer.devices.forEach(device => {
  if (device.insurance && device.newPhone) {
    const insuranceInfo = insurancePricing.getInsurancePrice(device.newPhone);
    monthlyInsurance += insuranceInfo.monthly;
  }
});
```

### 2. Accessory Line Pricing Not Calculating
**Location**: `src/utils/optimizerFixed.js` - `calculateAccessoryCosts()` method
**Issue**: Watch and tablet line costs not properly added to monthly bill
**Fix Required**:
- Import and use `accessoryLinePricing` from `insuranceData.js`
- Add watch line cost: $5/month (with Experience Beyond) or $12/month (standard)
- Add tablet line cost: $5/month (with Experience Beyond) or $20/month (standard)

### 3. Plan Pricing Calculation Issues
**Location**: `src/utils/optimizerFixed.js` lines 49-84
**Issue**: Complex logic for calculating total plan cost based on line count
**Fix Required**:
- Simplify by using total pricing directly from `plans_sept_2025.js`
- Ensure AutoPay discount is properly applied ($10/line for Experience, $5/line for Essentials)

## 🟡 PRIORITY 2: Flow & User Experience Issues

### 4. Insurance Step Not Always Showing
**Location**: `src/components/ConversationFlowComplete.jsx`
**Issue**: Insurance step may be skipped in certain flows
**Fix Required**:
- Ensure 'insurance' step always comes after 'newPhones' selection
- Make insurance selection mandatory (even if user declines)

### 5. Accessory Device Selection Missing
**Location**: `src/components/ConversationFlowComplete.jsx`
**Issue**: When user selects watch/tablet lines, no prompt for device selection
**Fix Required**:
- Add device selection for watches (Apple Watch models)
- Add device selection for tablets (iPad models)
- Include financing options for accessory devices

### 6. Tax Calculations Inconsistent
**Location**: Multiple files using different tax rates
**Issue**: Tax rates defined in multiple places with different values
**Fix Required**:
- Centralize all tax calculations to use `taxConfig.json`
- Ensure consistent application of South Florida tax rates

## 🟢 PRIORITY 3: Display & Summary Issues

### 7. Summary Page Missing Insurance Details
**Location**: `src/components/ConversationFlowComplete.jsx` - summary case
**Issue**: Insurance selections not shown in summary
**Fix Required**:
- Display insurance cost per device
- Show total monthly insurance cost
- Include Protection 360 features

### 8. Results Display Not Showing All Costs
**Location**: `src/components/ResultsDisplayEnhanced.jsx`
**Issue**: Missing breakdown of accessory lines and insurance
**Fix Required**:
- Add insurance line item to monthly breakdown
- Add accessory line costs separately
- Show device connection fees for all devices

### 9. Trade-In Values Not Properly Applied
**Location**: `src/utils/optimizerFixed.js` - `calculateDeviceCosts()`
**Issue**: Trade-in credits not correctly reducing device financing
**Fix Required**:
- Ensure trade-in values from `phoneData.js` are properly applied
- Show trade-in credit clearly in results

## 📋 Implementation Checklist

### Step 1: Fix Insurance Calculations
- [ ] Import `insurancePricing` in optimizerFixed.js
- [ ] Update `calculateInsuranceCost()` method to use device-specific pricing
- [ ] Test with different device combinations

### Step 2: Fix Accessory Line Pricing
- [ ] Import `accessoryLinePricing` in optimizerFixed.js
- [ ] Update `calculateAccessoryCosts()` to include line fees
- [ ] Add logic for promotional vs standard pricing based on plan

### Step 3: Fix Plan Pricing
- [ ] Simplify plan cost calculation logic
- [ ] Ensure AutoPay discounts are correctly applied
- [ ] Test with 1-5 lines to verify accuracy

### Step 4: Fix User Flow
- [ ] Ensure insurance step always appears
- [ ] Add accessory device selection step
- [ ] Test complete flow from start to finish

### Step 5: Fix Tax Calculations
- [ ] Centralize tax calculations to use taxConfig.json
- [ ] Remove hardcoded tax rates from components
- [ ] Verify South Florida tax rates are correct

### Step 6: Fix Display Issues
- [ ] Update summary to show all selected options
- [ ] Update results to show complete cost breakdown
- [ ] Add missing line items for insurance and accessories

## Testing Scenarios

### Test Case 1: Family Plan with Insurance
- 4 lines
- Mix of iPhone and Samsung devices
- 2 devices with insurance
- Watch and tablet accessories
- Expected: Correct monthly total with all components

### Test Case 2: Single Line with Trade-In
- 1 line
- iPhone 17 with trade-in
- Insurance selected
- No accessories
- Expected: Trade-in credit applied, insurance added

### Test Case 3: Couple Plan with Accessories
- 2 lines
- Both new phones
- One watch, one tablet
- No insurance
- Expected: Accessory line costs included

## Success Criteria

✅ All phone line costs calculate correctly based on number of lines
✅ Insurance costs use device-specific pricing from insuranceData.js
✅ Accessory line costs (watch/tablet) are added to monthly bill
✅ Trade-in values properly reduce device financing
✅ Tax calculations are consistent and accurate
✅ User flow is logical and complete
✅ Summary page shows all selections and costs
✅ Results display complete breakdown of all charges

## Notes

- The main issue is that calculations are partially hardcoded instead of using the proper data files
- Insurance pricing varies by device tier ($7-$25/month) but is hardcoded at $18
- Accessory line costs are defined but not being added to calculations
- The flow works but needs refinement to ensure all options are presented

## Next Steps

1. Start with Priority 1 fixes (calculation issues)
2. Test each fix thoroughly before moving to next
3. Run full end-to-end tests after all fixes
4. Deploy using `npm run deploy` to trigger auto-update