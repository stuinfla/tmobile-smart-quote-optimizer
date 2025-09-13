export const promotions = {
  phone_deals: {
    GO5G_NEXT_BOGO: {
      name: "GO5G Next BOGO",
      description: "Buy One Get One $830 off",
      value: 830,
      requirements: {
        plan: "GO5G_Next",
        new_line: true,
        eligible_phones: ["flagship"]
      },
      stackable: false
    },
    GO5G_PLUS_BOGO: {
      name: "GO5G Plus BOGO",
      description: "Buy One Get One $830 off",
      value: 830,
      requirements: {
        plan: "GO5G_Plus",
        new_line: true,
        eligible_phones: ["flagship"]
      },
      stackable: false
    },
    TRADEIN_ANY_CONDITION: {
      name: "Trade Any Phone Any Condition",
      description: "$830 off with any trade-in",
      value: 830,
      requirements: {
        plan: ["GO5G_Plus", "GO5G_Next"],
        trade_in: "any_condition",
        upgrade_eligible: true
      },
      stackable: false
    },
    NEW_LINE_PROMO: {
      name: "New Line Promotion",
      description: "$830 off when adding a line",
      value: 830,
      requirements: {
        new_line: true,
        plan: ["GO5G_Plus", "GO5G_Next"]
      },
      stackable: true
    }
  },
  accessory_promotions: {
    WATCH_200_OFF: {
      name: "$200 off any Apple Watch",
      discount_amount: 200,
      description: "Get $200 off any Apple Watch when adding a new watch line",
      requirements: {
        new_watch_line: true
      },
      applies_to: ["Apple_Watch_SE3", "Apple_Watch_Series_10", "Apple_Watch_Ultra_2"]
    },
    IPAD_230_OFF: {
      name: "$230 off iPad Pro/Air",
      value: 230,
      eligible_devices: ["iPad_Pro_M4", "iPad_Air_M2"],
      requirements: {
        new_tablet_line: true
      }
    },
    SAMSUNG_TAB_FREE: {
      name: "Galaxy Tab A9+ Free",
      eligible_devices: ["Galaxy_Tab_A9_Plus"],
      requirements: {
        new_tablet_line: true
      }
    }
  },
  switcher_benefits: {
    KEEP_AND_SWITCH: {
      name: "Keep and Switch",
      max_per_line: 800,
      max_lines: 4,
      total_max: 3200,
      requirements: {
        eligible_carriers: ["Verizon", "AT&T", "UScellular", "Xfinity", "Spectrum"],
        min_device_payment_months: 3,
        documentation: "final_bill"
      },
      payment_method: "virtual_mastercard",
      processing_time_days: 15
    },
    PORT_IN_CREDIT: {
      general: 200,
      business: 200,
      max_lines: 3,
      total_max: 600
    },
    CARRIER_FREEDOM: {
      name: "Carrier Freedom",
      description: "Up to $800 per line to pay off phones",
      max_per_line: 800,
      max_lines: 5,
      requirements: {
        trade_in_required: false,
        eligible_carriers: ["Verizon", "AT&T"]
      }
    }
  },
  bundle_deals: {
    HOME_INTERNET_FREE: {
      name: "Home Internet Free",
      value: 60,
      monthly_savings: 60,
      requirements: {
        plan: ["GO5G_Plus", "GO5G_Next"],
        voice_lines: 2
      }
    },
    FAMILY_DISCOUNT: {
      name: "Family Line Discount",
      third_line_free: true,
      requirements: {
        min_lines: 3,
        plan: ["GO5G_Plus", "GO5G_Next"]
      }
    }
  },
  insider_codes: {
    INSIDER_20: {
      name: "Insider Code 20%",
      percentage: 20,
      max_monthly_discount: 40,
      lifetime_value: 4800,
      requirements: {
        new_account: true,
        min_lines: 2
      }
    }
  }
};