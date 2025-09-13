# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server on http://localhost:5173
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

### Deployment

**🚨 IMPORTANT: Always use the intelligent deploy script for production deployments!**

```bash
# Standard deployment (auto-increments patch version)
npm run deploy

# For minor updates (new features)
npm run deploy:minor

# For major updates (breaking changes)
npm run deploy:major

# With custom feature description
npm run deploy --feature="Added new accessory pricing"
```

**The deploy script automatically:**
- Increments version number (2.1.0 → 2.1.1)
- Updates src/version.json with release date
- Commits version changes
- Pushes to GitHub
- Deploys to Vercel
- Triggers PWA auto-update

**Current Version**: 2.1.0 (check package.json)

**Production URLs**:
- Main: https://tmobile-optimizer.vercel.app
- Alternative: https://tmobile-sales-edge.vercel.app

**Manual deployment (ONLY for testing):**
```bash
vercel --prod  # ⚠️ Won't update version numbers!
```

## Architecture Overview

This is a React-based Progressive Web App (PWA) for T-Mobile sales representatives to calculate optimal customer deals. The app uses Vite as the build tool and is deployed on Vercel.

### Entry Points
- `src/main.jsx` - Application entry point that renders `AppComplete`
- `src/AppComplete.jsx` - Main application component (active version)
- Note: App.jsx, AppEnhanced.jsx also exist but AppComplete is the current production version

### Core Data Structure

#### Plan Data
- `src/data/plans_sept_2025.js` - Current September 2025 pricing (CRITICAL: This is the active pricing file)
  - Experience Beyond: $105/line base ($95 with AutoPay)
  - Experience More: $90/line base ($80 with AutoPay)
  - Essentials Saver: $55/line base ($50 with AutoPay)
  - Includes South Florida tax calculations (14.44% Miami-Dade/Palm Beach, 13.44% Broward)
- `src/data/experiencePlans.js` - Experience plan definitions and features
- `src/data/plans.js` - Legacy file (contains outdated Go5G plans - DO NOT USE)

**IMPORTANT**: Go5G plans were discontinued April 2025. Only Experience plans should be shown.

#### Promotion Data
- `src/data/promotions_sept_2025.js` - Current September 2025 promotions
- `src/data/promotions.js` - Legacy promotions file
- `src/data/phoneData.js` - Phone pricing and trade-in values

### Key Components

#### Deal Calculation Engine
- `src/utils/optimizer.js` - Core optimization logic that calculates best deal scenarios
  - Compares trade-in vs Keep & Switch
  - Handles BOGO promotions
  - Calculates bundle savings
  - Returns ranked scenarios

#### Customer Flow
- `src/components/ConversationFlowComplete.jsx` - Main questionnaire flow
- Adapts based on new vs existing customer
- Collects device, plan, and accessory preferences

#### Results & Quotes
- `src/components/ResultsDisplayEnhanced.jsx` - Shows optimized deal scenarios
- `src/components/QuoteGeneratorPro.jsx` - Creates professional quotes

#### Admin Features
- `src/components/AdminPanelEnhanced.jsx` - Store configuration and settings
- `src/components/RepSwitcher.jsx` - Sales rep management with edit functionality
- `src/components/StoreSetup.jsx` - Initial store configuration

### State Management
- Uses React hooks (useState, useEffect) for local state
- `src/hooks/useLocalStorage.js` - Persistent storage for rep/store data
- `src/data/storeData.js` - Store and rep information management

### Styling
- `src/App.css` - Main styles with T-Mobile branding
- Mobile-first responsive design
- T-Mobile brand colors: Magenta (#E20074)

## Critical Business Rules

1. **Pricing Validity**: Header must show "Pricing & Promotions Valid as of September 2025"
2. **Plan Names**: Use Experience Beyond/More, NOT Go5G Next/Plus (discontinued)
3. **AutoPay Discounts**: $10/line for Experience plans, $5/line for Essentials
4. **Tax Calculations**: South Florida specific - stored in plans_sept_2025.js
5. **Default Plan**: Should be EXPERIENCE_BEYOND, not GO5G_Next

## Common Updates

### Update Pricing
Edit `src/data/plans_sept_2025.js` - all pricing should come from this file

### Update Promotions
Edit `src/data/promotions_sept_2025.js` - ensure no Go5G references remain

### Add New Phones
Edit `src/data/phoneData.js` with retail price and trade-in values

## Testing Checklist

Before deploying:
1. Verify correct plan names display (Experience, not Go5G)
2. Check pricing matches September 2025 documentation
3. Confirm tax calculations for South Florida
4. Test rep editing functionality
5. Ensure pricing validity date shows in header
6. Verify all data pulls from JSON files (not hardcoded)