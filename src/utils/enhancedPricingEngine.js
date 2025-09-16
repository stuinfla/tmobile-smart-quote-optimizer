// Enhanced Pricing Engine with Complete Database Integration
// Implements Phases 3-7 of the comprehensive pricing system

import { completePricingDatabase } from '../data/complete_pricing_database';
import { phoneData, tradeInValues } from '../data/phoneData';
import { promotions } from '../data/promotions';

export class EnhancedPricingEngine {
  constructor(customerData) {
    this.customer = customerData;
    this.database = completePricingDatabase;
  }

  // Phase 3: Business Plans
  getBusinessPlan(planType, lineCount) {
    const plans = this.database.businessPlans;
    const plan = plans[planType];
    
    if (!plan || !plan.pricing[lineCount]) {
      return null;
    }
    
    return {
      name: plan.name,
      features: plan.features,
      basePrice: plan.pricing[lineCount],
      perLine: plan.pricing[lineCount] / lineCount
    };
  }

  // Phase 4: Extended Line Support (6-12 lines)
  calculateExtendedLinesPricing(planKey, lineCount, qualification = 'standard') {
    if (lineCount < 1 || lineCount > 12) {
      throw new Error('Line count must be between 1 and 12');
    }

    // Handle 55+ restriction
    if (qualification === 'seniorPlus55' && lineCount > 2) {
      return {
        error: '55+ plans are limited to 2 lines maximum',
        fallback: this.calculateExtendedLinesPricing(planKey, lineCount, 'standard')
      };
    }

    const planMapping = {
      'EXPERIENCE_BEYOND': 'experienceBeyond',
      'EXPERIENCE_MORE': 'experienceMore',
      'ESSENTIALS_SAVER': 'essentialsSaver'
    };

    const mappedPlan = planMapping[planKey] || planKey;
    const plan = this.database.postpaidPlans[mappedPlan];
    
    if (!plan) return null;

    const pricingTier = plan.pricing[qualification] || plan.pricing.standard;
    const basePrice = pricingTier[lineCount];
    
    if (!basePrice) return null;

    const autopayDiscount = this.customer.autopay !== false ? plan.autopayDiscount * lineCount : 0;
    
    return {
      basePrice,
      autopayDiscount,
      finalPrice: basePrice - autopayDiscount,
      perLine: (basePrice - autopayDiscount) / lineCount,
      lineCount
    };
  }

  // Phase 5: Complete Fee Structure
  calculateFees(services) {
    const fees = this.database.fees;
    let totalFees = 0;
    let feeBreakdown = {};

    // Connection charges
    if (services.newPhones) {
      feeBreakdown.phoneConnections = services.newPhones * fees.connection.smartphone;
      totalFees += feeBreakdown.phoneConnections;
    }

    if (services.newTablets) {
      feeBreakdown.tabletConnections = services.newTablets * fees.connection.tablet;
      totalFees += feeBreakdown.tabletConnections;
    }

    if (services.newWatches) {
      feeBreakdown.watchConnections = services.newWatches * fees.connection.smartwatch;
      totalFees += feeBreakdown.watchConnections;
    }

    // Regulatory fees (monthly)
    const totalLines = (services.phoneLines || 0) + (services.accessoryLines || 0);
    feeBreakdown.regulatoryMonthly = totalLines * fees.regulatory.recoveryFeePostpaid;
    feeBreakdown.federalUSF = totalLines * fees.regulatory.federalUSF;
    feeBreakdown.stateUSF = totalLines * fees.regulatory.stateUSF;

    // Service fees
    if (!services.autopay) {
      feeBreakdown.paperBill = fees.service.paperBill;
    }

    if (services.inStoreUpgrade) {
      feeBreakdown.upgradeSupport = fees.service.upgradeSupport;
    }

    if (services.expeditedShipping) {
      feeBreakdown.expeditedShipping = fees.service.expeditedShipping;
    }

    // International roaming (if applicable)
    if (services.internationalRoaming) {
      const zone = services.roamingZone || 'roamingZoneA';
      feeBreakdown.roamingDaily = fees.international[zone];
    }

    return {
      oneTimeFees: totalFees,
      monthlyFees: (feeBreakdown.regulatoryMonthly || 0) + 
                   (feeBreakdown.federalUSF || 0) + 
                   (feeBreakdown.stateUSF || 0) +
                   (feeBreakdown.paperBill || 0),
      breakdown: feeBreakdown
    };
  }

  // Phase 6: Prepaid Plans
  getPrepaidPlan(planType, lineCount) {
    const plans = this.database.prepaidPlans;
    const plan = plans[planType];
    
    if (!plan || !plan.pricing[lineCount]) {
      return null;
    }
    
    return {
      name: plan.name,
      features: plan.features,
      basePrice: plan.pricing[lineCount],
      connectionCharge: plan.connectionCharge,
      perLine: plan.pricing[lineCount] / lineCount,
      noCreditCheck: true
    };
  }

  // Phase 7: Enhanced Promotion Engine
  calculatePromotions(scenario) {
    const activePromotions = [];
    let totalSavings = 0;

    // BOGO promotions for new lines
    if (scenario.newLines >= 2 && scenario.plan === 'EXPERIENCE_BEYOND') {
      const bogoLines = Math.floor(scenario.newLines / 2);
      const bogoSavings = bogoLines * 95; // Save $95/mo per BOGO line
      
      activePromotions.push({
        name: 'Buy One Get One Line FREE',
        type: 'BOGO',
        savings: bogoSavings,
        description: `Get ${bogoLines} line${bogoLines > 1 ? 's' : ''} FREE`,
        duration: 'For life of account'
      });
      
      totalSavings += bogoSavings;
    }

    // Device promotions
    scenario.devices?.forEach(device => {
      // Trade-in promotions
      if (device.tradeIn && device.newPhone) {
        const tradeInValue = this.getTradeInValue(device.tradeIn);
        const devicePromo = this.getDevicePromotion(device.newPhone, device.tradeIn);
        
        if (devicePromo) {
          activePromotions.push({
            name: `${device.newPhone} Trade-In Promo`,
            type: 'TRADE_IN',
            savings: devicePromo.creditAmount,
            description: devicePromo.description,
            duration: `${devicePromo.months} months`
          });
          
          totalSavings += devicePromo.creditAmount / devicePromo.months;
        }
      }

      // New customer device deals
      if (scenario.newCustomer && device.newPhone?.includes('iPhone')) {
        activePromotions.push({
          name: 'New Customer iPhone Deal',
          type: 'NEW_CUSTOMER',
          savings: 800,
          description: 'Up to $800 off with new line',
          duration: '24 months'
        });
        
        totalSavings += 800 / 24;
      }
    });

    // Bundle promotions
    if (scenario.hasHomeInternet && scenario.lines >= 2) {
      activePromotions.push({
        name: 'Home Internet Bundle',
        type: 'BUNDLE',
        savings: 35,
        description: 'FREE Home Internet with 2+ lines',
        duration: 'While eligible'
      });
      
      totalSavings += 35;
    }

    // Accessory promotions
    if (scenario.tablets?.length >= 2) {
      const secondTabletDiscount = 10; // 50% off second tablet line
      activePromotions.push({
        name: '50% Off 2nd Tablet',
        type: 'ACCESSORY',
        savings: secondTabletDiscount,
        description: '50% off second unlimited tablet line',
        duration: 'While eligible'
      });
      
      totalSavings += secondTabletDiscount;
    }

    // Loyalty promotions
    if (scenario.yearsWithTMobile >= 5) {
      const loyaltyDiscount = scenario.lines * 5; // $5 per line loyalty discount
      activePromotions.push({
        name: 'Magenta Status Loyalty',
        type: 'LOYALTY',
        savings: loyaltyDiscount,
        description: `$5/line loyalty discount`,
        duration: 'Ongoing'
      });
      
      totalSavings += loyaltyDiscount;
    }

    // Seasonal promotions
    const currentMonth = new Date().getMonth();
    if (currentMonth === 11 || currentMonth === 0) { // December or January
      activePromotions.push({
        name: 'Holiday Special',
        type: 'SEASONAL',
        savings: 200,
        description: 'Extra $200 off any new device',
        duration: 'Limited time'
      });
      
      totalSavings += 200 / 24;
    }

    return {
      activePromotions,
      totalMonthlySavings: totalSavings,
      total24MonthSavings: totalSavings * 24,
      eligiblePromotions: activePromotions.length
    };
  }

  // Helper: Get trade-in value
  getTradeInValue(deviceModel) {
    // Search through tradeInValues to find the device
    for (const brand in tradeInValues) {
      if (tradeInValues[brand][deviceModel]) {
        return tradeInValues[brand][deviceModel];
      }
    }
    return { good: 0, damaged: 0 };
  }

  // Helper: Get device-specific promotion
  getDevicePromotion(newDevice, tradeInDevice) {
    // Check if there's a promotion for this device combination
    const promos = promotions.devicePromotions || {};
    
    if (promos[newDevice]) {
      const promo = promos[newDevice];
      const tradeInValue = this.getTradeInValue(tradeInDevice);
      
      // Calculate promotional credit
      let creditAmount = 0;
      if (tradeInValue.good >= 400) {
        creditAmount = 1000; // Max credit for high-value trade-ins
      } else if (tradeInValue.good >= 200) {
        creditAmount = 800; // Mid-tier credit
      } else if (tradeInValue.good >= 95) {
        creditAmount = 400; // Base credit
      }
      
      return {
        creditAmount,
        months: 24,
        description: `Get up to $${creditAmount} credit over 24 months`
      };
    }
    
    return null;
  }

  // Master calculation method
  calculateCompletePricing(scenario) {
    const results = {
      monthly: {},
      oneTime: {},
      promotions: {},
      totals: {}
    };

    // Determine plan type and qualification
    const isBusinessCustomer = scenario.qualification === 'business';
    const planType = isBusinessCustomer ? scenario.businessPlan : scenario.plan;
    
    // Calculate base plan cost
    if (isBusinessCustomer) {
      results.monthly.planCost = this.getBusinessPlan(planType, scenario.lines);
    } else {
      results.monthly.planCost = this.calculateExtendedLinesPricing(
        planType, 
        scenario.lines, 
        scenario.qualification
      );
    }

    // Calculate device financing
    results.monthly.devicePayments = scenario.devices?.reduce((total, device) => {
      if (device.newPhone && device.retailPrice) {
        const monthlyPayment = device.retailPrice / (scenario.financingTerm || 24);
        return total + monthlyPayment;
      }
      return total;
    }, 0) || 0;

    // Calculate accessory lines
    results.monthly.accessoryLines = this.calculateAccessoryLineCosts(scenario.accessories);

    // Calculate insurance
    results.monthly.insurance = this.calculateInsuranceCosts(scenario.devices);

    // Calculate fees
    const feeStructure = this.calculateFees({
      newPhones: scenario.devices?.filter(d => d.newPhone).length || 0,
      newTablets: scenario.accessories?.tablets?.filter(t => t.isNew).length || 0,
      newWatches: scenario.accessories?.watches?.filter(w => w.isNew).length || 0,
      phoneLines: scenario.lines,
      accessoryLines: (scenario.accessories?.tablets?.length || 0) + 
                     (scenario.accessories?.watches?.length || 0),
      autopay: scenario.autopay,
      inStoreUpgrade: scenario.inStoreUpgrade,
      expeditedShipping: scenario.expeditedShipping
    });
    
    results.oneTime = feeStructure.oneTimeFees;
    results.monthly.fees = feeStructure.monthlyFees;

    // Calculate promotions
    results.promotions = this.calculatePromotions(scenario);

    // Calculate totals
    const monthlyTotal = Object.values(results.monthly).reduce((sum, value) => {
      if (typeof value === 'number') return sum + value;
      if (value?.finalPrice) return sum + value.finalPrice;
      return sum;
    }, 0);

    results.totals = {
      monthlyBeforePromotions: monthlyTotal,
      monthlyAfterPromotions: monthlyTotal - results.promotions.totalMonthlySavings,
      oneTimeCharges: results.oneTime,
      total24Months: (monthlyTotal - results.promotions.totalMonthlySavings) * 24 + results.oneTime,
      savingsVsRetail: results.promotions.total24MonthSavings
    };

    return results;
  }

  // Helper: Calculate accessory line costs
  calculateAccessoryLineCosts(accessories) {
    if (!accessories) return 0;
    
    let total = 0;
    
    // Watch lines
    if (accessories.watches) {
      total += accessories.watches.length * 10; // $10 per watch line
    }
    
    // Tablet lines
    if (accessories.tablets) {
      accessories.tablets.forEach((tablet, index) => {
        if (tablet.dataType === 'unlimited') {
          // 50% off second unlimited tablet
          total += index === 1 ? 10 : 20;
        } else {
          total += 5; // $5 for partial data
        }
      });
    }
    
    // Home Internet
    if (accessories.homeInternet) {
      // FREE with 2+ lines, otherwise varies by tier
      const lines = this.customer.lines || 0;
      if (lines < 2) {
        total += 35; // Base price if less than 2 lines
      }
      // Else it's FREE
    }
    
    return total;
  }

  // Helper: Calculate insurance costs
  calculateInsuranceCosts(devices) {
    if (!devices) return 0;
    
    return devices.reduce((total, device) => {
      if (device.insurance) {
        // Determine tier based on device value
        const retailPrice = device.retailPrice || 0;
        let insurancePrice = 0;
        
        if (retailPrice >= 600) {
          insurancePrice = 18; // Tier 3
        } else if (retailPrice >= 200) {
          insurancePrice = 12; // Tier 2
        } else {
          insurancePrice = 7; // Tier 1
        }
        
        return total + insurancePrice;
      }
      return total;
    }, 0);
  }
}

export default EnhancedPricingEngine;