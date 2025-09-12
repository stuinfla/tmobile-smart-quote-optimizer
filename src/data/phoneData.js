export const phoneData = {
  phones: {
    apple: {
      iPhone_17: {
        name: "iPhone 17",
        variants: {
          "256GB": 829.99,
          "512GB": 1029.99
        },
        carrier_discount: 30,
        colors: ["Mist Blue", "Lavender", "Black", "White", "Sage"]
      },
      iPhone_17_Pro: {
        name: "iPhone 17 Pro",
        variants: {
          "256GB": 1099.99,
          "512GB": 1299.99,
          "1TB": 1499.99
        },
        colors: ["Natural Titanium", "Desert Titanium", "Crystal Blue", "Obsidian"]
      },
      iPhone_17_Pro_Max: {
        name: "iPhone 17 Pro Max",
        variants: {
          "256GB": 1199.99,
          "512GB": 1399.99,
          "1TB": 1599.99
        },
        colors: ["Natural Titanium", "Desert Titanium", "Crystal Blue", "Obsidian"]
      },
      iPhone_16: {
        name: "iPhone 16",
        variants: {
          "128GB": 629.99,
          "256GB": 729.99,
          "512GB": 929.99
        },
        carrier_discount: 30,
        colors: ["Red", "Blue", "Black", "White", "Green"]
      }
    },
    samsung: {
      Galaxy_S25_Ultra: {
        name: "Galaxy S25 Ultra",
        variants: {
          "256GB": 1199.99,
          "512GB": 1399.99,
          "1TB": 1599.99
        },
        colors: ["Titanium Black", "Titanium Silver", "Titanium Blue", "Titanium Orange"]
      },
      Galaxy_S25_Plus: {
        name: "Galaxy S25+",
        variants: {
          "256GB": 999.99,
          "512GB": 1199.99
        },
        colors: ["Phantom Black", "Ice Blue", "Jade Green", "Sunset Pink"]
      },
      Galaxy_S25: {
        name: "Galaxy S25",
        variants: {
          "128GB": 799.99,
          "256GB": 899.99
        },
        colors: ["Phantom Black", "Ice Blue", "Jade Green", "Sunset Pink"]
      },
      Galaxy_Z_Fold6: {
        name: "Galaxy Z Fold6",
        variants: {
          "256GB": 1899.99,
          "512GB": 2099.99,
          "1TB": 2299.99
        },
        colors: ["Navy", "Pink", "Silver Shadow"]
      },
      Galaxy_Z_Flip6: {
        name: "Galaxy Z Flip6",
        variants: {
          "256GB": 1099.99,
          "512GB": 1299.99
        },
        colors: ["Mint", "Yellow", "Blue", "Silver Shadow"]
      }
    },
    google: {
      Pixel_9_Pro_XL: {
        name: "Pixel 9 Pro XL",
        variants: {
          "256GB": 1099.99,
          "512GB": 1299.99,
          "1TB": 1499.99
        },
        colors: ["Obsidian", "Porcelain", "Hazel", "Rose"]
      },
      Pixel_9_Pro: {
        name: "Pixel 9 Pro",
        variants: {
          "128GB": 899.99,
          "256GB": 999.99,
          "512GB": 1199.99
        },
        colors: ["Obsidian", "Porcelain", "Hazel", "Rose"]
      },
      Pixel_9: {
        name: "Pixel 9",
        variants: {
          "128GB": 699.99,
          "256GB": 799.99
        },
        colors: ["Obsidian", "Porcelain", "Wintergreen", "Peony"]
      }
    },
    motorola: {
      Edge_Plus_2025: {
        name: "Motorola Edge+ 2025",
        variants: {
          "256GB": 799.99,
          "512GB": 899.99
        },
        colors: ["Midnight Blue", "Aurora Green"]
      },
      Razr_Plus_2024: {
        name: "Motorola Razr+",
        variants: {
          "256GB": 999.99,
          "512GB": 1099.99
        },
        colors: ["Spring Green", "Infinite Black", "Peach Fuzz"]
      }
    },
    oneplus: {
      OnePlus_12: {
        name: "OnePlus 12",
        variants: {
          "256GB": 799.99,
          "512GB": 899.99
        },
        colors: ["Flowy Emerald", "Silky Black"]
      }
    }
  }
};

export const tradeInValues = {
  // iPhone 17 Series
  iPhone_17_Pro_Max: 1000,
  iPhone_17_Pro: 1000,
  iPhone_17_Plus: 830,
  iPhone_17: 830,
  
  // iPhone 16 Series
  iPhone_16_Pro_Max: 830,
  iPhone_16_Pro: 830,
  iPhone_16_Plus: 650,
  iPhone_16: 650,
  
  // iPhone 15 Series
  iPhone_15_Pro_Max: 830,
  iPhone_15_Pro: 830,
  iPhone_15_Plus: 650,
  iPhone_15: 650,
  
  // iPhone 14 Series
  iPhone_14_Pro_Max: 650,
  iPhone_14_Pro: 650,
  iPhone_14_Plus: 500,
  iPhone_14: 500,
  
  // iPhone 13 Series
  iPhone_13_Pro_Max: 500,
  iPhone_13_Pro: 500,
  iPhone_13_mini: 350,
  iPhone_13: 400,
  
  // iPhone 12 Series
  iPhone_12_Pro_Max: 400,
  iPhone_12_Pro: 400,
  iPhone_12_mini: 250,
  iPhone_12: 300,
  
  // iPhone 11 Series
  iPhone_11_Pro_Max: 300,
  iPhone_11_Pro: 300,
  iPhone_11: 200,
  
  // iPhone XS/XR Series
  iPhone_XS_Max: 200,
  iPhone_XS: 200,
  iPhone_XR: 150,
  
  // iPhone X/8 Series
  iPhone_X: 150,
  iPhone_8_Plus: 100,
  iPhone_8: 100,
  
  // iPhone SE Series
  iPhone_SE_3rd_Gen: 200,
  iPhone_SE_2nd_Gen: 100,
  iPhone_SE_1st_Gen: 50,
  
  // Samsung Galaxy S Series
  Samsung_Galaxy_S25_Ultra: 1000,
  Samsung_Galaxy_S25_Plus: 830,
  Samsung_Galaxy_S25: 650,
  Samsung_Galaxy_S24_Ultra: 830,
  Samsung_Galaxy_S24_Plus: 650,
  Samsung_Galaxy_S24: 500,
  Samsung_Galaxy_S24_FE: 400,
  Samsung_Galaxy_S23_Ultra: 650,
  Samsung_Galaxy_S23_Plus: 500,
  Samsung_Galaxy_S23: 400,
  Samsung_Galaxy_S23_FE: 350,
  Samsung_Galaxy_S22_Ultra: 500,
  Samsung_Galaxy_S22_Plus: 400,
  Samsung_Galaxy_S22: 300,
  Samsung_Galaxy_S21_Ultra: 400,
  Samsung_Galaxy_S21_Plus: 300,
  Samsung_Galaxy_S21: 200,
  Samsung_Galaxy_S21_FE: 200,
  Samsung_Galaxy_S20_Ultra: 200,
  Samsung_Galaxy_S20_Plus: 150,
  Samsung_Galaxy_S20: 150,
  Samsung_Galaxy_S20_FE: 150,
  
  // Samsung Galaxy Note Series
  Samsung_Galaxy_Note_20_Ultra: 400,
  Samsung_Galaxy_Note_20: 300,
  Samsung_Galaxy_Note_10_Plus: 200,
  Samsung_Galaxy_Note_10: 150,
  Samsung_Galaxy_Note_9: 100,
  
  // Samsung Galaxy Z Series (Foldables)
  Samsung_Galaxy_Z_Fold6: 1000,
  Samsung_Galaxy_Z_Fold5: 830,
  Samsung_Galaxy_Z_Fold4: 650,
  Samsung_Galaxy_Z_Fold3: 500,
  Samsung_Galaxy_Z_Fold2: 400,
  Samsung_Galaxy_Z_Flip6: 650,
  Samsung_Galaxy_Z_Flip5: 500,
  Samsung_Galaxy_Z_Flip4: 400,
  Samsung_Galaxy_Z_Flip3: 300,
  
  // Samsung Galaxy A Series
  Samsung_Galaxy_A54: 200,
  Samsung_Galaxy_A53: 150,
  Samsung_Galaxy_A52: 100,
  Samsung_Galaxy_A51: 100,
  Samsung_Galaxy_A50: 50,
  Samsung_Galaxy_A32: 50,
  Samsung_Galaxy_A14: 50,
  
  // Google Pixel Series
  Google_Pixel_9_Pro_XL: 1000,
  Google_Pixel_9_Pro: 830,
  Google_Pixel_9: 650,
  Google_Pixel_8_Pro: 650,
  Google_Pixel_8: 500,
  Google_Pixel_8a: 350,
  Google_Pixel_7_Pro: 400,
  Google_Pixel_7: 300,
  Google_Pixel_7a: 200,
  Google_Pixel_6_Pro: 300,
  Google_Pixel_6: 200,
  Google_Pixel_6a: 150,
  Google_Pixel_5: 150,
  Google_Pixel_5a: 100,
  Google_Pixel_4_XL: 100,
  Google_Pixel_4: 100,
  Google_Pixel_4a: 50,
  
  // OnePlus Series
  OnePlus_12: 650,
  OnePlus_11: 500,
  OnePlus_10_Pro: 400,
  OnePlus_10T: 350,
  OnePlus_9_Pro: 300,
  OnePlus_9: 250,
  OnePlus_8_Pro: 200,
  OnePlus_8: 150,
  OnePlus_8T: 200,
  OnePlus_7_Pro: 150,
  OnePlus_7T: 100,
  OnePlus_Nord_N30: 100,
  OnePlus_Nord_N20: 50,
  
  // Motorola Series
  Motorola_Edge_Plus_2024: 500,
  Motorola_Edge_Plus_2023: 400,
  Motorola_Edge_2023: 300,
  Motorola_Edge_2022: 200,
  Motorola_Razr_Plus_2024: 650,
  Motorola_Razr_2023: 500,
  Motorola_Razr_2022: 400,
  Motorola_Razr_5G: 300,
  Motorola_G_Power_2024: 100,
  Motorola_G_Stylus_2024: 150,
  Motorola_G_5G_2024: 100,
  
  // LG Series (Legacy)
  LG_V60_ThinQ: 150,
  LG_V50_ThinQ: 100,
  LG_G8_ThinQ: 100,
  LG_G7_ThinQ: 50,
  LG_Wing: 200,
  LG_Velvet: 150,
  
  // Other Brands
  TCL_30_XL: 50,
  TCL_20_Pro: 50,
  Nokia_G400: 50,
  Nokia_G100: 50,
  REVVL_6_Pro: 100,
  REVVL_6: 50,
  REVVL_5G: 50
};