# T-Mobile Sales Edge - Complete App Understanding
## Date: September 2025

## Purpose
This app helps T-Mobile sales reps quickly calculate the best deal for customers in-store. The goal is to complete the entire process in 30-60 seconds with minimal taps.

## Current State of Knowledge

### ✅ CONFIRMED (from our data files)

#### Phone Models (September 2025 - from phoneData.js)
- iPhone 17, iPhone 17 Plus, iPhone 17 Air, iPhone 17 Pro, iPhone 17 Pro Max
- Galaxy S25, Galaxy S25+, Galaxy S25 Ultra
- These are for PURCHASE (not trade-in)

#### Trade-In Models (REALITY: People trade phones 2-7 years old)
- iPhone 16 Pro/Max ($1000) - 1 year old - RARE to trade
- iPhone 15 Pro/Max ($1000) - 2 years old
- iPhone 14 Pro/Max ($800) - 3 years old - COMMON
- iPhone 13 Pro/Max ($800) - 4 years old - COMMON
- iPhone 12 Pro/Max ($600) - 5 years old - COMMON
- iPhone 11 Pro/Max ($400) - 6 years old - COMMON
- iPhone X/XS ($200) - 7+ years old

- Galaxy S24/S23 ($800) - 1-2 years old
- Galaxy S22 ($600) - 3 years old - COMMON
- Galaxy S21 ($600) - 4 years old - COMMON
- Galaxy S20 ($400) - 5 years old - COMMON
- Older Android ($200) - 6+ years old

- Broken phone (any age) ($200 credit)
- Keep & Switch (for competitor customers - $800 credit per line)

#### Plans (from plans_sept_2025.js)
1. **Experience Beyond** - $95/line with AutoPay
   - Annual phone upgrades
   - Unlimited hotspot
   - T-Satellite included
   - Netflix, Apple TV+, Hulu

2. **Experience More** - $80/line with AutoPay
   - 2-year upgrades
   - 60GB hotspot
   - Netflix, Apple TV+

3. **Essentials Saver** - $50/line with AutoPay
   - 50GB premium data
   - Basic hotspot

#### Customer Types (from experiencePlans.js & research)
- **Standard Consumer** - Regular pricing
- **55+ Senior** - ~15% discount, max 2 lines
- **Military/Veterans** - 40% off lines 2-6
- **First Responders** - 40% off lines 2-6
- **Business** - Special pricing

#### Insurance (from insuranceData.js)
- Tier 5 ($25/mo): iPhone 17 Pro/Max, Galaxy S25 Ultra
- Tier 4 ($18/mo): iPhone 17, iPhone 17 Plus
- Tier 3 ($13/mo): Older phones
- AppleCare+ available as alternative

#### Connected Devices (from insuranceData.js)
- Apple Watch: $5/mo with Experience Beyond, $12 standard
- iPad/Tablet: $5/mo with Experience Beyond, $20 standard  
- Home Internet: FREE with 2+ lines, $60 otherwise
- Connection fee: $35 per device

### ✅ NOW RESEARCHED (September 2025)

1. **Tablet/Connected Device Plans**
   - $5/month when added to Experience Beyond plan
   - $20/month standard without Experience Beyond
   - 30GB high-speed for tablets, then throttled to 600Kbps
   - Apple Watch gets unlimited high-speed data
   - NO separate 5GB/10GB tiers - just the add-on plans

2. **Current Promotions (NO BOGO in Sept 2025)**
   - iPhone 17: Up to $1100 off with trade + new line
   - Galaxy S25: Up to $1000 off with trade + new line
   - Keep & Switch: $800/line from Verizon/AT&T
   - NO BOGO currently active

3. **Multi-device discounts**
   - Best deal: Add to Experience Beyond for $5 each
   - No specific "50% off second device" found
   - Connection fee: $35 per device

4. **BYOD vs New Device**
   - Monthly rate is the same ($5 or $20)
   - Connection fee same ($35)
   - Device cost difference only

## The Complete Flow (9 Screens)

### Screen 1: Welcome + Customer Type
**Purpose**: Identify customer status AND discount eligibility in ONE screen
**Layout**: 
- Top section: "New to T-Mobile?"
  - Standard
  - 55+ Senior
  - Military/Veteran  
  - First Responder
- Bottom section: "Current T-Mobile Customer?"
  - Standard
  - 55+ Senior
  - Military/Veteran
  - First Responder
**Smart Logic**: Sets customer path and applicable discounts
**Auto-advance**: YES

### Screen 2: Number of Lines
**Purpose**: How many lines needed
**Layout**: 
- 4 large buttons: Single (1), Couple (2), Family (3), Family+ (4+)
- Number grid below:
  ```
  1  2  3
  4  5  6
     7
  ```
**Smart Logic**: 
- If 55+ selected and >2 lines, show warning
- Calculate family line discounts
**Auto-advance**: YES

### Screen 3: Current Carrier (NEW customers only)
**Purpose**: Identify switching incentives
**Layout**: 
- Verizon (Keep & Switch eligible)
- AT&T (Keep & Switch eligible)
- Sprint/Other
**Smart Logic**: 
- If Verizon/AT&T → Enable Keep & Switch ($800/line)
- Skip trade-in screen or show as optional
**Auto-advance**: YES

### Screen 4: Trade-In Decision
**Purpose**: Trade-in vs Keep & Switch
**Smart Logic**:
- If switching from Verizon/AT&T → Default to Keep & Switch
- If existing customer → Show trade-in options
- Calculate best value automatically
**Layout**: Show current phone options for each line
**Auto-advance**: YES when all selected

### Screen 5: New Phone Selection
**Purpose**: Select NEW phones to purchase
**For Each Line**:
- iPhone 17 ($799)
- iPhone 17 Air ($999)
- iPhone 17 Pro ($1099)
- iPhone 17 Pro Max ($1199)
- Galaxy S25 ($799)
- Galaxy S25+ ($999)
- Galaxy S25 Ultra ($1199)
**Then**: Select storage (256GB, 512GB, 1TB)
**Auto-advance**: YES when all selected

### Screen 6: Plan Selection
**Purpose**: Choose service plan
**Smart Display**: Show pricing based on:
- Number of lines
- Customer type (military, 55+, etc.)
- AutoPay discount applied
**Options**:
- Experience Beyond
- Experience More
- Essentials Saver
**Auto-advance**: YES

### Screen 7: Protection
**Purpose**: Device insurance
**Smart Pricing**: Based on device tier
- P360 Complete (price varies by device)
- AppleCare+ 
- Basic Protection
- No Protection
**Auto-advance**: YES

### Screen 8: Connected Devices
**Purpose**: Add accessories
**Decision Tree**:
1. Add Apple Watch? 
   - New (show models) or BYOD?
   - Data plan ($5 or $12 based on main plan)
2. Add iPad/Tablet?
   - New (show models) or BYOD?
   - Data plan ($5 or $20 based on main plan)
3. Add Home Internet?
   - FREE with 2+ lines
**UNKNOWN**: Multi-device discounts, data tiers
**Auto-advance**: YES

### Screen 9: Summary & Calculate
**Purpose**: Review and calculate
**Shows**:
- All selections
- Trade-in values
- Monthly device payments
- Plan cost
- Insurance cost
- Accessory lines
**Calculate Button**: Runs optimizer
**Results**: 
- Total monthly cost
- Total savings
- Best promotions applied

## Business Rules to Implement

1. **Keep & Switch**: Only for Verizon/AT&T switchers
2. **55+ Plans**: Max 2 lines
3. **Military/First Responder**: 40% off lines 2-6
4. **Multi-line discounts**: Automatic based on line count
5. **Device financing**: 24-month default
6. **AutoPay**: $10/line discount on Experience plans
7. **Taxes**: South Florida specific (14.44% Miami-Dade)

## What Needs Research Before Coding

1. Exact multi-device discount structure
2. Tablet data plan tiers and pricing
3. BYOD vs new device pricing differences
4. Current BOGO promotions
5. Promotion stacking rules

## Next Steps

1. Research the unknowns
2. Update this document with findings
3. Design each screen mockup
4. Only then start coding