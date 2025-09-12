// T-Mobile Monthly Programs and Promotions (2025) - Updated with Experience Plans Integration
export const monthlyPrograms = {
  // Keep and Switch Programs
  keepAndSwitch: {
    id: 'keep_switch',
    name: 'Keep and Switch',
    description: 'Keep your phone, switch to T-Mobile, get up to $650 back',
    eligibleCarriers: ['Verizon', 'AT&T', 'UScellular', 'Xfinity', 'Spectrum', 'Cricket', 'Boost'],
    benefits: {
      payoffAmount: 650, // Maximum payoff amount
      tradeinCredit: 200, // Additional trade-in credit
      planDiscount: 0, // No monthly discount, one-time benefit
      activationWaiver: false
    },
    requirements: [
      'Eligible carrier device payoff statement',
      'Trade in working device',
      'Port number to T-Mobile',
      'Activate new line on eligible plan'
    ],
    activeProgram: true
  },

  // Magenta Status Programs
  magentaStatus: {
    id: 'magenta_status',
    name: 'Magenta Status',
    description: 'Premium benefits and exclusive perks',
    benefits: {
      payoffAmount: 800,
      tradeinCredit: 300,
      planDiscount: 10, // Monthly discount per line
      activationWaiver: true,
      additionalPerks: ['Priority support', 'Exclusive offers', 'Enhanced trade-in values']
    },
    eligibility: 'Business customers, long-term customers, premium plans',
    activeProgram: true
  },

  // Trade-In Boost Programs
  tradeInBoost: {
    id: 'trade_boost',
    name: 'Trade-In Boost',
    description: 'Enhanced trade-in values for device upgrades',
    benefits: {
      payoffAmount: 400,
      tradeinCredit: 500, // Enhanced trade-in values
      planDiscount: 0,
      activationWaiver: false,
      tradeInMultiplier: 1.5 // 50% boost to standard trade-in values
    },
    eligibleDevices: ['iPhone 12 and newer', 'Galaxy S21 and newer', 'Pixel 6 and newer'],
    activeProgram: true
  },

  // Business Programs
  businessAdvantage: {
    id: 'business_advantage',
    name: 'T-Mobile for Business Advantage',
    description: 'Exclusive business customer benefits',
    benefits: {
      payoffAmount: 1000,
      tradeinCredit: 400,
      planDiscount: 15, // Monthly discount per line for business
      activationWaiver: true,
      businessPerks: ['Dedicated support', 'Volume discounts', 'Device financing']
    },
    eligibility: 'Business accounts with 3+ lines',
    activeProgram: false // Can be enabled
  },

  // Senior/Military Programs (Updated with 2025 Experience Plan Pricing)
  seniorMilitary: {
    id: 'senior_military',
    name: 'Senior & Military Advantage',
    description: '55+ and Military/First Responder discount plans - Up to $25/mo savings per line',
    benefits: {
      payoffAmount: 500,
      tradeinCredit: 250,
      planDiscount: 25, // Up to $25/mo per line savings on Experience plans
      activationWaiver: true,
      specialPricing: true,
      experiencePlans: {
        essentials: { individual: 45, family2: 35 }, // $15-25 savings
        experienceMore: { individual: 70, family2: 30 }, // $15-25 savings  
        experienceBeyond: { individual: 85, family2: 45 } // $15-25 savings
      }
    },
    eligibility: 'Primary account holder 55+, Military (active/veteran), First responders',
    verification: 'Age or military/first responder verification required',
    activeProgram: true
  },

  // Family Programs
  familyValue: {
    id: 'family_value',
    name: 'Family Value Program',
    description: 'Multi-line family discounts and benefits',
    benefits: {
      payoffAmount: 400,
      tradeinCredit: 200,
      planDiscount: 5, // Per line discount (increases with more lines)
      activationWaiver: false,
      familyPerks: ['Free Netflix', 'Apple TV+', 'Amazon Prime']
    },
    lineDiscounts: {
      2: 5,  // $5/line for 2 lines
      3: 10, // $10/line for 3 lines
      4: 15, // $15/line for 4+ lines
    },
    activeProgram: true
  },

  // Promotional Programs (Limited Time)
  limitedTimeOffer: {
    id: 'limited_offer',
    name: 'Limited Time Special',
    description: 'Current promotional offer - varies monthly',
    benefits: {
      payoffAmount: 750,
      tradeinCredit: 350,
      planDiscount: 25, // Promotional discount
      activationWaiver: true,
      bonusOffers: ['Free accessories', '6 months premium services']
    },
    validUntil: '2025-02-28', // Expiration date
    activeProgram: false // Admin can activate
  },

  // Online Exclusive
  onlineExclusive: {
    id: 'online_exclusive',
    name: 'Online Exclusive Deals',
    description: 'Special offers for online activations',
    benefits: {
      payoffAmount: 600,
      tradeinCredit: 300,
      planDiscount: 10,
      activationWaiver: true,
      onlineBonus: 'Additional $100 credit for online activation'
    },
    channel: 'Online only',
    activeProgram: true
  }
};

// Program categories for admin organization
export const programCategories = {
  switching: ['keep_switch', 'magenta_status'],
  tradeIn: ['trade_boost', 'online_exclusive'], 
  demographic: ['senior_military', 'business_advantage'],
  family: ['family_value'],
  promotional: ['limited_offer']
};

// Default active programs (can be customized per store)
export const defaultActivePrograms = [
  'keep_switch',
  'magenta_status', 
  'trade_boost',
  'senior_military',
  'family_value',
  'online_exclusive'
];

// Function to get active programs
export const getActivePrograms = (customPrograms = null) => {
  const activeList = customPrograms || defaultActivePrograms;
  return activeList.map(id => monthlyPrograms[id]).filter(program => program);
};

// Function to calculate program benefits
export const calculateProgramBenefits = (programId, customerData) => {
  const program = monthlyPrograms[programId];
  if (!program) return null;

  let benefits = { ...program.benefits };
  
  // Apply family line discounts if applicable
  if (program.lineDiscounts && customerData.lines > 1) {
    const lineCount = Math.min(customerData.lines, 4);
    benefits.planDiscount = program.lineDiscounts[lineCount] || benefits.planDiscount;
  }

  // Apply trade-in multiplier if applicable
  if (program.benefits.tradeInMultiplier && customerData.devices) {
    benefits.enhancedTradeIn = customerData.devices.map(device => ({
      ...device,
      tradeInValue: Math.floor(device.tradeInValue * program.benefits.tradeInMultiplier)
    }));
  }

  return {
    program: program,
    benefits: benefits,
    monthlyDiscount: benefits.planDiscount * customerData.lines,
    totalPayoff: Math.min(benefits.payoffAmount, customerData.devicePayoff || 0),
    additionalTradeCredit: benefits.tradeinCredit
  };
};