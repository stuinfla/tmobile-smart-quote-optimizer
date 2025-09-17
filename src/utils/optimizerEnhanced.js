import { phoneData, tradeInValues } from '../data/phoneData';
import { promotions } from '../data/promotions';
import { plans, southFloridaTaxes } from '../data/plans_sept_2025';
import { insurancePricing, accessoryLinePricing } from '../data/insuranceData';
import accessoryDevices from '../data/accessoryDevices.json';
import taxConfig from '../data/taxConfig.json';
import { completePricingDatabase } from '../data/complete_pricing_database';

export class DealOptimizer {
  constructor(customerData) {
    this.customer = customerData;
    this.scenarios = [];
    
    // Get tax rates for customer location (default to Palm Beach)
    this.taxRates = this.getTaxRates(customerData.location || 'palm_beach');
  }
  
  getTaxRates(location) {
    // Use taxConfig.json for tax rates
    const county = taxConfig.florida.counties[location] || taxConfig.florida.counties.palm_beach;
    return {
      serviceTaxRate: county.total_service_tax, // 14.44% for Palm Beach/Miami-Dade
      deviceTaxRate: county.total_device_tax,    // 7% for devices
      regulatoryFeePerLine: 3.99,
      federalSurchargePerLine: 2.50,
      deviceConnectionCharge: 35, // T-Mobile charges $35 per device (phones, tablets, watches)
      activationFeePerLine: 10    // $10 per line activation fee
    };
  }

  calculateAllScenarios() {
    const scenarios = [];
    
    try {
      // Scenario A: Trade-in all devices
      const tradeInScenario = this.calculateTradeInScenario();
      if (tradeInScenario && !isNaN(tradeInScenario.monthlyTotal)) {
        scenarios.push(tradeInScenario);
      }
      
      // Scenario B: No trade-ins (Keep & Switch)
      const keepAndSwitchScenario = this.calculateKeepAndSwitchScenario();
      if (keepAndSwitchScenario && !isNaN(keepAndSwitchScenario.monthlyTotal)) {
        scenarios.push(keepAndSwitchScenario);
      }
      
      // If no valid scenarios, create a basic one
      if (scenarios.length === 0) {
        scenarios.push(this.createBasicScenario());
      }
      
      // Sort by 24-month total cost (lower is better)
      scenarios.sort((a, b) => (a.total24MonthCost || 0) - (b.total24MonthCost || 0));
      
      this.scenarios = scenarios;
      return scenarios;
    } catch (error) {
      console.error('Error calculating scenarios:', error);
      return [this.createBasicScenario()];
    }
  }

  createBasicScenario() {
    const lineCount = this.customer.lines || 1;
    const planKey = this.customer.selectedPlan || 'EXPERIENCE_BEYOND';
    const planCosts = this.calculatePlanCost(planKey, lineCount);
    const monthlyService = planCosts.withAutoPay || 0;
    const monthlyTaxesAndFees = this.calculateServiceTaxesAndFees(monthlyService, lineCount);
    const monthlyTotal = monthlyService + monthlyTaxesAndFees.total;
    
    return {
      name: "Monthly Service",
      type: "basic",
      lineCount: lineCount,
      planName: plans.postpaid[planKey]?.name || "Experience Beyond",
      monthlyService: monthlyService,
      monthlyTotal: monthlyTotal,
      monthlyTaxes: monthlyTaxesAndFees.serviceTaxes,
      monthlyFees: monthlyTaxesAndFees.regulatoryFees + monthlyTaxesAndFees.federalSurcharges,
      perLineBreakdown: this.calculatePerLineBreakdown(planKey, lineCount),
      upfrontTotal: monthlyTotal + (lineCount * this.taxRates.activationFeePerLine),
      total24MonthCost: monthlyTotal * 24,
      totalSavings: 0,
      promotionsApplied: [],
      details: [`${lineCount} line${lineCount > 1 ? 's' : ''} on ${plans.postpaid[planKey]?.name || 'Experience Beyond'}`],
      requirements: ["AutoPay enrollment required for discount"]
    };
  }

  calculatePlanCost(planKey, lineCount) {
    // First check new complete pricing database
    const qualification = this.customer.qualification || 'standard';
    
    // Map plan keys to database keys
    const planMapping = {
      'EXPERIENCE_BEYOND': 'experienceBeyond',
      'EXPERIENCE_MORE': 'experienceMore',
      'ESSENTIALS_SAVER': 'essentialsSaver'
    };
    
    const dbPlanKey = planMapping[planKey];
    
    if (dbPlanKey && completePricingDatabase?.postpaidPlans?.[dbPlanKey]) {
      const planData = completePricingDatabase.postpaidPlans[dbPlanKey];
      const pricingTier = planData.pricing[qualification] || planData.pricing.standard;
      
      if (pricingTier && pricingTier[lineCount]) {
        const totalMonthly = parseFloat(pricingTier[lineCount]) || 0;
        const autoPay = planData.autopayDiscount ? planData.autopayDiscount * lineCount : 10 * lineCount;
        
        return {
          baseMonthly: totalMonthly,
          withAutoPay: Math.max(0, totalMonthly - autoPay),
          autoPay: autoPay
        };
      }
    }
    
    // Fallback to old pricing structure
    const plan = plans.postpaid[planKey];
    if (!plan) {
      console.error(`Plan ${planKey} not found`);
      return { baseMonthly: 0, withAutoPay: 0, autoPay: 0 };
    }
    
    // Use TOTAL pricing for the line count (NOT per-line)
    // These are TOTAL prices from completePricingDatabase
    let totalMonthly = 0;
    
    // Map plan keys to actual total prices
    const totalPricing = {
      'EXPERIENCE_BEYOND': { 1: 105, 2: 180, 3: 230, 4: 280, 5: 330, 6: 380 },
      'EXPERIENCE_MORE': { 1: 90, 2: 150, 3: 185, 4: 220, 5: 255, 6: 290 },
      'ESSENTIALS_SAVER': { 1: 55, 2: 95, 3: 120, 4: 145, 5: 170, 6: 195 }
    };
    
    const planTotals = totalPricing[planKey] || totalPricing['EXPERIENCE_BEYOND'];
    
    if (lineCount <= 6) {
      totalMonthly = planTotals[lineCount] || planTotals[1] * lineCount;
    } else {
      // For 7+ lines, add incremental cost
      const baseCost = planTotals[6];
      const perLineAdditional = planTotals[1] * 0.6; // Approximate discount for additional lines
      totalMonthly = baseCost + ((lineCount - 6) * perLineAdditional);
    }
    
    // Apply AutoPay discount
    const autoPay = plan.autopay_discount ? plan.autopay_discount * lineCount : 0;
    
    return {
      baseMonthly: totalMonthly,
      withAutoPay: Math.max(0, totalMonthly - autoPay),
      autoPay: autoPay
    };
  }

  calculatePerLineBreakdown(planKey, lineCount) {
    const planCosts = this.calculatePlanCost(planKey, lineCount);
    const breakdown = [];
    
    // Get individual line pricing from database for accurate per-line costs
    const qualification = this.customer.qualification || 'standard';
    const planMapping = {
      'EXPERIENCE_BEYOND': 'experienceBeyond',
      'EXPERIENCE_MORE': 'experienceMore', 
      'ESSENTIALS_SAVER': 'essentialsSaver'
    };
    const dbPlanKey = planMapping[planKey];
    
    let linePrices = [];
    if (dbPlanKey && completePricingDatabase?.postpaidPlans?.[dbPlanKey]) {
      const planData = completePricingDatabase.postpaidPlans[dbPlanKey];
      const pricingTier = planData.pricing[qualification] || planData.pricing.standard;
      
      // Calculate individual line prices based on T-Mobile's tiered pricing
      if (lineCount === 1) {
        linePrices = [pricingTier[1] || 105];
      } else if (lineCount === 2) {
        const total2 = pricingTier[2] || 180;
        const line1 = pricingTier[1] || 105;
        linePrices = [line1, total2 - line1];
      } else if (lineCount === 3) {
        const total3 = pricingTier[3] || 230;
        const total2 = pricingTier[2] || 180;
        const line1 = pricingTier[1] || 105;
        linePrices = [line1, total2 - line1, total3 - total2];
      } else if (lineCount === 4) {
        const total4 = pricingTier[4] || 280;
        const total3 = pricingTier[3] || 230;
        const total2 = pricingTier[2] || 180;
        const line1 = pricingTier[1] || 105;
        linePrices = [line1, total2 - line1, total3 - total2, total4 - total3];
      } else {
        // For 5+ lines, use average pricing
        const avgPrice = (pricingTier[lineCount] || planCosts.baseMonthly) / lineCount;
        for (let i = 0; i < lineCount; i++) {
          linePrices.push(avgPrice);
        }
      }
    } else {
      // Fallback to equal division
      const perLine = planCosts.baseMonthly / lineCount;
      for (let i = 0; i < lineCount; i++) {
        linePrices.push(perLine);
      }
    }
    
    const autopayPerLine = (planCosts.autoPay || 0) / lineCount;
    
    for (let i = 1; i <= lineCount; i++) {
      const device = this.customer.devices?.[i-1] || {};
      const deviceFinancing = this.calculateDeviceFinancing(device);
      const insurance = device.insurance ? this.getInsuranceCost(device.newPhone) : 0;
      
      const linePrice = parseFloat(linePrices[i-1]) || 0;
      const lineWithAutoPay = Math.max(0, linePrice - autopayPerLine);
      const taxesAndFees = this.calculateServiceTaxesAndFees(lineWithAutoPay, 1);
      
      breakdown.push({
        lineNumber: i,
        phoneNumber: device.phoneNumber || `Line ${i}`,
        device: device.newPhone ? this.getPhoneName(device.newPhone) : 'No device',
        monthlyService: lineWithAutoPay,
        monthlyTaxes: taxesAndFees.serviceTaxes,
        monthlyFees: taxesAndFees.regulatoryFees + taxesAndFees.federalSurcharges,
        deviceFinancing: deviceFinancing,
        insurance: insurance,
        totalMonthly: lineWithAutoPay + taxesAndFees.total + deviceFinancing + insurance
      });
    }
    
    // Add accessory lines if any
    if (this.customer.accessoryLines) {
      const accessories = this.calculateAccessoryCostDetails();
      breakdown.push(...accessories);
    }
    
    return breakdown;
  }

  calculateDeviceFinancing(device) {
    if (!device || !device.newPhone) return 0;
    
    const phone = this.findPhone(device.newPhone);
    if (!phone) return 0;
    
    const financingTerm = parseInt(this.customer.financingTerm) || 24;
    const fullPrice = parseFloat(phone.retail) || 0;
    
    // Check for promotions
    let monthlyCredit = 0;
    if (device.currentPhone && device.currentPhone !== 'no_trade') {
      const promo = this.findBestPromotion(device.newPhone, device.currentPhone);
      if (promo) {
        monthlyCredit = parseFloat(promo.credit) / financingTerm;
      }
    }
    
    const baseMonthly = fullPrice / financingTerm;
    return Math.max(0, baseMonthly - monthlyCredit);
  }

  getInsuranceCost(phoneKey) {
    if (!phoneKey) return 0;
    const tier = insurancePricing.getInsurancePrice(phoneKey);
    return parseFloat(tier?.monthly) || 18;
  }

  getPhoneName(phoneKey) {
    const phone = this.findPhone(phoneKey);
    return phone?.name || phoneKey;
  }

  calculateAccessoryCostDetails() {
    const details = [];
    
    if (this.customer.accessoryLines?.watches) {
      this.customer.accessoryLines.watches.forEach((watch, i) => {
        details.push({
          lineNumber: `W${i+1}`,
          phoneNumber: `Watch ${i+1}`,
          device: watch.model || 'Apple Watch',
          monthlyService: watch.price || 12,
          monthlyTaxes: 0, // Watches typically don't have separate taxes
          monthlyFees: 0,
          deviceFinancing: 0, // Add if watch is financed
          insurance: 0, // Add if watch has insurance
          totalMonthly: watch.price || 12
        });
      });
    }
    
    if (this.customer.accessoryLines?.tablets) {
      this.customer.accessoryLines.tablets.forEach((tablet, i) => {
        details.push({
          lineNumber: `T${i+1}`,
          phoneNumber: `Tablet ${i+1}`,
          device: tablet.model || 'iPad',
          monthlyService: tablet.price || 20,
          monthlyTaxes: 0,
          monthlyFees: 0,
          deviceFinancing: 0, // Add if tablet is financed
          insurance: 0,
          totalMonthly: tablet.price || 20
        });
      });
    }
    
    return details;
  }
  
  calculateServiceTaxesAndFees(monthlyServiceAmount, lineCount) {
    // Ensure we have valid numbers
    const amount = parseFloat(monthlyServiceAmount) || 0;
    const lines = parseInt(lineCount) || 1;
    
    // Percentage-based taxes on service
    const serviceTaxes = amount * this.taxRates.serviceTaxRate;
    
    // Per-line fees
    const regulatoryFees = lines * this.taxRates.regulatoryFeePerLine;
    const federalSurcharges = lines * this.taxRates.federalSurchargePerLine;
    
    return {
      serviceTaxes: serviceTaxes,
      regulatoryFees: regulatoryFees,
      federalSurcharges: federalSurcharges,
      total: serviceTaxes + regulatoryFees + federalSurcharges
    };
  }

  calculateDeviceCosts(devices = [], promotionType = 'standard') {
    let totalMonthlyFinancing = 0;
    let totalUpfrontTax = 0;
    const deviceDetails = [];
    const financingTerm = parseInt(this.customer.financingTerm) || 24;
    
    devices.forEach((device, index) => {
      if (!device.newPhone || device.newPhone === '') {
        return; // Skip empty devices
      }
      
      const phone = this.findPhone(device.newPhone);
      if (!phone) {
        console.warn(`Phone ${device.newPhone} not found`);
        return;
      }
      
      const fullPrice = phone.retail || 0;
      const monthlyBase = fullPrice / financingTerm;
      
      // Calculate promotion credit
      let promotionCredit = 0;
      let promotionName = '';
      
      if (promotionType === 'new_customer' && index === 0) {
        // New customer gets phone on us for first line
        promotionCredit = monthlyBase;
        promotionName = 'New Line Promo';
      } else if (device.currentPhone && device.currentPhone !== 'no_trade') {
        const promo = this.findBestPromotion(device.newPhone, device.currentPhone);
        if (promo) {
          promotionCredit = promo.credit / financingTerm;
          promotionName = promo.name;
        }
      }
      
      const monthlyAfterCredit = Math.max(0, monthlyBase - promotionCredit);
      totalMonthlyFinancing += monthlyAfterCredit;
      
      // Device tax is on full retail price
      const deviceTax = fullPrice * this.taxRates.deviceTaxRate;
      totalUpfrontTax += deviceTax;
      
      deviceDetails.push({
        phone: phone.name,
        fullPrice: fullPrice,
        monthlyBase: monthlyBase,
        promotionCredit: promotionCredit,
        promotionName: promotionName,
        monthlyAfterCredit: monthlyAfterCredit,
        upfrontTax: deviceTax
      });
    });
    
    return {
      monthlyFinancing: totalMonthlyFinancing,
      upfrontTax: totalUpfrontTax,
      devices: deviceDetails,
      total: totalUpfrontTax // Upfront cost is just the tax
    };
  }
  
  calculateAccessoryCosts() {
    let monthlyPlanCost = 0;
    let monthlyFinancing = 0;
    let upfrontTax = 0;
    const accessories = [];
    
    // Watches
    if (this.customer.accessoryLines?.watches) {
      this.customer.accessoryLines.watches.forEach(watch => {
        const planPrice = watch.price || 12;
        monthlyPlanCost += planPrice;
        
        if (watch.device === 'new' && watch.model) {
          // Add device financing if purchasing new watch
          const watchDevice = accessoryDevices.watches[watch.model];
          if (watchDevice) {
            const financingTerm = parseInt(this.customer.financingTerm) || 24;
            const monthlyDeviceCost = watchDevice.price / financingTerm;
            monthlyFinancing += monthlyDeviceCost;
            upfrontTax += watchDevice.price * this.taxRates.deviceTaxRate;
            
            accessories.push({
              type: 'watch',
              model: watchDevice.name,
              monthlyPlan: planPrice,
              monthlyDevice: monthlyDeviceCost,
              upfrontTax: watchDevice.price * this.taxRates.deviceTaxRate
            });
          }
        } else {
          accessories.push({
            type: 'watch',
            model: 'BYOD',
            monthlyPlan: planPrice,
            monthlyDevice: 0,
            upfrontTax: 0
          });
        }
      });
    }
    
    // Tablets
    if (this.customer.accessoryLines?.tablets) {
      this.customer.accessoryLines.tablets.forEach(tablet => {
        const planPrice = tablet.price || 20;
        monthlyPlanCost += planPrice;
        
        if (tablet.device === 'new' && tablet.model) {
          // Add device financing if purchasing new tablet
          const tabletDevice = accessoryDevices.tablets[tablet.model];
          if (tabletDevice) {
            const financingTerm = parseInt(this.customer.financingTerm) || 24;
            const monthlyDeviceCost = tabletDevice.price / financingTerm;
            monthlyFinancing += monthlyDeviceCost;
            upfrontTax += tabletDevice.price * this.taxRates.deviceTaxRate;
            
            accessories.push({
              type: 'tablet',
              model: tabletDevice.name,
              monthlyPlan: planPrice,
              monthlyDevice: monthlyDeviceCost,
              upfrontTax: tabletDevice.price * this.taxRates.deviceTaxRate
            });
          }
        } else {
          accessories.push({
            type: 'tablet', 
            model: 'BYOD',
            monthlyPlan: planPrice,
            monthlyDevice: 0,
            upfrontTax: 0
          });
        }
      });
    }
    
    return {
      monthlyPlanCost,
      monthlyFinancing,
      upfrontTax,
      accessories
    };
  }
  
  calculateInsuranceCost() {
    let monthlyTotal = 0;
    const details = [];
    
    if (this.customer.devices) {
      this.customer.devices.forEach((device, index) => {
        if (device.insurance && device.newPhone) {
          const tier = insurancePricing.getInsurancePrice(device.newPhone);
          const monthlyCost = tier?.monthly || 18;
          monthlyTotal += monthlyCost;
          
          details.push({
            line: index + 1,
            device: this.getPhoneName(device.newPhone),
            monthly: monthlyCost,
            deductible: tier?.screen_repair || 0
          });
        }
      });
    }
    
    return {
      monthly: monthlyTotal,
      details: details
    };
  }

  calculateTradeInScenario() {
    const lineCount = this.customer.lines || 1;
    const planKey = this.customer.selectedPlan || 'EXPERIENCE_BEYOND';
    
    // Get plan costs
    const planCosts = this.calculatePlanCost(planKey, lineCount);
    
    // Calculate accessory costs
    const accessoryCosts = this.calculateAccessoryCosts();
    
    // Calculate insurance costs
    const insuranceCosts = this.calculateInsuranceCost();
    const monthlyInsurance = insuranceCosts.monthly;
    
    // Calculate device costs (WITH trade-ins)
    const deviceCosts = this.calculateDeviceCosts(this.customer.devices || []);
    
    // Calculate monthly service total
    const monthlyService = planCosts.withAutoPay + accessoryCosts.monthlyPlanCost;
    const monthlyTaxesAndFees = this.calculateServiceTaxesAndFees(
      planCosts.withAutoPay,
      lineCount
    );
    
    // Total monthly including everything
    const totalMonthly = monthlyService + 
                        deviceCosts.monthlyFinancing + 
                        accessoryCosts.monthlyFinancing + 
                        monthlyInsurance + 
                        monthlyTaxesAndFees.total;
    
    // Calculate upfront costs
    const activationFees = lineCount * this.taxRates.activationFeePerLine;
    const firstMonth = totalMonthly;
    const upfrontTotal = deviceCosts.upfrontTax + 
                        accessoryCosts.upfrontTax + 
                        activationFees + 
                        firstMonth;
    
    // Calculate 24-month total
    const total24Months = upfrontTotal + (totalMonthly * 23);
    
    // Calculate savings
    const competitorMonthly = totalMonthly + 30;
    const totalSavings = (competitorMonthly * 24) - total24Months;
    
    return {
      name: "Trade-In Deal",
      type: "trade_in",
      lineCount: lineCount,
      planName: plans.postpaid[planKey]?.name || "Experience Beyond",
      
      // Monthly breakdown
      monthlyService: planCosts.withAutoPay,
      monthlyAccessoryPlans: accessoryCosts.monthlyPlanCost,
      monthlyDeviceFinancing: deviceCosts.monthlyFinancing,
      monthlyAccessoryFinancing: accessoryCosts.monthlyFinancing,
      monthlyInsurance: monthlyInsurance,
      monthlyTaxes: monthlyTaxesAndFees.serviceTaxes,
      monthlyFees: monthlyTaxesAndFees.regulatoryFees + monthlyTaxesAndFees.federalSurcharges,
      monthlyTotal: totalMonthly,
      
      // Per-line breakdown
      perLineBreakdown: this.calculatePerLineBreakdown(planKey, lineCount),
      
      // Upfront breakdown
      deviceTaxes: deviceCosts.upfrontTax,
      accessoryTaxes: accessoryCosts.upfrontTax,
      activationFees: activationFees,
      firstMonthPayment: totalMonthly,
      upfrontTotal: upfrontTotal,
      
      // Totals
      total24MonthCost: total24Months,
      totalSavings: totalSavings,
      
      // Details
      devices: deviceCosts.devices,
      accessories: accessoryCosts.accessories,
      insurance: insuranceCosts.details,
      promotionsApplied: [
        ...(planCosts.autoPay > 0 ? [`AutoPay Discount: -$${planCosts.autoPay}/mo`] : []),
        ...deviceCosts.devices.filter(d => d.promotionCredit > 0).map(d => 
          `${d.promotionName}: -$${d.promotionCredit.toFixed(2)}/mo on ${d.phone}`
        )
      ],
      details: [
        `${lineCount} line${lineCount > 1 ? 's' : ''} with trade-in`,
        `Monthly service: $${planCosts.withAutoPay}`,
        ...deviceCosts.devices.filter(d => d.promotionCredit > 0).map(d => 
          `${d.phone}: $${d.monthlyAfterCredit.toFixed(2)}/mo after credit`
        )
      ],
      requirements: [
        "Trade in eligible devices",
        "AutoPay enrollment required",
        "Credits applied over 24 months"
      ],
      
      // For display
      taxRate: (this.taxRates.serviceTaxRate * 100).toFixed(2) + '%',
      deviceTaxRate: (this.taxRates.deviceTaxRate * 100).toFixed(2) + '%'
    };
  }

  calculateKeepAndSwitchScenario() {
    const lineCount = this.customer.lines || 1;
    const planKey = this.customer.selectedPlan || 'EXPERIENCE_BEYOND';
    
    // Get plan costs
    const planCosts = this.calculatePlanCost(planKey, lineCount);
    
    // Calculate accessory costs
    const accessoryCosts = this.calculateAccessoryCosts();
    
    // Calculate insurance costs
    const insuranceCosts = this.calculateInsuranceCost();
    const monthlyInsurance = insuranceCosts.monthly;
    
    // Calculate monthly service total
    const monthlyService = planCosts.withAutoPay + accessoryCosts.monthlyPlanCost;
    const monthlyTaxesAndFees = this.calculateServiceTaxesAndFees(
      planCosts.withAutoPay,
      lineCount
    );
    
    // Calculate device costs (NO trade-ins, new customer promotion)
    const deviceCosts = this.calculateDeviceCosts(this.customer.devices || [], 'new_customer');
    
    // Total monthly including everything
    const totalMonthly = monthlyService + 
                        deviceCosts.monthlyFinancing + 
                        accessoryCosts.monthlyFinancing + 
                        monthlyInsurance + 
                        monthlyTaxesAndFees.total;
    
    // Calculate Keep & Switch reimbursements
    let reimbursements = 0;
    const keepAndSwitch = promotions.switcher_benefits?.KEEP_AND_SWITCH;
    if (keepAndSwitch && this.isEligibleForKeepAndSwitch()) {
      const eligibleLines = Math.min(lineCount, keepAndSwitch.max_lines || 5);
      reimbursements = eligibleLines * (keepAndSwitch.max_per_line || 800);
    }
    
    // Calculate upfront costs
    const activationFees = lineCount * this.taxRates.activationFeePerLine;
    const firstMonth = totalMonthly;
    const upfrontTotal = deviceCosts.upfrontTax + 
                        accessoryCosts.upfrontTax + 
                        activationFees + 
                        firstMonth;
    
    // Calculate 24-month total (subtract reimbursements)
    const total24Months = upfrontTotal + (totalMonthly * 23) - reimbursements;
    
    // Calculate savings
    const competitorMonthly = totalMonthly + 30;
    const totalSavings = (competitorMonthly * 24) - total24Months + reimbursements;
    
    return {
      name: "Keep & Switch",
      type: "keep_and_switch",
      lineCount: lineCount,
      planName: plans.postpaid[planKey]?.name || "Experience Beyond",
      
      // Monthly breakdown
      monthlyService: planCosts.withAutoPay,
      monthlyAccessoryPlans: accessoryCosts.monthlyPlanCost,
      monthlyDeviceFinancing: deviceCosts.monthlyFinancing,
      monthlyAccessoryFinancing: accessoryCosts.monthlyFinancing,
      monthlyInsurance: monthlyInsurance,
      monthlyTaxes: monthlyTaxesAndFees.serviceTaxes,
      monthlyFees: monthlyTaxesAndFees.regulatoryFees + monthlyTaxesAndFees.federalSurcharges,
      monthlyTotal: totalMonthly,
      
      // Per-line breakdown
      perLineBreakdown: this.calculatePerLineBreakdown(planKey, lineCount),
      
      // Upfront breakdown
      deviceTaxes: deviceCosts.upfrontTax,
      accessoryTaxes: accessoryCosts.upfrontTax,
      activationFees: activationFees,
      firstMonthPayment: totalMonthly,
      upfrontTotal: upfrontTotal,
      
      // Reimbursements
      reimbursements: reimbursements,
      
      // Totals
      total24MonthCost: total24Months,
      totalSavings: totalSavings,
      
      // Details
      devices: deviceCosts.devices,
      accessories: accessoryCosts.accessories,
      insurance: insuranceCosts.details,
      promotionsApplied: [
        ...(planCosts.autoPay > 0 ? [`AutoPay Discount: -$${planCosts.autoPay}/mo`] : []),
        ...(reimbursements > 0 ? [`Keep & Switch: $${reimbursements} via Prepaid Card`] : []),
        ...deviceCosts.devices.filter(d => d.promotionCredit > 0).map(d => 
          `${d.promotionName}: -$${d.promotionCredit.toFixed(2)}/mo on ${d.phone}`
        )
      ],
      details: [
        `${lineCount} line${lineCount > 1 ? 's' : ''} - Keep your phones`,
        `Monthly service: $${planCosts.withAutoPay}`,
        ...(reimbursements > 0 ? [`Get $${reimbursements} to pay off old carrier`] : [])
      ],
      requirements: [
        "Port in from eligible carrier",
        "Submit final bill within 30 days",
        "AutoPay enrollment required"
      ],
      
      // For display
      taxRate: (this.taxRates.serviceTaxRate * 100).toFixed(2) + '%',
      deviceTaxRate: (this.taxRates.deviceTaxRate * 100).toFixed(2) + '%'
    };
  }

  findPhone(phoneKey) {
    for (const brand of Object.values(phoneData.phones)) {
      if (brand[phoneKey]) {
        return brand[phoneKey];
      }
    }
    return null;
  }
  
  findBestPromotion(newPhone, tradeInPhone) {
    // Check for specific promotions
    const devicePromos = promotions.device_promos || {};
    
    for (const promoKey in devicePromos) {
      const promo = devicePromos[promoKey];
      if (promo.eligible_devices?.includes(newPhone)) {
        // Check trade-in value
        const tradeInValue = tradeInValues[tradeInPhone];
        if (tradeInValue) {
          for (const tier of promo.tiers) {
            if (tradeInValue >= tier.min_value) {
              return {
                name: promo.name,
                credit: tier.credit
              };
            }
          }
        }
      }
    }
    
    return null;
  }

  isEligibleForKeepAndSwitch() {
    const hasCarrierInfo = this.customer.carrier && this.customer.carrier.length > 0;
    const keepAndSwitch = promotions.switcher_benefits?.KEEP_AND_SWITCH;
    if (!keepAndSwitch) return false;
    
    const eligibleCarriers = keepAndSwitch.requirements?.eligible_carriers || ['Verizon', 'AT&T'];
    const isEligibleCarrier = hasCarrierInfo && 
      eligibleCarriers.some(carrier => 
        this.customer.carrier.toLowerCase().includes(carrier.toLowerCase())
      );
    
    const isSwitching = !this.customer.isExisting;
    
    return isSwitching && (isEligibleCarrier || !hasCarrierInfo);
  }

  getBestDeal() {
    if (this.scenarios.length === 0) {
      this.calculateAllScenarios();
    }
    return this.scenarios[0]; // Lowest 24-month cost
  }

  getComparisonMatrix() {
    if (this.scenarios.length === 0) {
      this.calculateAllScenarios();
    }
    return this.scenarios;
  }
}