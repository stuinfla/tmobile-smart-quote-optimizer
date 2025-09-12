export const plans = {
  postpaid: {
    GO5G_Next: {
      name: "GO5G Next",
      pricing: {
        1: 100,
        2: 150,
        3: 180,
        4: 210,
        5: 245,
        6: 280,
        7: 315,
        8: 350
      },
      features: {
        priority_data: "unlimited",
        hotspot: "50GB high-speed",
        international: "15GB high-speed in 215+ countries",
        streaming: ["Netflix Standard", "Apple TV+", "Hulu"],
        device_upgrade: "Every year",
        price_lock: true,
        scam_shield: "Premium"
      },
      device_lines: {
        tablet: 10,
        watch: 10,
        hotspot: 20
      },
      autopay_discount: 5
    },
    GO5G_Plus: {
      name: "GO5G Plus",
      pricing: {
        1: 90,
        2: 140,
        3: 170,
        4: 200,
        5: 230,
        6: 260,
        7: 290,
        8: 320
      },
      features: {
        priority_data: "unlimited",
        hotspot: "50GB high-speed",
        international: "10GB high-speed in 215+ countries",
        streaming: ["Netflix Standard", "Apple TV+"],
        device_upgrade: "Every 2 years",
        price_lock: true,
        scam_shield: "Premium"
      },
      device_lines: {
        tablet: 10,
        watch: 10,
        hotspot: 20
      },
      autopay_discount: 5
    },
    GO5G: {
      name: "GO5G",
      pricing: {
        1: 75,
        2: 130,
        3: 160,
        4: 185,
        5: 210,
        6: 235,
        7: 260,
        8: 285
      },
      features: {
        priority_data: "100GB",
        hotspot: "15GB high-speed",
        international: "5GB high-speed in 215+ countries",
        streaming: ["Netflix Basic"],
        device_upgrade: "Every 2 years",
        price_lock: false,
        scam_shield: "Basic"
      },
      device_lines: {
        tablet: 20,
        watch: 12,
        hotspot: 30
      },
      autopay_discount: 5
    },
    Essentials: {
      name: "Essentials",
      pricing: {
        1: 60,
        2: 90,
        3: 105,
        4: 120,
        5: 135,
        6: 150,
        7: 165,
        8: 180
      },
      features: {
        priority_data: "50GB",
        hotspot: "3G speeds",
        international: "Texting only",
        streaming: [],
        device_upgrade: "No annual upgrade",
        price_lock: false,
        scam_shield: "Basic"
      },
      device_lines: {
        tablet: 25,
        watch: 15,
        hotspot: 35
      },
      autopay_discount: 0
    }
  },
  prepaid: {
    Unlimited: {
      name: "Prepaid Unlimited",
      pricing: {
        1: 50,
        2: 80,
        3: 110,
        4: 140,
        5: 170
      },
      features: {
        priority_data: "50GB",
        hotspot: "5GB",
        international: "Canada & Mexico included",
        streaming: []
      }
    },
    "10GB": {
      name: "10GB Prepaid",
      pricing: {
        1: 40,
        2: 70,
        3: 100,
        4: 130,
        5: 160
      },
      features: {
        data: "10GB",
        hotspot: "Included in data",
        international: "Add-on available"
      }
    }
  },
  business: {
    Business_Unlimited_Ultimate: {
      name: "Business Unlimited Ultimate",
      pricing: {
        1: 110,
        2: 170,
        3: 210,
        4: 250,
        5: 290,
        "6-12": 47,
        "13+": 42
      },
      features: {
        priority_data: "unlimited",
        hotspot: "100GB high-speed",
        international: "Unlimited in 215+ countries",
        streaming: ["Netflix Standard", "Apple TV+", "Microsoft 365"],
        device_lines: {
          tablet: 5,
          watch: 5,
          hotspot: 15
        }
      }
    }
  }
};