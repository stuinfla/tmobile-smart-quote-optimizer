// T-Mobile September 2025 Official Promotions - Updated September 12, 2025
export const promotions = {
  smartphone_deals: {
    IPHONE_17_PRO_ON_US: {
      name: "iPhone 17 Pro On Us",
      device: "iPhone 17 Pro",
      discount_value: 1100,
      original_price: 1099.99,
      final_price: 0.00,
      requirements: {
        trade_in: "any_condition",
        plan: ["Experience Beyond"]
      },
      terms: "24 monthly bill credits, $35 activation fee, taxes due",
      status: "Active",
      start_date: "2025-09-12",
      comments: "HOTTEST DEAL - Just launched today! Any condition trade accepted"
    },
    IPHONE_17_FREE: {
      name: "iPhone 17 Free",
      device: "iPhone 17",
      discount_value: 830,
      original_price: 829.99,
      final_price: 0.00,
      requirements: {
        trade_in: false,
        switch_and_new_line: true,
        plan: ["Experience More"]
      },
      terms: "24 monthly bill credits, port from AT&T/Verizon/select carriers",
      status: "Active",
      start_date: "2025-09-12",
      comments: "NEW LAUNCH - No trade required for switchers"
    },
    IPHONE_AIR_ON_US: {
      name: "iPhone Air On Us",
      device: "iPhone Air",
      discount_value: 1000,
      original_price: 999.99,
      final_price: 0.00,
      requirements: {
        trade_in: false,
        switch_and_new_line: true,
        plan: ["Experience Beyond"]
      },
      terms: "24 monthly bill credits, qualifying service plan",
      status: "Active", 
      start_date: "2025-09-12",
      comments: "THINNEST iPHONE EVER - Revolutionary design"
    },
    PIXEL_10_ON_US: {
      name: "Pixel 10 On Us",
      device: "Google Pixel 10",
      discount_value: 1000,
      original_price: 799.99,
      final_price: 0.00,
      requirements: {
        trade_in: false,
        add_line: true,
        plan: ["Experience Beyond"] // $1K off with this plan
      },
      terms: "24 monthly bill credits, T-Satellite ready apps included",
      status: "Active",
      start_date: "2025-08-20",
      comments: "AI-POWERED - Early access to satellite apps"
    },
    GALAXY_S25_FE_SPECIAL: {
      name: "Galaxy S25 FE Special",
      device: "Samsung Galaxy S25 FE",
      discount_value: 450,
      original_price: 499.99,
      final_price: 49.99,
      requirements: {
        add_line: true,
        plan_minimum: 60 // $60+/month plan required
      },
      terms: "24 monthly bill credits, Galaxy AI features free through 2025",
      status: "Active",
      start_date: "2025-09-04",
      comments: "JUST RELEASED - Sept 4th launch, Galaxy AI included"
    }
  },
  smartwatch_deals: {
    WATCH_SE3_DEAL: {
      name: "Apple Watch SE3 Deal",
      device: "Apple Watch SE3",
      discount_value: 200,
      original_price: 299.99,
      final_price: 99.00,
      requirements: {
        add_watch_line: true,
        watch_plan_minimum: 15 // $15+/month watch plan
      },
      terms: "24 monthly bill credits, $35 connection charge",
      status: "Active",
      start_date: "2025-09-12",
      comments: "APPLE LAUNCH - Coincides with iPhone 17 launch"
    },
    GALAXY_WATCH8_ON_US: {
      name: "Galaxy Watch8 On Us",
      device: "Galaxy Watch8 40mm",
      discount_value: 329.99,
      original_price: 329.99,
      final_price: 0.00,
      requirements: {
        add_wearable_line: true,
        eligible_wearable_plan: true
      },
      terms: "36 monthly bill credits",
      status: "Active",
      start_date: "2025-08-01",
      comments: "HEALTH FOCUSED - Advanced health tracking"
    }
  },
  tablet_deals: {
    GALAXY_TAB_A9_PLUS_FREE: {
      name: "Galaxy Tab A9+ Free",
      device: "Samsung Galaxy Tab A9+",
      discount_value: 279.99,
      original_price: 279.99,
      final_price: 0.00,
      requirements: {
        add_tablet_line: true,
        qualifying_tablet_plan: true
      },
      terms: "24 monthly bill credits",
      status: "Active",
      start_date: "2025-08-15",
      comments: "PRODUCTIVITY - Great for work/school"
    },
    IPAD_A16_DEAL: {
      name: "iPad A16 Deal", 
      device: "iPad (A16)",
      discount_value: 200,
      original_price: 399.99,
      final_price: 199.99,
      requirements: {
        add_tablet_line: true,
        qualifying_service: true
      },
      terms: "24 monthly bill credits",
      status: "Active",
      start_date: "2025-08-20",
      comments: "APPLE TABLET - Latest A16 chip"
    }
  },
  switching_benefits: {
    KEEP_YOUR_PHONE: {
      name: "Keep Your Phone",
      max_per_line: 800,
      requirements: {
        byod: true, // Bring Your Own Device
        switch_from_major_carrier: true,
        qualifying_plans: true
      },
      payment_method: "virtual_prepaid_card",
      terms: "Virtual prepaid card to cover ETF/payoffs",
      status: "Active",
      start_date: "2025-08-01",
      comments: "SWITCHER SPECIAL - Covers cancellation costs"
    },
    SWITCH_AND_SAVE: {
      name: "Switch & Save",
      max_value: 800,
      requirements: {
        switch_from_major_carrier: ["Verizon", "AT&T", "UScellular"],
        qualifying_plans: true
      },
      payment_method: "virtual_prepaid_card",
      terms: "Virtual prepaid card, covers ETFs",
      status: "Active",
      start_date: "2025-08-01", 
      comments: "CARRIER FREEDOM - Leave your old carrier worry-free"
    }
  },
  home_internet_deals: {
    HOME_INTERNET_CASH_BACK: {
      name: "$300 Cash Back",
      value: 300,
      requirements: {
        new_activation: true,
        online_activation: true,
        plan: "5G Home Internet plans"
      },
      payment_method: "virtual_prepaid_mastercard",
      terms: "Virtual prepaid Mastercard, 14 weeks delivery, expires 6 months",
      status: "Active - Limited Time",
      start_date: "2025-08-01",
      comments: "LIMITED TIME - Must activate online, virtual card expires"
    },
    HOME_INTERNET_BUNDLE: {
      name: "$20/month savings",
      monthly_savings: 20,
      annual_savings: 240,
      original_price: 50,
      bundle_price: 30,
      requirements: {
        bundle_with_voice_line: true,
        any_voice_line: true
      },
      terms: "Monthly bill credits, 5-year price guarantee",
      status: "Active",
      start_date: "2025-08-01",
      comments: "BUNDLE SAVINGS - Significant monthly discount"
    }
  }
};

// Helper function to get current active promotions
export const getCurrentPromotions = () => {
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const activePromotions = {};
  
  Object.keys(promotions).forEach(category => {
    activePromotions[category] = {};
    Object.keys(promotions[category]).forEach(promoKey => {
      const promo = promotions[category][promoKey];
      if (promo.status === "Active" || promo.status === "Active - Limited Time") {
        activePromotions[category][promoKey] = promo;
      }
    });
  });
  
  return activePromotions;
};

export default promotions;