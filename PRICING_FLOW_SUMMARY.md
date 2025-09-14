# T-Mobile Application - Pricing & Flow Summary

## ✅ COMPLETED FIXES

### 1. **Application Flow (Corrected Order)**
1. **Lines Selection** - Choose number of phone lines (1-5+)
2. **New Phone Selection** - Select new phones and storage for each line
3. **Current Phones** - Select phones for trade-in or Keep & Switch
4. **Plan Selection** - Choose Experience Beyond/More or Essentials
5. **Accessory Lines** - Add watch, tablet, or home internet lines
6. **Accessory Devices** - Choose new devices or bring your own (BYOD)
7. **Insurance** - Protection 360 for each device (MOVED TO END)
8. **Summary** - Review all selections with accurate pricing

### 2. **Pricing Structure (All from Data Files)**

#### Phone Plans (`plans_sept_2025.js`)
- Experience Beyond: $95-105/line with AutoPay discount
- Experience More: $80-90/line with AutoPay discount  
- Essentials Saver: $50-55/line with AutoPay discount

#### Insurance (`insuranceData.js`)
- Tier-based pricing: $7-$25/month per device
- Based on specific device model (not hardcoded $18)
- Includes deductible information

#### Accessory Lines (`insuranceData.js`)
- **Watch**: $5/mo (with Experience Beyond) or $12/mo (standard)
- **Tablet**: $5/mo (with Experience Beyond) or $20/mo (standard)
- **Home Internet**: Free with 2+ lines on Experience plans, otherwise $60/mo

#### Accessory Devices (`accessoryDevices.json` - NEW FILE)
- **Watches**: Apple Watch ($249-$799), Galaxy Watch ($299-$429)
- **Tablets**: iPad ($449-$1299), Galaxy Tab ($799-$1199)
- All with 24-month financing options

#### Taxes (`taxConfig.json`)
- Service tax: 14.44% (Miami-Dade/Palm Beach) or 13.44% (Broward)
- Device tax: 7% on all devices
- Regulatory fees: $3.99/line
- Federal surcharge: $2.50/line
- Connection charge: $35/device

### 3. **Calculation Logic**

```javascript
Monthly Bill = 
  Plan Cost (from plans_sept_2025.js)
  - AutoPay Discount ($10/line for Experience, $5 for Essentials)
  + Insurance (device-specific from insuranceData.js)
  + Accessory Line Fees (from accessoryLinePricing)
  + Device Financing (phones - trade-in credits)
  + Accessory Device Financing (if purchasing new)
  + Taxes & Fees (from taxConfig.json)
```

### 4. **Key Improvements Made**

✅ **Insurance**: Now uses device-specific pricing ($7-$25) instead of hardcoded $18
✅ **Accessory Lines**: Properly adds $5-$20/mo based on plan and accessory type
✅ **Accessory Devices**: Can select specific models with proper financing
✅ **Flow Order**: Insurance moved to end, accessory device selection improved
✅ **New vs BYOD**: Clear options for buying new or bringing existing accessories
✅ **Tax Calculations**: Centralized to use taxConfig.json consistently
✅ **All Scenarios**: Trade-In, Keep & Switch, and Bundle scenarios updated

### 5. **Data Files Structure**

- `plans_sept_2025.js` - Phone plan pricing
- `phoneData.js` - Phone prices and trade-in values
- `insuranceData.js` - Insurance tiers and accessory line pricing
- `accessoryDevices.json` - Watch and tablet device pricing (NEW)
- `taxConfig.json` - Location-based tax rates
- `promotions_sept_2025.js` - Current promotional offers

## Testing Scenarios

### Scenario 1: Family with Accessories
- 4 lines with Experience Beyond
- Mix of iPhones and Samsung devices
- 2 devices with insurance ($18 and $25/mo)
- 1 Apple Watch (new) + 1 iPad (BYOD)
- Expected: ~$240 base + $43 insurance + $10 accessories + devices + taxes

### Scenario 2: Couple with Trade-In
- 2 lines with Experience More
- Both iPhone 17s with trade-in
- Both with insurance
- No accessories
- Expected: ~$130 base + $36 insurance + reduced device costs + taxes

### Scenario 3: Single Line Premium
- 1 line with Experience Beyond
- iPhone 17 Pro Max with insurance
- Apple Watch Ultra (new)
- iPad Pro (new)
- Expected: ~$95 base + $25 insurance + $10 accessories + device financing + taxes

## Next Steps

1. ✅ Test the complete flow with various scenarios
2. ✅ Verify all calculations match expected values
3. ✅ Ensure results page shows complete breakdown
4. ✅ Deploy with `npm run deploy` for auto-update