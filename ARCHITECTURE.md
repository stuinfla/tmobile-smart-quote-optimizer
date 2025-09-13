# T-Mobile Sales Edge - Application Architecture Deep Dive

## 🏗️ Architecture Overview

### Application Type
- **Framework**: React 19.1.1 with Vite 7.1.2
- **Type**: Progressive Web App (PWA) 
- **Deployment**: Vercel (Serverless)
- **State Management**: React Hooks + LocalStorage
- **Styling**: CSS Modules + iOS-optimized styles

## 📊 Data Architecture

### Current Data Storage Locations

#### 1. **JSON Data Files** (Static Configuration)
Located in `/src/data/`:

- **plans_sept_2025.js** ✅ (Primary pricing source)
  - Current plan pricing (Experience Beyond/More, Essentials Saver)
  - AutoPay discounts
  - South Florida tax calculations
  - Line-based pricing tiers

- **experiencePlans.js** ✅
  - Plan features and descriptions
  - Benefits comparison
  - Plan IDs and names

- **promotions_sept_2025.js** ✅
  - Current promotional offers
  - BOGO deals
  - Trade-in values
  - Keep & Switch bonuses

- **phoneData.js** ✅
  - Device catalog
  - Retail prices
  - Trade-in values by condition
  - Device specifications

- **insuranceData.js** ✅
  - Protection 360 pricing
  - AppleCare pricing
  - Coverage details

- **monthlyPrograms.js** ✅
  - Financing options
  - EIP (Equipment Installment Plan)
  - Jump! program details

- **storeData.js** ⚠️ (Mixed - some hardcoded defaults)
  - Store locations
  - Sales rep management
  - Default store configuration

#### 2. **LocalStorage** (Client-side Persistence)
- Customer session data
- Current quote progress
- User preferences
- Rep/Store selections

#### 3. **Hardcoded Data** ❌ (NEEDS MIGRATION)

**Critical Issues Found:**

##### ResultsDisplayEnhanced.jsx (Lines 3-8)
```javascript
// HARDCODED TAX RATES - Should be in JSON
const FLORIDA_COMMUNICATIONS_TAX = 0.0688;
const PALM_BEACH_COUNTY_TAX = 0.01;
const FEDERAL_USF_FEE = 0.0124;
const REGULATORY_FEE_PER_LINE = 3.99;
const FEDERAL_LOCAL_SURCHARGE_PER_LINE = 2.50;
const ACTIVATION_FEE_PER_LINE = 10;
```

##### AdminPanelEnhanced.jsx (Line 62)
```javascript
// SECURITY ISSUE - Hardcoded password
const ADMIN_PASSWORD = 'YF2015';
```

##### ConversationFlowEnhanced.jsx
- Hardcoded device recommendations
- Hardcoded accessory pricing logic
- Hardcoded promotional messages

## 🔄 Data Flow Architecture

```
User Input → React Components → State Management → Data Processing → Results Display
     ↓              ↓                  ↓                ↓              ↓
  Events      JSON Data Files    LocalStorage      Optimizer      Quote Gen
```

### Component Hierarchy

```
AppComplete.jsx (Main Container)
├── Header
│   ├── RepSwitcher
│   └── Pricing Validity Banner
├── ConversationFlowEnhanced (Customer Journey)
│   ├── Question Cards
│   ├── Device Selector
│   └── Plan Selector
├── ResultsDisplayEnhanced (Deal Scenarios)
│   └── Scenario Cards
├── QuoteGeneratorPro (PDF Generation)
└── AdminPanelEnhanced (Configuration)
    ├── Store Management
    ├── Rep Management
    └── Promotion Management
```

## 🚨 Critical Architecture Issues

### 1. **Data Management Problems**
- **Issue**: Business logic mixed with UI components
- **Impact**: Cannot update pricing without code changes
- **Solution**: Extract ALL business data to JSON configuration

### 2. **Hardcoded Go5G References**
- **Files Affected**: 15+ component files
- **Impact**: Showing discontinued plans to customers
- **Solution**: Complete removal and replacement with Experience plans

### 3. **Security Vulnerability**
- **Issue**: Admin password hardcoded in source
- **Impact**: Anyone can access admin panel
- **Solution**: Move to environment variables

### 4. **Tax Configuration**
- **Issue**: Florida-specific taxes hardcoded
- **Impact**: Cannot expand to other states
- **Solution**: Create tax configuration JSON

## 🔧 Recommended Architecture Improvements

### 1. **Create Configuration Files**

#### `/src/config/taxes.json`
```json
{
  "florida": {
    "state_communications_tax": 0.0688,
    "counties": {
      "palm_beach": 0.01,
      "broward": 0.0,
      "miami_dade": 0.01
    },
    "federal_usf": 0.0124,
    "regulatory_fee_per_line": 3.99,
    "federal_local_surcharge": 2.50,
    "activation_fee": 10
  }
}
```

#### `/src/config/businessRules.json`
```json
{
  "default_plan": "EXPERIENCE_BEYOND",
  "minimum_lines": 1,
  "maximum_lines": 12,
  "autopay_discount": 10,
  "senior_discount_age": 55
}
```

### 2. **Environment Variables Setup**

Create `.env.local`:
```env
# Admin Configuration
VITE_ADMIN_PASSWORD=secure_password_here

# API Keys (for PDF vision capability)
VITE_ANTHROPIC_API_KEY=your_api_key_here
VITE_OPENAI_API_KEY=your_openai_key_here

# Feature Flags
VITE_ENABLE_PDF_READER=true
VITE_ENABLE_VISION_API=true
```

### 3. **State Management Pattern**

Current: Component-level state with prop drilling
Recommended: Context API or Zustand for global state

```javascript
// Create a global store
const useStore = create((set) => ({
  customerData: {},
  currentRep: null,
  storeInfo: null,
  updateCustomerData: (data) => set({ customerData: data }),
  setCurrentRep: (rep) => set({ currentRep: rep })
}));
```

## 📄 PDF Reading Implementation

### Vision API Integration

To enable PDF reading with vision capabilities:

#### 1. **Install Dependencies**
```bash
npm install pdf.js axios
```

#### 2. **Create PDF Service**
```javascript
// /src/services/pdfVisionService.js
import * as pdfjsLib from 'pdfjs-dist';

export class PDFVisionService {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    
    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2.0 });
      
      // Render to canvas
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      // Convert to base64
      const imageData = canvas.toDataURL('image/png');
      
      // Send to Vision API
      const text = await this.processWithVisionAPI(imageData);
      pages.push(text);
    }
    
    return pages.join('\n');
  }

  async processWithVisionAPI(imageData) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/png',
                data: imageData.split(',')[1]
              }
            },
            {
              type: 'text',
              text: 'Extract all text from this image, preserving formatting and structure.'
            }
          ]
        }]
      })
    });
    
    const data = await response.json();
    return data.content[0].text;
  }
}
```

#### 3. **Environment Variables for Vercel**

##### Local Development (.env.local)
```env
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...
```

##### Production (Vercel Dashboard)
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - Name: `VITE_ANTHROPIC_API_KEY`
   - Value: Your API key
   - Environment: Production

#### 4. **Component Integration**
```javascript
// /src/components/PDFReader.jsx
import { PDFVisionService } from '../services/pdfVisionService';

function PDFReader() {
  const [extractedText, setExtractedText] = useState('');
  
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      const service = new PDFVisionService(
        import.meta.env.VITE_ANTHROPIC_API_KEY
      );
      
      try {
        const text = await service.extractTextFromPDF(file);
        setExtractedText(text);
        // Process extracted plan information
        processPlanData(text);
      } catch (error) {
        console.error('PDF processing failed:', error);
      }
    }
  };
  
  return (
    <div>
      <input 
        type="file" 
        accept="application/pdf"
        onChange={handleFileUpload}
      />
      {extractedText && (
        <div>{extractedText}</div>
      )}
    </div>
  );
}
```

## 🚀 Deployment Configuration

### Vercel Environment Variables

Set these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_ADMIN_PASSWORD=<secure_password>
VITE_ANTHROPIC_API_KEY=<your_api_key>
VITE_ENABLE_PDF_READER=true
```

### Security Notes
1. Never commit `.env` files to git
2. Use different API keys for development and production
3. Rotate API keys regularly
4. Implement rate limiting for API calls

## 📈 Performance Considerations

### Current Issues:
- Bundle size: ~500KB (needs optimization)
- Lighthouse score: 78/100 (needs improvement)
- First Contentful Paint: 2.1s (should be <1.5s)

### Recommendations:
1. Code splitting for large components
2. Lazy loading for admin features
3. Image optimization
4. Service worker caching strategy

## 🔐 Security Architecture

### Current Vulnerabilities:
1. Hardcoded admin password ❌
2. No authentication system ❌
3. Client-side data validation only ⚠️
4. No API rate limiting ❌

### Required Improvements:
1. Implement proper authentication
2. Server-side validation
3. API key rotation
4. Content Security Policy headers

## 📝 Summary

The application has a solid React foundation but suffers from:
1. **Data architecture issues** - Too much hardcoded data
2. **Security vulnerabilities** - Exposed credentials
3. **Scalability limitations** - Florida-specific hardcoding
4. **Maintenance challenges** - Business logic in components

Immediate priorities:
1. Extract ALL hardcoded data to JSON files
2. Remove Go5G references completely
3. Implement environment variables
4. Add PDF reading capability with vision API
5. Deploy secure version to production