import { phoneData, tradeInValues } from '../data/phoneData';
import { promotions } from '../data/promotions';
import { plans, southFloridaTaxes } from '../data/plans_sept_2025';
import taxConfig from '../data/taxConfig.json';

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
      deviceConnectionCharge: 35 // T-Mobile charges $35 per device (phones, tablets, watches)
    };
  }

  calculateAllScenarios() {
    const scenarios = [];
    
    // Scenario A: Trade-in all devices
    scenarios.push(this.calculateTradeInScenario());
    
    // Scenario B: No trade-ins (Keep & Switch)
    scenarios.push(this.calculateKeepAndSwitchScenario());
    
    // Scenario C: Selective trade-ins
    scenarios.push(this.calculateSelectiveTradeInScenario());
    
    // Scenario D: Bundle maximization
    scenarios.push(this.calculateBundleScenario());
    
    // Sort by 24-month total cost (lower is better)
    scenarios.sort((a, b) => a.total24MonthCost - b.total24MonthCost);
    
    this.scenarios = scenarios;
    return scenarios;
  }

  calculatePlanCost(planKey, lineCount) {
    const plan = plans.postpaid[planKey];
    if (!plan) {
      console.error(`Plan ${planKey} not found`);
      return { baseMonthly: 0, withAutoPay: 0 };
    }
    
    // CRITICAL FIX: Use TOTAL pricing for the line count, not per-line
    // The pricing structure has TOTAL costs for each line count
    let totalMonthly = 0;
    
    // Calculate total based on line count
    if (lineCount === 1) {
      totalMonthly = plan.pricing[1]; // $105 for 1 line
    } else if (lineCount === 2) {
      totalMonthly = plan.pricing[2] * 2; // $90 × 2 = $180 for 2 lines
    } else if (lineCount === 3) {
      totalMonthly = plan.pricing[3] * 3; // $76.67 × 3 = $230 for 3 lines
    } else if (lineCount === 4) {
      totalMonthly = plan.pricing[4] * 4; // $70 × 4 = $280 for 4 lines
    } else if (lineCount === 5) {
      totalMonthly = plan.pricing[5] * 5; // $66 × 5 = $330 for 5 lines
    } else {
      // For 6+ lines, use the per-line pricing
      totalMonthly = plan.pricing[6] * lineCount;
    }
    
    // Apply AutoPay discount if available
    const autoPay = plan.autopay_discount ? plan.autopay_discount * lineCount : 0;
    
    return {
      baseMonthly: totalMonthly,
      withAutoPay: totalMonthly - autoPay,
      autoPay: autoPay
    };
  }
  
  calculateServiceTaxesAndFees(monthlyServiceAmount, lineCount) {
    // Percentage-based taxes on service
    const serviceTaxes = monthlyServiceAmount * this.taxRates.serviceTaxRate;
    
    // Per-line fees
    const regulatoryFees = lineCount * this.taxRates.regulatoryFeePerLine;
    const federalSurcharges = lineCount * this.taxRates.federalSurchargePerLine;
    
    return {
      serviceTaxes: serviceTaxes,
      regulatoryFees: regulatoryFees,
      federalSurcharges: federalSurcharges,
      total: serviceTaxes + regulatoryFees + federalSurcharges
    };
  }
  
  calculateDeviceCosts(devices, scenarioType = 'trade_in') {
    let totalMonthlyFinancing = 0;
    let totalUpfrontTax = 0;
    const deviceDetails = [];
    
    devices.forEach((device, index) => {
      const phoneKey = device.newPhone;
      const phone = this.findPhone(phoneKey);
      
      if (phone) {
        const variant = device.storage || Object.keys(phone.variants)[0];
        const fullPrice = phone.variants[variant];
        
        let promotionCredit = 0;
        let promotionName = '';
        
        // Determine promotion based on scenario type
        if (scenarioType === 'trade_in') {
          // Trade-in promotion (e.g., up to $1,000 for iPhone 13)
          promotionCredit = tradeInValues[device.currentPhone] || 0;
          promotionName = `Trade-in ${device.currentPhone}`;
        } else if (scenarioType === 'new_customer') {
          // New customer promotion (e.g., $1,100 off for switching from Verizon)
          if (this.customer.carrier && this.customer.carrier.toLowerCase().includes('verizon')) {
            // Premium phone gets bigger discount
            if (phoneKey.includes('Pro')) {
              promotionCredit = Math.min(1100, fullPrice); // Up to $1,100 off Pro phones
            } else {
              promotionCredit = Math.min(800, fullPrice); // Up to $800 off regular phones
            }
            promotionName = 'Switch from Verizon';
          } else {
            promotionCredit = Math.min(800, fullPrice); // Generic switcher credit
            promotionName = 'New Customer Credit';
          }
        }
        
        // Calculate financing
        const afterPromotion = Math.max(0, fullPrice - promotionCredit);
        const monthlyFinancing = afterPromotion / 24; // 24-month financing
        
        // Tax is ALWAYS on full device price, paid upfront
        const deviceTax = fullPrice * this.taxRates.deviceTaxRate;
        
        totalMonthlyFinancing += monthlyFinancing;
        totalUpfrontTax += deviceTax;
        
        deviceDetails.push({
          phone: `${phone.name} ${variant}`,
          fullPrice: fullPrice,
          promotionCredit: promotionCredit,
          promotionName: promotionName,
          afterPromotion: afterPromotion,
          monthlyFinancing: monthlyFinancing,
          tax: deviceTax,
          upfrontCost: deviceTax // Only tax is paid upfront
        });
      }
    });
    
    return {
      monthlyFinancing: totalMonthlyFinancing,
      upfrontTax: totalUpfrontTax,
      devices: deviceDetails
    };
  }

  calculateAccessoryCosts() {
    let monthlyAccessoryCost = 0;
    let monthlyAccessoryFinancing = 0;
    let upfrontAccessoryTax = 0;
    const accessoryDetails = [];
    
    // Handle iPads
    if (this.customer.accessories?.ipad) {
      const ipadConfig = this.customer.accessories.ipad;
      
      // Data plan cost
      const dataPlanCost = ipadConfig.plan === 'unlimited' ? 20 : 5; // $20 unlimited or $5 for 5GB
      monthlyAccessoryCost += dataPlanCost * (ipadConfig.quantity || 1);
      
      // If purchasing new iPads
      if (ipadConfig.newDevice) {
        const ipadPrice = 599; // Base iPad price (could be dynamic)
        const quantity = ipadConfig.quantity || 1;
        
        for (let i = 0; i < quantity; i++) {
          const financing = ipadPrice / 24;
          const tax = ipadPrice * this.taxRates.deviceTaxRate;
          
          monthlyAccessoryFinancing += financing;
          upfrontAccessoryTax += tax;
          
          accessoryDetails.push({
            type: 'iPad',
            description: `iPad with ${ipadConfig.plan === 'unlimited' ? 'Unlimited' : '5GB'} data`,
            price: ipadPrice,
            monthlyFinancing: financing,
            monthlyPlan: dataPlanCost,
            tax: tax
          });
        }
      } else {
        // Existing iPad, just data plan
        accessoryDetails.push({
          type: 'iPad Data',
          description: `iPad ${ipadConfig.plan === 'unlimited' ? 'Unlimited' : '5GB'} data plan`,
          monthlyPlan: dataPlanCost * (ipadConfig.quantity || 1),
          quantity: ipadConfig.quantity || 1
        });
      }
    }
    
    // Handle Apple Watches
    if (this.customer.accessories?.watch) {
      const watchConfig = this.customer.accessories.watch;
      const watchLineCost = 10; // $10/month for cellular
      const quantity = watchConfig.quantity || 1;
      
      monthlyAccessoryCost += watchLineCost * quantity;
      
      // If purchasing new watches
      if (watchConfig.newDevice) {
        const watchPrice = 399; // Apple Watch Series 9 base price
        
        for (let i = 0; i < quantity; i++) {
          const financing = watchPrice / 24;
          const tax = watchPrice * this.taxRates.deviceTaxRate;
          
          monthlyAccessoryFinancing += financing;
          upfrontAccessoryTax += tax;
          
          accessoryDetails.push({
            type: 'Apple Watch',
            description: 'Apple Watch with cellular',
            price: watchPrice,
            monthlyFinancing: financing,
            monthlyPlan: watchLineCost,
            tax: tax
          });
        }
      } else {
        // Existing watch, just cellular plan
        accessoryDetails.push({
          type: 'Watch Cellular',
          description: 'Apple Watch cellular plan',
          monthlyPlan: watchLineCost * quantity,
          quantity: quantity
        });
      }
    }
    
    return {
      monthlyPlanCost: monthlyAccessoryCost,
      monthlyFinancing: monthlyAccessoryFinancing,
      upfrontTax: upfrontAccessoryTax,
      accessories: accessoryDetails
    };
  }
  
  calculateTradeInScenario() {
    const lineCount = this.customer.lines || 1;
    const planKey = this.customer.selectedPlan || 'EXPERIENCE_BEYOND';
    
    // Get plan costs
    const planCosts = this.calculatePlanCost(planKey, lineCount);
    
    // Calculate device costs with trade-in promotions
    const deviceCosts = this.calculateDeviceCosts(this.customer.devices || [], 'trade_in');
    
    // Calculate accessory costs
    const accessoryCosts = this.calculateAccessoryCosts();
    
    // Calculate insurance if selected ($18/month per phone line)
    let monthlyInsurance = 0;
    if (this.customer.insurance) {
      // Count how many phone lines have insurance
      const insuredLines = this.customer.devices.filter(d => d.insurance).length || lineCount;
      monthlyInsurance = insuredLines * 18; // $18 per insured line
    }
    
    // Calculate monthly service total (including accessory plans)
    const monthlyService = planCosts.withAutoPay + accessoryCosts.monthlyPlanCost;
    const monthlyTaxesAndFees = this.calculateServiceTaxesAndFees(
      planCosts.withAutoPay, // Taxes only on phone service, not accessory plans
      lineCount
    );
    
    // Total monthly payment
    const totalMonthly = monthlyService + 
                        deviceCosts.monthlyFinancing + 
                        accessoryCosts.monthlyFinancing +
                        monthlyInsurance + 
                        monthlyTaxesAndFees.total;
    
    // Calculate upfront costs
    // Count all devices for activation fees (phones + accessories)
    let totalDeviceCount = lineCount; // Phone lines
    if (this.customer.accessoryLines?.watch) totalDeviceCount++;
    if (this.customer.accessoryLines?.tablet) totalDeviceCount += 2; // Assuming 2 tablets based on scenario
    const activationFees = totalDeviceCount * this.taxRates.deviceConnectionCharge;
    const upfrontTotal = deviceCosts.upfrontTax + // Phone taxes
                        accessoryCosts.upfrontTax + // Accessory taxes
                        activationFees + 
                        totalMonthly; // First month's payment
    
    // Calculate 24-month total
    const total24Months = upfrontTotal + (totalMonthly * 23); // First month already in upfront
    
    return {
      name: "Trade-In Deal",
      type: "trade_in",
      lineCount: lineCount,
      planName: plans.postpaid[planKey].name,
      
      // Monthly breakdown
      monthlyService: planCosts.withAutoPay,
      monthlyAccessoryPlans: accessoryCosts.monthlyPlanCost,
      monthlyDeviceFinancing: deviceCosts.monthlyFinancing,
      monthlyAccessoryFinancing: accessoryCosts.monthlyFinancing,
      monthlyInsurance: monthlyInsurance,
      monthlyTaxes: monthlyTaxesAndFees.serviceTaxes,
      monthlyFees: monthlyTaxesAndFees.regulatoryFees + monthlyTaxesAndFees.federalSurcharges,
      monthlyTotal: totalMonthly,
      
      // Upfront breakdown
      deviceTaxes: deviceCosts.upfrontTax,
      accessoryTaxes: accessoryCosts.upfrontTax,
      activationFees: activationFees,
      firstMonthPayment: totalMonthly,
      upfrontTotal: upfrontTotal,
      
      // Totals
      total24MonthCost: total24Months,
      
      // Details
      devices: deviceCosts.devices,
      accessories: accessoryCosts.accessories,
      promotionsApplied: [
        ...(planCosts.autoPay > 0 ? [`AutoPay Discount: -$${planCosts.autoPay}/mo`] : []),
        ...deviceCosts.devices.map(d => d.promotionCredit > 0 ? 
          `${d.promotionName}: -$${d.promotionCredit} on ${d.phone}` : null
        ).filter(Boolean)
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
    
    // Calculate taxes and fees on monthly service
    const monthlyTaxesAndFees = this.calculateServiceTaxesAndFees(
      planCosts.withAutoPay, 
      lineCount
    );
    
    // Total monthly cost including taxes
    const totalMonthly = planCosts.withAutoPay + monthlyTaxesAndFees.total;
    
    // Calculate device costs (NO trade-ins)
    const devicesNoTradeIn = this.customer.devices.map(d => ({
      ...d,
      currentPhone: 'no_trade' // Force no trade-in
    }));
    const deviceCosts = this.calculateDeviceCosts(devicesNoTradeIn);
    
    // Calculate Keep & Switch reimbursements
    let reimbursements = 0;
    const keepAndSwitch = promotions.switcher_benefits.KEEP_AND_SWITCH;
    if (keepAndSwitch && this.isEligibleForKeepAndSwitch()) {
      const eligibleLines = Math.min(lineCount, keepAndSwitch.max_lines);
      reimbursements = eligibleLines * keepAndSwitch.max_per_line;
    }
    
    // Calculate upfront costs
    // Count all devices for activation fees (phones + accessories)
    let totalDeviceCount = lineCount; // Phone lines
    if (this.customer.accessoryLines?.watch) totalDeviceCount++;
    if (this.customer.accessoryLines?.tablet) totalDeviceCount += 2; // Assuming 2 tablets based on scenario
    const activationFees = totalDeviceCount * this.taxRates.deviceConnectionCharge;
    const firstMonth = totalMonthly;
    const upfrontTotal = deviceCosts.total + activationFees + firstMonth;
    
    // Calculate 24-month total (subtract reimbursements)
    const total24Months = upfrontTotal + (totalMonthly * 23) - reimbursements;
    
    return {
      name: "Keep & Switch",
      type: "keep_and_switch",
      lineCount: lineCount,
      planName: plans.postpaid[planKey].name,
      
      // Monthly breakdown
      monthlyService: planCosts.withAutoPay,
      monthlyTaxes: monthlyTaxesAndFees.serviceTaxes,
      monthlyFees: monthlyTaxesAndFees.regulatoryFees + monthlyTaxesAndFees.federalSurcharges,
      monthlyTotal: totalMonthly,
      
      // Upfront breakdown
      deviceCost: deviceCosts.totalDeviceCost,
      deviceTax: deviceCosts.totalDeviceTax,
      activationFees: activationFees,
      firstMonthService: totalMonthly,
      upfrontTotal: upfrontTotal,
      
      // Reimbursements
      reimbursements: reimbursements,
      
      // Totals
      total24MonthCost: total24Months,
      
      // Details
      devices: deviceCosts.devices,
      promotionsApplied: [
        ...(planCosts.autoPay > 0 ? [`AutoPay Discount: -$${planCosts.autoPay}/mo`] : []),
        ...(reimbursements > 0 ? [`Keep & Switch Reimbursement: $${reimbursements} via Prepaid Card`] : [])
      ],
      
      // For display
      taxRate: (this.taxRates.serviceTaxRate * 100).toFixed(2) + '%',
      deviceTaxRate: (this.taxRates.deviceTaxRate * 100).toFixed(2) + '%'
    };
  }

  calculateSelectiveTradeInScenario() {
    // Similar implementation with proper math
    return this.calculateTradeInScenario(); // Placeholder for now
  }

  calculateBundleScenario() {
    // Similar implementation with proper math
    return this.calculateTradeInScenario(); // Placeholder for now
  }

  findPhone(phoneKey) {
    for (const brand of Object.values(phoneData.phones)) {
      if (brand[phoneKey]) {
        return brand[phoneKey];
      }
    }
    return null;
  }

  isEligibleForKeepAndSwitch() {
    const hasCarrierInfo = this.customer.carrier && this.customer.carrier.length > 0;
    const keepAndSwitch = promotions.switcher_benefits.KEEP_AND_SWITCH;
    if (!keepAndSwitch) return false;
    
    const eligibleCarriers = keepAndSwitch.requirements.eligible_carriers;
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