# T-Mobile Sales Edge - ACTUAL Data Audit
## NO ASSUMPTIONS - ONLY FACTS FROM OUR FILES

## Trade-In Database Analysis (phoneData.js - tradeInValues object)
We have **141 phone models** with trade-in values spanning 2017-2025

### iPhone Trade-Ins (37 models)
**Current Generation (2025)**
- iPhone 17 Pro Max: $1000
- iPhone 17 Pro: $1000  
- iPhone 17 Air: $900
- iPhone 17 Plus: $830
- iPhone 17: $830

**Last Year (2024)**
- iPhone 16 Pro Max: $830
- iPhone 16 Pro: $830
- iPhone 16 Plus: $650
- iPhone 16: $650

**2 Years Old (2023)**
- iPhone 15 Pro Max: $830
- iPhone 15 Pro: $830
- iPhone 15 Plus: $650
- iPhone 15: $650

**3 Years Old (2022) - MOST COMMON TRADE**
- iPhone 14 Pro Max: $650
- iPhone 14 Pro: $650
- iPhone 14 Plus: $500
- iPhone 14: $500

**4 Years Old (2021) - VERY COMMON**
- iPhone 13 Pro Max: $500
- iPhone 13 Pro: $500
- iPhone 13: $400
- iPhone 13 mini: $350

**5 Years Old (2020) - COMMON**
- iPhone 12 Pro Max: $400
- iPhone 12 Pro: $400
- iPhone 12: $300
- iPhone 12 mini: $250

**6+ Years Old (2019 and earlier)**
- iPhone 11 series: $200-300
- iPhone X/XS/XR: $150-200
- iPhone 8: $100
- iPhone SE models: $50-200

### Samsung Trade-Ins (60+ models)
**Current & Recent Flagships**
- Galaxy S25 Ultra: $1000
- Galaxy S24 Ultra: $830
- Galaxy S23 Ultra: $650
- Galaxy S22 Ultra: $500
- Galaxy S21 series: $200-400
- Galaxy S20 series: $150-200

**Foldables**
- Galaxy Z Fold6: $1000
- Galaxy Z Fold5: $830
- Galaxy Z Flip6: $650
- Earlier folds: $300-500

**Budget/Mid-Range**
- Galaxy A series: $50-200
- Galaxy Note series: $100-400

### Other Brands (40+ models)
- Google Pixel: $50-1000 (9 Pro XL highest)
- OnePlus: $50-650
- Motorola: $50-650 (including Razr foldables)
- LG (legacy): $50-200
- TCL, Nokia, REVVL: $50-100

## Key Business Insights

### Reality Check
1. **Most people trade 3-5 year old phones** (iPhone 14/13/12, Galaxy S23/S22/S21)
2. **Current gen trades are RARE** - Nobody trades a 1-year-old phone
3. **Wide value range**: $50 (old budget) to $1000 (current flagships)
4. **Keep & Switch**: $800/line for Verizon/AT&T customers (often better than trade)

### What This Means for the App
1. Trade-in selector needs to show MANY models (we have 141!)
2. Most common: iPhone 14/13/12, Galaxy S23/S22/S21
3. Need smart filtering/search - can't show all 141 at once
4. Group by age/generation for easier selection
5. Keep & Switch should be prominently offered for competitor customers

## Plans Database (plans_sept_2025.js)

### Postpaid Plans
- Experience Beyond, More, Essentials, Essentials Saver
- Pricing varies by line count (1-7 lines)
- AutoPay discounts: $10 for Experience, $5 for Essentials

### Special Segments
- Senior plans (55+): Max 2 lines, special pricing
- Military/First Responder: Handled via discountPrograms
- Prepaid options available

### Taxes & Fees
- South Florida specific rates:
  - Miami-Dade: 14.44%
  - Broward: 13.44%
  - Palm Beach: 14.44%

## Insurance Tiers (insuranceData.js)

5 tiers based on device value:
- Tier 5 ($25/mo): Latest flagships
- Tier 4 ($18/mo): Recent flagships
- Tier 3 ($13/mo): Mid-range/older flagships
- Tier 2 ($10/mo): Budget/older phones
- Tier 1 ($7/mo): Basic phones

## Connected Devices (insuranceData.js)

### Confirmed Pricing
- Watch: $5 (promo) / $12 (standard)
- Tablet: $5 (promo) / $20 (standard)
- Home Internet: FREE (2+ lines) / $60 (standalone)
- Connection fee: $35 per device

### Still Unknown
- Multi-device discounts
- Data tier options
- BYOD pricing differences