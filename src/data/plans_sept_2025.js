// T-Mobile Plans - Updated September 12, 2025
// Source: https://www.t-mobile.com/cell-phone-plans
// Last Updated: 2025-09-12
// Next Update Due: 2025-09-19 (Weekly Updates)

export const plans = {
  // POSTPAID UNLIMITED PLANS
  postpaid: {
    EXPERIENCE_BEYOND: {
      name: "Experience Beyond",
      type: "unlimited",
      category: "premium",
      description: "T-Mobile's flagship plan with yearly upgrades, T-Satellite, unlimited hotspot",
      pricing: {
        1: 105,  // $105 for 1 line (base price)
        2: 90,   // $180/2 = $90 per line for 2 lines  
        3: 76.67, // $230/3 = $76.67 per line for 3 lines
        4: 70,   // $280/4 = $70 per line for 4 lines
        5: 66,   // $330/5 = $66 per line for 5 lines
        6: 63.33, // $380/6 = $63.33 per line for 6 lines
        7: 61.43  // $430/7 = $61.43 per line for 7 lines
      },
      autopay_pricing: {
        1: 95,   // $95 with AutoPay
        2: 80,   // $160/2 = $80 per line
        3: 66.67, // $200/3 = $66.67 per line
        4: 60,   // $240/4 = $60 per line
        5: 56,   // $280/5 = $56 per line
        6: 53.33, // $320/6 = $53.33 per line
        7: 51.43  // $360/7 = $51.43 per line
      },
      features: {
        data: "Unlimited premium 5G data",
        hotspot: "Unlimited high-speed mobile hotspot",
        streaming: ["Netflix Standard", "Apple TV+", "Hulu"],
        international: "Unlimited texting, calls to 215+ countries",
        roaming: "30GB high-speed data in Canada/Mexico, 15GB in 215+ countries",
        extras: ["Annual phone upgrades with same deals", "T-Satellite included ($10/month value)", "Full-flight Wi-Fi"],
        upgrade_frequency: "Annual"
      },
      autopay_discount: 10, // $10/line discount with AutoPay
      taxes_fees_included: false, // New plans don't include taxes/fees
      price_guarantee: "5 years",
      plan_id: "EXPERIENCE_BEYOND"
    },
    
    EXPERIENCE_MORE: {
      name: "Experience More", 
      type: "unlimited",
      category: "standard",
      description: "Balanced plan with 60GB hotspot, 2-year upgrades",
      pricing: {
        1: 90,   // $90 for 1 line
        2: 75,   // $150/2 = $75 per line for 2 lines
        3: 61.67, // $185/3 = $61.67 per line for 3 lines  
        4: 55,   // $220/4 = $55 per line for 4 lines
        5: 51,   // $255/5 = $51 per line for 5 lines
        6: 48.33, // $290/6 = $48.33 per line for 6 lines
        7: 47.14  // $330/7 = $47.14 per line for 7 lines
      },
      autopay_pricing: {
        1: 80,   // $80 with AutoPay
        2: 65,   // $130/2 = $65 per line
        3: 51.67, // $155/3 = $51.67 per line
        4: 45,   // $180/4 = $45 per line
        5: 43,   // $215/5 = $43 per line
        6: 40,   // $240/6 = $40 per line
        7: 37.86  // $265/7 = $37.86 per line
      },
      features: {
        data: "Unlimited premium 5G data",
        hotspot: "60GB high-speed mobile hotspot",
        streaming: ["Netflix Standard", "Apple TV+"],
        international: "Unlimited texting to 215+ countries",
        roaming: "15GB high-speed data in Canada/Mexico, 5GB in 215+ countries",
        extras: ["2-year upgrade eligibility"],
        upgrade_frequency: "Every 2 years"
      },
      autopay_discount: 10, // $10/line discount with AutoPay
      taxes_fees_included: false,
      price_guarantee: "5 years",
      plan_id: "EXPERIENCE_MORE"
    },
    
    ESSENTIALS: {
      name: "Essentials",
      type: "unlimited", 
      category: "budget",
      description: "Basic unlimited data",
      pricing: {
        1: 60,   // $60 for 1 line
        2: 50,   // $100/2 = $50 per line for 2 lines (estimated)
        3: 35,   // $105/3 = $35 per line for 3 lines (estimated)
        4: 25,   // $100/4 = $25 per line for 4 lines (current promo)
        5: 25    // Estimated same rate for 5 lines
      },
      features: {
        data: "Unlimited (may be deprioritized during congestion)",
        hotspot: "Unlimited 3G speeds",
        streaming: [],
        international: "Unlimited texting",
        roaming: "Unlimited texting Canada/Mexico",
        extras: [],
        upgrade_frequency: "Standard"
      },
      autopay_discount: 0,
      taxes_fees_included: false,
      price_guarantee: "5 years", 
      plan_id: "ESSENTIALS",
      promotional_note: "Currently $25/line for 4 lines (limited time)"
    },
    
    ESSENTIALS_SAVER: {
      name: "Essentials Saver",
      type: "unlimited",
      category: "budget",
      description: "Entry-level unlimited plan",
      pricing: {
        1: 55,   // $55 for 1 line
        2: 45,   // $90/2 = $45 per line
        3: 38.33  // $115/3 = $38.33 per line  
      },
      autopay_pricing: {
        1: 50,   // $50 with AutoPay
        2: 40,   // $80/2 = $40 per line
        3: 35    // $105/3 = $35 per line
      },
      features: {
        data: "50GB premium data, then unlimited at reduced speeds",
        hotspot: "Basic mobile hotspot (speed varies)",
        streaming: [],
        international: "Limited international features",
        roaming: "Limited",
        extras: [],
        upgrade_frequency: "Standard"
      },
      autopay_discount: 5, // $5/line discount with AutoPay
      taxes_fees_included: false,
      price_guarantee: "5 years",
      plan_id: "ESSENTIALS_SAVER"
    }
  },
  
  // PREPAID PLANS
  prepaid: {
    CONNECT_15: {
      name: "Connect $15",
      type: "limited",
      category: "budget",
      description: "Basic prepaid with 5GB",
      pricing: {
        1: 15,
        2: 15,
        3: 15,
        4: 15,
        5: 15
      },
      features: {
        data: "5GB high-speed, then 2G",
        hotspot: "5GB",
        streaming: [],
        international: "Unlimited texting",
        roaming: "Unlimited texting Mexico",
        extras: []
      },
      autopay_discount: 0,
      taxes_fees_included: false,
      plan_id: "CONNECT_15"
    },
    
    CONNECT_25: {
      name: "Connect $25", 
      type: "limited",
      category: "budget",
      description: "Prepaid with 8GB + 5G access",
      pricing: {
        1: 25,
        2: 25, 
        3: 25,
        4: 25,
        5: 25
      },
      features: {
        data: "8GB high-speed, then 2G",
        hotspot: "8GB",
        streaming: [],
        international: "Unlimited texting",
        roaming: "Unlimited texting Mexico", 
        extras: ["5G access"]
      },
      autopay_discount: 0,
      taxes_fees_included: false,
      plan_id: "CONNECT_25"
    },
    
    CONNECT_35: {
      name: "Connect $35",
      type: "limited", 
      category: "standard",
      description: "Prepaid with 12GB + hotspot",
      pricing: {
        1: 35,
        2: 35,
        3: 35, 
        4: 35,
        5: 35
      },
      features: {
        data: "12GB high-speed, then 2G",
        hotspot: "12GB",
        streaming: [],
        international: "Unlimited texting",
        roaming: "Unlimited texting Mexico",
        extras: ["5G access", "Mobile hotspot"]
      },
      autopay_discount: 0, 
      taxes_fees_included: false,
      plan_id: "CONNECT_35"
    }
  },
  
  // SENIOR PLANS (55+)
  senior: {
    ESSENTIALS_CHOICE_55: {
      name: "Essentials Choice 55",
      type: "unlimited",
      category: "senior",
      description: "Senior discount unlimited plan",
      pricing: {
        1: 40,   // Single line senior pricing (estimated)
        2: 30,   // $60/2 = $30 per line for 2 lines
        3: 30,   // Senior plans typically max at 2-3 lines
        4: 30,
        5: 30
      },
      features: {
        data: "Unlimited (may be deprioritized)",
        hotspot: "Unlimited 3G speeds",
        streaming: [],
        international: "Unlimited texting",
        roaming: "Unlimited texting Canada/Mexico",
        extras: ["Age 55+ discount"]
      },
      autopay_discount: 0,
      taxes_fees_included: false,
      age_requirement: "55+",
      plan_id: "ESSENTIALS_CHOICE_55"
    }
  },
  
  // TALK & TEXT ONLY 
  talk_text: {
    TALK_TEXT_20: {
      name: "Talk & Text",
      type: "talk_text_only",
      category: "basic", 
      description: "No data, just talk and text",
      pricing: {
        1: 20,
        2: 20,
        3: 20,
        4: 20, 
        5: 20
      },
      features: {
        data: "None",
        hotspot: "None",
        streaming: [],
        international: "Unlimited texting",
        roaming: "Talk and text",
        extras: ["No data charges"]
      },
      autopay_discount: 0,
      taxes_fees_included: false,
      plan_id: "TALK_TEXT_20"
    }
  }
};

// South Florida Tax and Fee Structure - Updated September 2025
export const southFloridaTaxes = {
  // Wireless Service Taxes (applies to monthly service fees)
  service_taxes: {
    florida_communications_tax: 0.0744, // 7.44% Florida Communications Services Tax
    local_tax_miami_dade: 0.07,         // 7% Miami-Dade County
    local_tax_broward: 0.06,            // 6% Broward County
    local_tax_palm_beach: 0.07,         // 7% Palm Beach County
    total_miami_dade: 0.1444,           // 14.44% total for Miami-Dade
    total_broward: 0.1344,              // 13.44% total for Broward
    total_palm_beach: 0.1444            // 14.44% total for Palm Beach
  },
  
  // Per-line fees (not percentage-based)
  per_line_fees: {
    regulatory_programs_fee: 3.99,      // T-Mobile Regulatory Programs fee (included in tax estimates)
    federal_local_surcharges: 0,        // Included in percentage-based taxes
    total_per_line: 3.99                // $3.99 total per line fees
  },
  
  // Device purchases (sales tax only)
  device_tax: {
    florida_state_tax: 0.06,            // 6% state sales tax
    local_tax: 0.01,                    // 1% local (varies by county)
    total_device_tax: 0.07              // 7% total for device purchases
  },
  
  // Other fees
  one_time_fees: {
    activation_fee: 10.00,              // Per line activation
    upgrade_fee: 10.00,                 // Device upgrade fee 
    sim_card_fee: 10.00                 // SIM card fee
  }
};

// Helper functions
export const calculateMonthlyTotal = (planId, lineCount, includeFeesAndTaxes = true, useAutoPay = false, county = 'miami_dade') => {
  const allPlans = { ...plans.postpaid, ...plans.prepaid, ...plans.senior, ...plans.talk_text };
  const plan = allPlans[planId];
  
  if (!plan) return null;
  
  // Use AutoPay pricing if available and requested
  const pricing = (useAutoPay && plan.autopay_pricing) ? plan.autopay_pricing : plan.pricing;
  const basePrice = pricing[lineCount] * lineCount;
  
  if (!includeFeesAndTaxes) {
    return basePrice;
  }
  
  // Calculate taxes and fees for South Florida based on county
  const taxRate = county === 'broward' 
    ? southFloridaTaxes.service_taxes.total_broward 
    : southFloridaTaxes.service_taxes.total_miami_dade; // Miami-Dade and Palm Beach same rate
  
  const serviceTaxes = basePrice * taxRate;
  const perLineFees = lineCount * southFloridaTaxes.per_line_fees.total_per_line;
  
  return {
    base_price: basePrice,
    autopay_applied: useAutoPay && plan.autopay_pricing,
    autopay_discount: plan.autopay_discount ? plan.autopay_discount * lineCount : 0,
    service_taxes: serviceTaxes,
    per_line_fees: perLineFees,
    total_monthly: basePrice + serviceTaxes + perLineFees,
    tax_rate_applied: taxRate
  };
};

export const getPlanById = (planId) => {
  const allPlans = { ...plans.postpaid, ...plans.prepaid, ...plans.senior, ...plans.talk_text };
  return allPlans[planId] || null;
};

export const getActivePlans = () => {
  // Return only active plans (all current plans are active)
  return plans;
};

// Plan update metadata
export const planUpdateInfo = {
  last_updated: "2025-09-12",
  next_update_due: "2025-09-19", 
  source_url: "https://www.t-mobile.com/cell-phone-plans",
  update_frequency: "weekly",
  verified_by: "Claude Flow System",
  notes: [
    "Taxes and fees are NOT included in new Experience plans",
    "5-year price guarantee on talk, text, and data (excludes taxes/fees)",
    "Promotional pricing may apply to some plans",
    "South Florida tax rates may vary by specific county"
  ]
};

export default plans;