// T-Mobile Experience Plans - Updated 2025 Pricing from Official Documentation
export const experiencePlans = {
  // Standard Experience Plans
  essentials: {
    id: 'essentials',
    name: 'Essentials',
    category: 'basic',
    pricing: {
      individual: 60,
      family2: 30, // per line (2 lines minimum)
      addALine: 15, // lines 3-6
      autopayDiscount: 5
    },
    features: {
      unlimitedTalk: true,
      unlimitedText: true,
      unlimitedData: true,
      dataSpeed: '3G after 50GB',
      hotspotData: '3G speeds',
      internationalRoaming: false,
      streaming: 'SD quality',
      priorityData: false
    },
    discounts: {
      age55Plus: {
        individual: 45,
        family2: 35,
        available: true
      },
      military: {
        individual: 45,
        family2: 35,
        available: true
      }
    }
  },

  experienceMore: {
    id: 'experience_more',
    name: 'Experience More',
    category: 'premium',
    pricing: {
      individual: 85,
      family2: 55,
      family3to8: 30, // lines 3-8
      family9to12: 40, // lines 9-12
      autopayDiscount: 5
    },
    features: {
      unlimitedTalk: true,
      unlimitedText: true,
      unlimitedData: true,
      priorityData: '100GB',
      hotspotData: '50GB high-speed',
      internationalRoaming: 'Canada/Mexico',
      streaming: 'HD/4K quality',
      netflix: 'Standard included',
      appleTV: 'Included',
      starlink: 'T-Satellite included (through end of year)',
      scamShield: 'Premium included'
    },
    discounts: {
      age55Plus: {
        individual: 70,
        family2: 30,
        available: true
      },
      military: {
        individual: 70,
        family2: 30,
        available: true
      }
    }
  },

  experienceBeyond: {
    id: 'experience_beyond',
    name: 'Experience Beyond',
    category: 'ultimate',
    pricing: {
      individual: 100,
      family2: 70,
      family3to8: 45, // lines 3-8
      family9to12: 65, // lines 9-12
      autopayDiscount: 5
    },
    features: {
      unlimitedTalk: true,
      unlimitedText: true,
      unlimitedData: true,
      priorityData: 'Unlimited premium',
      hotspotData: '50GB high-speed',
      internationalRoaming: 'Global',
      streaming: '4K UHD quality',
      netflix: 'Premium included',
      appleTV: 'Included',
      starlink: 'T-Satellite included',
      scamShield: 'Premium included',
      deviceUpgrade: 'Annual upgrades available',
      internationalData: '15GB high-speed'
    },
    discounts: {
      age55Plus: {
        individual: 85,
        family2: 45,
        available: true
      },
      military: {
        individual: 85,
        family2: 45,
        available: true
      }
    }
  }
};

// Legacy GO5G Plans (Still Available)
export const go5gPlans = {
  go5g: {
    id: 'go5g',
    name: 'GO5G',
    category: 'standard',
    pricing: {
      individual: 75,
      family4: 180, // 4 lines total
      autopayDiscount: 5
    },
    features: {
      unlimitedTalk: true,
      unlimitedText: true,
      unlimitedData: true,
      hotspotData: '15GB high-speed',
      priorityData: '50GB',
      streaming: 'HD quality',
      newInTwo: true // Guaranteed new customer promos
    }
  },

  go5gPlus: {
    id: 'go5g_plus', 
    name: 'GO5G Plus',
    category: 'premium',
    pricing: {
      individual: 90,
      family4: 220, // 4 lines total
      autopayDiscount: 5
    },
    features: {
      unlimitedTalk: true,
      unlimitedText: true,
      unlimitedData: true,
      priorityData: 'Unlimited premium',
      hotspotData: '50GB high-speed',
      streaming: '4K quality',
      internationalRoaming: 'Canada/Mexico 15GB',
      internationalData: '5GB',
      newInTwo: true,
      netflix: 'Standard included'
    }
  },

  go5gNext: {
    id: 'go5g_next',
    name: 'GO5G Next', 
    category: 'ultimate',
    pricing: {
      individual: 100,
      family4: 250, // 4 lines total
      autopayDiscount: 5
    },
    features: {
      unlimitedTalk: true,
      unlimitedText: true,
      unlimitedData: true,
      priorityData: 'Unlimited premium',
      hotspotData: '50GB high-speed',
      streaming: '4K quality',
      internationalRoaming: 'Canada/Mexico 15GB',
      internationalData: '5GB',
      deviceUpgrade: 'Annual upgrades',
      newInTwo: true,
      netflix: 'Standard included'
    }
  }
};

// Plan Categories for Organization
export const planCategories = {
  experience: ['essentials', 'experience_more', 'experience_beyond'],
  go5g: ['go5g', 'go5g_plus', 'go5g_next'],
  legacy: ['magenta', 'magenta_max'] // Being migrated to GO5G Plus
};

// Discount Programs
export const discountPrograms = {
  age55Plus: {
    name: '55+ Savings',
    description: 'Age 55+ discount plans with reduced pricing',
    eligibility: 'Primary account holder must be 55+',
    verification: 'Age verification required'
  },
  
  military: {
    name: 'Military & First Responder Savings',
    description: 'Special pricing for military and first responders',
    eligibility: 'Active military, veterans, or first responders',
    verification: 'Military/first responder verification required'
  },

  autopay: {
    name: 'AutoPay Discount',
    description: '$5 discount per line with eligible payment method',
    eligibility: 'AutoPay with bank account or debit card',
    amount: 5
  }
};

// Calculate plan pricing with discounts
export const calculatePlanPricing = (planId, lineCount, discounts = []) => {
  const allPlans = { ...experiencePlans, ...go5gPlans };
  const plan = allPlans[planId];
  
  if (!plan) return null;

  let basePrice = 0;
  
  // Calculate base pricing based on line count
  if (lineCount === 1) {
    basePrice = plan.pricing.individual;
  } else if (lineCount === 2) {
    basePrice = plan.pricing.family2 * 2 || plan.pricing.individual;
  } else if (lineCount >= 3 && lineCount <= 8) {
    const line12Price = plan.pricing.family2 * 2 || plan.pricing.individual;
    const additionalLines = lineCount - 2;
    const additionalPrice = (plan.pricing.family3to8 || plan.pricing.addALine || 30) * additionalLines;
    basePrice = line12Price + additionalPrice;
  } else if (lineCount >= 9 && lineCount <= 12) {
    const line18Price = plan.pricing.family2 * 2 + (plan.pricing.family3to8 || 30) * 6;
    const additionalLines = lineCount - 8;
    const additionalPrice = (plan.pricing.family9to12 || 40) * additionalLines;
    basePrice = line18Price + additionalPrice;
  }

  // Apply discounts
  let finalPrice = basePrice;
  let discountAmount = 0;

  discounts.forEach(discount => {
    switch(discount) {
      case 'autopay':
        discountAmount += (plan.pricing.autopayDiscount || 5) * lineCount;
        break;
      case 'age55Plus':
        if (plan.discounts?.age55Plus?.available) {
          // Use 55+ pricing if available
          if (lineCount === 1) {
            finalPrice = plan.discounts.age55Plus.individual;
          } else if (lineCount === 2) {
            finalPrice = plan.discounts.age55Plus.family2 * 2;
          }
        }
        break;
      case 'military':
        if (plan.discounts?.military?.available) {
          // Use military pricing if available
          if (lineCount === 1) {
            finalPrice = plan.discounts.military.individual;
          } else if (lineCount === 2) {
            finalPrice = plan.discounts.military.family2 * 2;
          }
        }
        break;
    }
  });

  // Apply autopay discount after other discounts
  if (discounts.includes('autopay')) {
    finalPrice -= (plan.pricing.autopayDiscount || 5) * lineCount;
  }

  return {
    planName: plan.name,
    basePrice: basePrice,
    finalPrice: Math.max(finalPrice, 0), // Ensure price doesn't go negative
    discountAmount: basePrice - finalPrice,
    monthlyPerLine: finalPrice / lineCount,
    features: plan.features,
    appliedDiscounts: discounts
  };
};

// Get recommended plan based on customer needs
export const getRecommendedPlan = (customerNeeds) => {
  const { 
    budget = 'moderate',
    dataUsage = 'moderate', 
    features = [],
    lineCount = 1,
    age55Plus = false,
    military = false
  } = customerNeeds;

  let recommendedPlan = 'experience_more'; // Default recommendation

  // Budget-based recommendations
  if (budget === 'budget') {
    recommendedPlan = 'essentials';
  } else if (budget === 'premium' || features.includes('annualUpgrades')) {
    recommendedPlan = 'experience_beyond';
  }

  // Feature-based adjustments
  if (features.includes('internationalRoaming') || features.includes('4k')) {
    recommendedPlan = 'experience_beyond';
  }

  return {
    planId: recommendedPlan,
    plan: experiencePlans[recommendedPlan] || go5gPlans[recommendedPlan],
    pricing: calculatePlanPricing(
      recommendedPlan, 
      lineCount, 
      [
        'autopay',
        ...(age55Plus ? ['age55Plus'] : []),
        ...(military ? ['military'] : [])
      ]
    ),
    reason: `Recommended based on ${budget} budget and ${dataUsage} data usage`
  };
};