// Complete T-Mobile Pricing Database - September 2025
// Generated from comprehensive CSV data

export const completePricingDatabase = {
  // Core pricing plans with discount tiers
  postpaidPlans: {
    experienceBeyond: {
      name: "Experience Beyond",
      features: {
        premiumData: "100GB",
        hotspot: "50GB",
        video: "4K UHD",
        international: "Unlimited Mexico/Canada + International Pass"
      },
      pricing: {
        standard: {
          1: 105, 2: 180, 3: 230, 4: 280, 5: 330,
          6: 380, 7: 430, 8: 480, 9: 535, 10: 590,
          11: 645, 12: 700
        },
        firstResponder: {
          1: 90, 2: 140, 3: 180, 4: 220, 5: 260,
          6: 300, 7: 350, 8: 400, 9: 450, 10: 500,
          11: 550, 12: 600
        },
        military: {
          1: 90, 2: 140, 3: 180, 4: 220, 5: 260,
          6: 300, 7: 350, 8: 400, 9: 450, 10: 500,
          11: 550, 12: 600
        },
        seniorPlus55: {
          1: 90, 2: 140  // Only available for 1-2 lines
        }
      },
      autopayDiscount: 10
    },
    experienceMore: {
      name: "Experience More",
      features: {
        premiumData: "50GB",
        hotspot: "15GB",
        video: "HD",
        international: "Unlimited Mexico/Canada"
      },
      pricing: {
        standard: {
          1: 90, 2: 150, 3: 185, 4: 220, 5: 255,
          6: 290, 7: 325, 8: 360, 9: 400, 10: 440,
          11: 480, 12: 520
        },
        firstResponder: {
          1: 75, 2: 115, 3: 145, 4: 175, 5: 205,
          6: 235, 7: 265, 8: 295, 9: 325, 10: 355,
          11: 385, 12: 415
        },
        military: {
          1: 75, 2: 115, 3: 145, 4: 175, 5: 205,
          6: 235, 7: 265, 8: 295, 9: 325, 10: 355,
          11: 385, 12: 415
        },
        seniorPlus55: {
          1: 75, 2: 115  // Only available for 1-2 lines
        }
      },
      autopayDiscount: 10
    },
    essentialsSaver: {
      name: "Essentials Saver",
      features: {
        premiumData: "Unlimited (deprioritized after 50GB)",
        hotspot: "3GB",
        video: "SD",
        international: "Unlimited Mexico/Canada"
      },
      pricing: {
        standard: {
          1: 55, 2: 95, 3: 120, 4: 145, 5: 170,
          6: 195, 7: 220, 8: 245, 9: 270, 10: 295,
          11: 320, 12: 345
        },
        firstResponder: {
          1: 45, 2: 75, 3: 95, 4: 115, 5: 135,
          6: 155, 7: 175, 8: 195, 9: 215, 10: 235,
          11: 255, 12: 275
        },
        military: {
          1: 45, 2: 75, 3: 95, 4: 115, 5: 135,
          6: 155, 7: 175, 8: 195, 9: 215, 10: 235,
          11: 255, 12: 275
        },
        seniorPlus55: {
          1: 45, 2: 75  // Only available for 1-2 lines
        }
      },
      autopayDiscount: 5
    }
  },

  // Business Plans
  businessPlans: {
    superMobile: {
      name: "Business SuperMobile",
      features: {
        premiumData: "100GB",
        hotspot: "Unlimited",
        video: "HD",
        international: "Unlimited Mexico/Canada",
        extras: "Enhanced management features and priority support"
      },
      pricing: {
        1: 90, 2: 150, 3: 200, 4: 250, 5: 300,
        6: 350, 7: 340, 8: 380, 9: 420, 10: 460,
        11: 500, 12: 540
      }
    },
    proMobile: {
      name: "Business ProMobile",
      features: {
        premiumData: "50GB",
        hotspot: "15GB",
        video: "HD",
        international: "Unlimited Mexico/Canada",
        extras: "Enhanced management features and priority support"
      },
      pricing: {
        1: 70, 2: 120, 3: 150, 4: 180, 5: 210,
        6: 240, 7: 270, 8: 300, 9: 330, 10: 360,
        11: 390, 12: 420
      }
    },
    coreMobile: {
      name: "Business CoreMobile",
      features: {
        premiumData: "Unlimited (deprioritized after 50GB)",
        hotspot: "15GB",
        video: "HD",
        international: "Unlimited Mexico/Canada",
        extras: "Enhanced management features and priority support"
      },
      pricing: {
        1: 55, 2: 95, 3: 120, 4: 145, 5: 170,
        6: 195, 7: 220, 8: 245, 9: 270, 10: 295,
        11: 320, 12: 345
      }
    }
  },

  // Prepaid Plans
  prepaidPlans: {
    starter: {
      name: "Prepaid Starter",
      features: {
        data: "5GB High-Speed",
        hotspot: "5GB",
        video: "SD",
        international: "International texting"
      },
      pricing: {
        1: 45, 2: 75, 3: 105, 4: 135, 5: 165
      },
      connectionCharge: 25
    },
    unlimited: {
      name: "Prepaid Unlimited",
      features: {
        data: "Unlimited (50GB Premium)",
        hotspot: "5GB",
        video: "SD",
        international: "Unlimited Mexico/Canada"
      },
      pricing: {
        1: 50, 2: 80, 3: 110, 4: 140, 5: 170
      },
      connectionCharge: 25
    },
    unlimitedPlus: {
      name: "Prepaid Unlimited Plus",
      features: {
        data: "Unlimited (100GB Premium)",
        hotspot: "10GB",
        video: "HD",
        international: "Unlimited Mexico/Canada"
      },
      pricing: {
        1: 65, 2: 95, 3: 125, 4: 155, 5: 185
      },
      connectionCharge: 25
    }
  },

  // Accessory Lines
  accessoryLines: {
    watch: {
      name: "Smartwatch Line",
      prices: {
        withVoice: 10,
        standalone: 15
      },
      requiresVoiceLine: false
    },
    tablet: {
      name: "Tablet Line",
      dataOptions: {
        partial5GB: {
          name: "5GB Partial Data",
          price: 5,
          data: "5GB"
        },
        unlimited: {
          name: "Unlimited Data",
          price: 20,
          data: "Unlimited",
          secondLineDiscount: 0.5 // 50% off second unlimited tablet
        }
      }
    },
    laptop: {
      name: "Laptop Line",
      dataOptions: {
        partial5GB: {
          name: "5GB Partial Data",
          price: 5,
          data: "5GB"
        },
        unlimited: {
          name: "Unlimited Data",
          price: 20,
          data: "Unlimited"
        }
      }
    },
    hotspot: {
      name: "Mobile Hotspot",
      dataOptions: {
        "2GB": { price: 10, data: "2GB" },
        "5GB": { price: 20, data: "5GB" },
        "10GB": { price: 30, data: "10GB" },
        "30GB": { price: 40, data: "30GB" },
        "50GB": { price: 50, data: "50GB" }
      }
    }
  },

  // Home Internet
  homeInternet: {
    rely: {
      name: "Home Internet Rely",
      speed: "Up to 100 Mbps",
      pricing: {
        standalone: 50,
        withVoice: 35,
        with2PlusLines: 0 // FREE with 2+ voice lines
      }
    },
    amplified: {
      name: "Home Internet Amplified",
      speed: "Up to 245 Mbps",
      pricing: {
        standalone: 60,
        withVoice: 45,
        with2PlusLines: 10 // $10 with 2+ voice lines
      }
    },
    allIn: {
      name: "Home Internet All-In",
      speed: "Up to 350+ Mbps",
      pricing: {
        standalone: 70,
        withVoice: 55,
        with2PlusLines: 20 // $20 with 2+ voice lines
      }
    },
    backup: {
      name: "Home Internet Backup",
      speed: "Up to 50 Mbps (backup only)",
      pricing: {
        standalone: 20,
        withVoice: 20
      }
    }
  },

  // Device Financing Options
  financing: {
    options: {
      "24": {
        name: "24-Month Financing",
        months: 24,
        apr: 0,
        downPaymentRequired: false
      },
      "36": {
        name: "36-Month Financing",
        months: 36,
        apr: 0,
        downPaymentRequired: false,
        savings: 0.333 // 33.3% lower monthly payment vs 24-month
      }
    },
    calculateMonthlyPayment: (retailPrice, months) => {
      return (retailPrice / months).toFixed(2);
    }
  },

  // Fees and Charges
  fees: {
    connection: {
      smartphone: 35,
      tablet: 35,
      smartwatch: 35,
      mobileInternet: 20,
      connectPlans: 20,
      prepaid: 25
    },
    regulatory: {
      recoveryFeePostpaid: 3.18,
      recoveryFeeBusiness: 3.18,
      federalUSF: 0.85,
      stateUSF: 0.15 // Varies by state
    },
    service: {
      upgradeSupport: 30, // In-store
      simStarterKit: 10,
      expeditedShipping: 25,
      deviceReturnRestocking: 70,
      paymentReversal: 20,
      paperBill: 5 // Waived with AutoPay
    },
    international: {
      roamingZoneA: 5, // Per day
      roamingZoneB: 10, // Per day
      roamingZoneC: 15 // Per day
    }
  },

  // Device Protection
  deviceProtection: {
    protection360: {
      tier1: {
        name: "Protection 360 - Tier 1",
        price: 7,
        coverage: "Phones up to $199"
      },
      tier2: {
        name: "Protection 360 - Tier 2",
        price: 12,
        coverage: "Phones $200-$599"
      },
      tier3: {
        name: "Protection 360 - Tier 3",
        price: 18,
        coverage: "Phones $600+"
      }
    },
    appleCarePlus: {
      name: "AppleCare+ with Theft and Loss",
      price: 13.99,
      coverage: "iPhone protection through Apple"
    },
    samsungCarePlus: {
      name: "Samsung Care+",
      price: 8.99,
      coverage: "Galaxy device protection through Samsung"
    },
    basic: {
      name: "Device Protection (Basic)",
      price: 5,
      coverage: "Basic coverage for accessories and tablets"
    }
  },

  // Customer Qualification System
  customerQualifications: {
    standard: {
      name: "Standard Customer",
      requiresVerification: false,
      discountPercentage: 0
    },
    military: {
      name: "Military",
      requiresVerification: true,
      verificationMethods: ["ID.me", "SheerID", "In-store with ID"],
      discountPercentage: 0.15, // ~15% discount on most plans
      eligiblePlans: ["experienceBeyond", "experienceMore", "essentialsSaver"]
    },
    firstResponder: {
      name: "First Responder",
      requiresVerification: true,
      verificationMethods: ["ID.me", "SheerID", "In-store with ID"],
      discountPercentage: 0.15, // ~15% discount on most plans
      eligiblePlans: ["experienceBeyond", "experienceMore", "essentialsSaver"],
      eligibleProfessions: [
        "Police Officers",
        "Firefighters",
        "EMTs/Paramedics",
        "911 Dispatchers",
        "State Troopers"
      ]
    },
    seniorPlus55: {
      name: "55+ Senior",
      requiresVerification: true,
      verificationMethods: ["Age verification in-store", "Online age verification"],
      discountPercentage: 0.15, // ~15% discount
      maxLines: 2, // Only available for 1-2 lines
      eligiblePlans: ["experienceBeyond", "experienceMore", "essentialsSaver"]
    },
    business: {
      name: "Business Account",
      requiresVerification: true,
      verificationMethods: ["Business Tax ID", "Business License"],
      hasSpecialPlans: true,
      eligiblePlans: ["superMobile", "proMobile", "coreMobile"]
    }
  },

  // South Florida Tax Rates
  taxRates: {
    southFlorida: {
      miamidade: {
        name: "Miami-Dade County",
        rate: 0.1444
      },
      palmbeach: {
        name: "Palm Beach County",
        rate: 0.1444
      },
      broward: {
        name: "Broward County",
        rate: 0.1344
      }
    }
  }
};

// Helper function to get plan pricing based on qualification
export const getPlanPricing = (planType, qualification, lineCount) => {
  const plan = completePricingDatabase.postpaidPlans[planType];
  if (!plan) return null;

  const pricingTier = plan.pricing[qualification] || plan.pricing.standard;
  return pricingTier[lineCount] || null;
};

// Helper function to calculate total with discounts
export const calculateTotalWithDiscounts = (basePlan, lineCount, qualification, hasAutopay) => {
  const basePrice = getPlanPricing(basePlan, qualification, lineCount);
  if (!basePrice) return null;

  const plan = completePricingDatabase.postpaidPlans[basePlan];
  const autopayDiscount = hasAutopay ? (plan.autopayDiscount * lineCount) : 0;
  
  return basePrice - autopayDiscount;
};

// Helper function for device financing calculation
export const calculateDeviceFinancing = (retailPrice, months = 24) => {
  return {
    monthlyPayment: (retailPrice / months).toFixed(2),
    totalCost: retailPrice,
    term: months
  };
};

// Helper function for accessory line pricing
export const calculateAccessoryLinePricing = (accessories, voiceLineCount) => {
  let total = 0;
  let details = [];

  // Watch lines
  if (accessories.watches) {
    const watchPrice = voiceLineCount > 0 ? 
      completePricingDatabase.accessoryLines.watch.prices.withVoice :
      completePricingDatabase.accessoryLines.watch.prices.standalone;
    
    total += watchPrice * accessories.watches;
    details.push({
      type: 'watch',
      count: accessories.watches,
      priceEach: watchPrice,
      total: watchPrice * accessories.watches
    });
  }

  // Tablet lines with 50% off second unlimited
  if (accessories.tablets) {
    accessories.tablets.forEach((tablet, index) => {
      let price = 0;
      if (tablet.dataType === 'partial') {
        price = completePricingDatabase.accessoryLines.tablet.dataOptions.partial5GB.price;
      } else {
        price = completePricingDatabase.accessoryLines.tablet.dataOptions.unlimited.price;
        // Apply 50% discount to second unlimited tablet
        if (index === 1 && tablet.dataType === 'unlimited') {
          price *= 0.5;
        }
      }
      total += price;
      details.push({
        type: 'tablet',
        dataType: tablet.dataType,
        price: price,
        discounted: index === 1 && tablet.dataType === 'unlimited'
      });
    });
  }

  // Home Internet with FREE for 2+ lines
  if (accessories.homeInternet) {
    const plan = completePricingDatabase.homeInternet[accessories.homeInternet.tier];
    let price = plan.pricing.standalone;
    
    if (voiceLineCount >= 2) {
      price = plan.pricing.with2PlusLines || 0;
    } else if (voiceLineCount === 1) {
      price = plan.pricing.withVoice;
    }
    
    total += price;
    details.push({
      type: 'homeInternet',
      tier: accessories.homeInternet.tier,
      price: price,
      free: voiceLineCount >= 2 && price === 0
    });
  }

  return {
    total,
    details
  };
};

export default completePricingDatabase;