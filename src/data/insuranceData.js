// T-Mobile Protection 360 Insurance Pricing (2025)
export const insurancePricing = {
  // Tier-based pricing for Protection 360
  tiers: {
    tier1: { 
      monthly: 7, 
      devices: ['Basic phones', 'Budget smartphones'],
      deductible: { screen: 29, damage: 99, loss: 99 }
    },
    tier2: { 
      monthly: 10, 
      devices: ['Mid-range smartphones', 'Older iPhones', 'Galaxy A series'],
      deductible: { screen: 29, damage: 149, loss: 149 }
    },
    tier3: { 
      monthly: 13, 
      devices: ['iPhone 12/13', 'Galaxy S21/S22', 'Pixel 7/8'],
      deductible: { screen: 29, damage: 199, loss: 199 }
    },
    tier4: { 
      monthly: 18, 
      devices: ['iPhone 14/15', 'Galaxy S23/S24', 'Pixel 9'],
      deductible: { screen: 29, damage: 249, loss: 249 }
    },
    tier5: { 
      monthly: 25, 
      devices: ['iPhone 16/17 Pro Max', 'Galaxy S25 Ultra', 'Foldables'],
      deductible: { screen: 0, backGlass: 29, damage: 299, loss: 299 }
    }
  },
  
  // Map specific devices to tiers
  deviceTiers: {
    // iPhone models
    'iPhone_17_Pro_Max': 'tier5',
    'iPhone_17_Pro': 'tier5',
    'iPhone_17_Plus': 'tier4',
    'iPhone_17': 'tier4',
    'iPhone_16_Pro_Max': 'tier5',
    'iPhone_16_Pro': 'tier5',
    'iPhone_16_Plus': 'tier4',
    'iPhone_16': 'tier4',
    'iPhone_15_Pro_Max': 'tier4',
    'iPhone_15_Pro': 'tier4',
    'iPhone_15_Plus': 'tier3',
    'iPhone_15': 'tier3',
    'iPhone_14_Pro_Max': 'tier4',
    'iPhone_14_Pro': 'tier4',
    'iPhone_14_Plus': 'tier3',
    'iPhone_14': 'tier3',
    'iPhone_13_Pro_Max': 'tier3',
    'iPhone_13_Pro': 'tier3',
    'iPhone_13': 'tier3',
    'iPhone_12_Pro_Max': 'tier3',
    'iPhone_12_Pro': 'tier3',
    'iPhone_12': 'tier2',
    'iPhone_11_Pro_Max': 'tier2',
    'iPhone_11_Pro': 'tier2',
    'iPhone_11': 'tier2',
    
    // Samsung models
    'Galaxy_S25_Ultra': 'tier5',
    'Galaxy_S25_Plus': 'tier4',
    'Galaxy_S25': 'tier4',
    'Galaxy_S24_Ultra': 'tier5',
    'Galaxy_S24_Plus': 'tier4',
    'Galaxy_S24': 'tier4',
    'Galaxy_S23_Ultra': 'tier4',
    'Galaxy_S23_Plus': 'tier3',
    'Galaxy_S23': 'tier3',
    'Galaxy_S22_Ultra': 'tier3',
    'Galaxy_S22_Plus': 'tier3',
    'Galaxy_S22': 'tier3',
    'Galaxy_Z_Fold6': 'tier5',
    'Galaxy_Z_Fold5': 'tier5',
    'Galaxy_Z_Flip6': 'tier4',
    'Galaxy_Z_Flip5': 'tier4',
    
    // Google Pixel models
    'Pixel_9_Pro_XL': 'tier4',
    'Pixel_9_Pro': 'tier4',
    'Pixel_9': 'tier3',
    'Pixel_8_Pro': 'tier3',
    'Pixel_8': 'tier3',
    'Pixel_7_Pro': 'tier3',
    'Pixel_7': 'tier2',
    
    // Other brands
    'OnePlus_12': 'tier3',
    'Motorola_Edge_Plus_2025': 'tier3',
    'Motorola_Razr_Plus_2024': 'tier4'
  },
  
  // Get insurance price for a specific device
  getInsurancePrice: function(deviceModel) {
    const tier = this.deviceTiers[deviceModel] || 'tier3'; // Default to tier3 if not found
    return this.tiers[tier];
  }
};

// Accessory line pricing
export const accessoryLinePricing = {
  watch: {
    promotional: 5, // With Experience Beyond plan
    standard: 12, // Without promotional plan
    connectionFee: 35,
    description: 'Apple Watch or Galaxy Watch line'
  },
  tablet: {
    promotional: 5, // With Experience Beyond plan
    standard: 20, // Without promotional plan
    connectionFee: 35,
    dataLimit: '30GB high-speed, then 600Kbps',
    description: 'iPad or tablet line'
  },
  homeInternet: {
    promotional: 0, // Free with 2+ lines
    standard: 60,
    connectionFee: 0,
    description: 'T-Mobile 5G Home Internet'
  }
};

// Features included with Protection 360
export const protection360Features = [
  'Unlimited device claims',
  'Same-day replacement and setup',
  'McAfee Security with ID Monitoring',
  'AppleCare Services (for iPhones)',
  'Mechanical and electrical failure coverage',
  'Accidental damage coverage',
  'Loss and theft coverage',
  'Free screen protector installation'
];