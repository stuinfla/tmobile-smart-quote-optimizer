import { phoneData, tradeInValues } from '../data/phoneData';
import { promotions } from '../data/promotions';
import { plans } from '../data/plans_sept_2025';

export class DealOptimizer {
  constructor(customerData) {
    this.customer = customerData;
    this.scenarios = [];
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
    
    // Sort by total savings
    scenarios.sort((a, b) => b.totalSavings - a.totalSavings);
    
    this.scenarios = scenarios;
    return scenarios;
  }

  calculateTradeInScenario() {
    const scenario = {
      name: "Maximum Trade-In Value",
      type: "trade_in_all",
      lineItems: [],
      monthlyTotal: 0,
      upfrontCost: 0,
      totalSavings: 0,
      promotionsApplied: [],
      monthlyBreakdown: {}
    };

    // Calculate plan cost
    const planKey = this.customer.selectedPlan || 'GO5G_Next';
    const plan = plans.postpaid[planKey];
    const lineCount = this.customer.lines || 1;
    scenario.monthlyTotal = plan.pricing[lineCount] || plan.pricing[1] * lineCount;
    
    // Apply autopay discount
    if (plan.autopay_discount) {
      scenario.monthlyTotal -= plan.autopay_discount * lineCount;
      scenario.promotionsApplied.push(`Autopay Discount: -$${plan.autopay_discount * lineCount}/mo`);
    }

    // Calculate device costs with trade-ins
    this.customer.devices?.forEach((device, index) => {
      const phoneKey = device.newPhone;
      const phone = this.findPhone(phoneKey);
      if (phone) {
        const variant = device.storage || Object.keys(phone.variants)[0];
        const phoneCost = phone.variants[variant];
        
        // Apply trade-in value
        const tradeInValue = tradeInValues[device.currentPhone] || 0;
        const afterTradeIn = Math.max(0, phoneCost - tradeInValue);
        
        // Check for BOGO or other promotions
        if (index === 1 && lineCount >= 2 && 
            (planKey === 'GO5G_Next' || planKey === 'GO5G_Plus')) {
          const bogoPromo = promotions.phone_deals[`${planKey}_BOGO`];
          if (bogoPromo && bogoPromo.requirements.new_line) {
            const bogoValue = Math.min(bogoPromo.value, afterTradeIn);
            scenario.promotionsApplied.push(`${bogoPromo.name}: -$${bogoValue}`);
            scenario.upfrontCost += afterTradeIn - bogoValue;
            scenario.totalSavings += bogoValue;
          } else {
            scenario.upfrontCost += afterTradeIn;
          }
        } else {
          // Check for trade-in promotions
          if (tradeInValue > 0 && device.currentPhone !== 'no_trade') {
            const tradeInPromo = promotions.phone_deals.TRADEIN_ANY_CONDITION;
            if (tradeInPromo && tradeInPromo.requirements.plan.includes(planKey)) {
              const additionalCredit = Math.min(tradeInPromo.value - tradeInValue, phoneCost - tradeInValue);
              if (additionalCredit > 0) {
                scenario.promotionsApplied.push(`${tradeInPromo.name}: Additional -$${additionalCredit}`);
                scenario.totalSavings += additionalCredit;
              }
            }
          }
          scenario.upfrontCost += afterTradeIn;
        }
        
        scenario.lineItems.push({
          type: 'device',
          description: `${phone.name} ${variant}`,
          originalPrice: phoneCost,
          tradeInValue: tradeInValue,
          finalPrice: afterTradeIn
        });
      }
    });

    // Add accessories if selected
    if (this.customer.accessories?.watch) {
      scenario.monthlyTotal += 10; // Watch line ($10/month for watch connectivity)
      const watchPromo = promotions.accessory_promotions.WATCH_200_OFF;
      
      if (watchPromo && watchPromo.requirements.new_watch_line) {
        scenario.promotionsApplied.push(`${watchPromo.name} with new watch line`);
        scenario.totalSavings += watchPromo.discount_amount;
        // Note: Actual device cost would be calculated separately
      }
    }

    if (this.customer.accessories?.tablet) {
      scenario.monthlyTotal += 10; // Tablet line
      const tabletPromo = promotions.accessory_promotions.IPAD_230_OFF;
      if (tabletPromo) {
        scenario.promotionsApplied.push(`${tabletPromo.name}: -$${tabletPromo.value}`);
        scenario.totalSavings += tabletPromo.value;
      }
    }

    // Calculate 24-month total
    scenario.total24Month = (scenario.monthlyTotal * 24) + scenario.upfrontCost;
    
    // Calculate savings vs competitor
    const competitorMonthly = scenario.monthlyTotal + 30; // Assume competitor is $30 more
    scenario.totalSavings = (competitorMonthly * 24) - scenario.total24Month;

    return scenario;
  }

  calculateKeepAndSwitchScenario() {
    const scenario = {
      name: "Keep & Switch",
      type: "keep_and_switch",
      lineItems: [],
      monthlyTotal: 0,
      upfrontCost: 0,
      totalSavings: 0,
      promotionsApplied: [],
      reimbursements: 0
    };

    // Same plan calculation
    const planKey = this.customer.selectedPlan || 'GO5G_Next';
    const plan = plans.postpaid[planKey];
    const lineCount = this.customer.lines || 1;
    scenario.monthlyTotal = plan.pricing[lineCount] || plan.pricing[1] * lineCount;

    // Calculate Keep & Switch reimbursements
    const keepAndSwitch = promotions.switcher_benefits.KEEP_AND_SWITCH;
    if (keepAndSwitch && this.isEligibleForKeepAndSwitch()) {
      const eligibleLines = Math.min(lineCount, keepAndSwitch.max_lines);
      scenario.reimbursements = eligibleLines * keepAndSwitch.max_per_line;
      scenario.promotionsApplied.push(`${keepAndSwitch.name}: $${scenario.reimbursements} via ${keepAndSwitch.payment_method}`);
      scenario.promotionsApplied.push(`Processing time: ${keepAndSwitch.processing_time_days} days`);
    } else {
      scenario.reimbursements = 0;
    }

    // Port-in credits
    const portInCredit = promotions.switcher_benefits.PORT_IN_CREDIT;
    if (portInCredit && !this.customer.isExisting) {
      const eligibleLines = Math.min(lineCount, portInCredit.max_lines);
      const portInCredits = eligibleLines * portInCredit.general;
      scenario.reimbursements += portInCredits;
      scenario.promotionsApplied.push(`Port-in Credits: $${portInCredits} (up to ${portInCredit.max_lines} lines)`);
    }

    // Full price for new devices (no trade-in)
    this.customer.devices?.forEach((device) => {
      const phoneKey = device.newPhone;
      const phone = this.findPhone(phoneKey);
      if (phone) {
        const variant = device.storage || Object.keys(phone.variants)[0];
        const phoneCost = phone.variants[variant];
        scenario.upfrontCost += phoneCost;
        
        scenario.lineItems.push({
          type: 'device',
          description: `${phone.name} ${variant}`,
          originalPrice: phoneCost,
          finalPrice: phoneCost
        });
      }
    });

    // Subtract reimbursements from total cost
    scenario.total24Month = (scenario.monthlyTotal * 24) + scenario.upfrontCost - scenario.reimbursements;
    
    // Calculate savings
    const competitorMonthly = scenario.monthlyTotal + 30;
    scenario.totalSavings = (competitorMonthly * 24) + scenario.reimbursements - scenario.total24Month;

    return scenario;
  }

  calculateSelectiveTradeInScenario() {
    const scenario = {
      name: "Smart Mix Strategy",
      type: "selective_trade",
      lineItems: [],
      monthlyTotal: 0,
      upfrontCost: 0,
      totalSavings: 0,
      promotionsApplied: []
    };

    // Plan costs
    const planKey = this.customer.selectedPlan || 'GO5G_Next';
    const plan = plans.postpaid[planKey];
    const lineCount = this.customer.lines || 1;
    scenario.monthlyTotal = plan.pricing[lineCount] || plan.pricing[1] * lineCount;

    // Smart decision: Trade high-value phones, keep low-value for Keep & Switch
    let keepAndSwitchLines = 0;
    this.customer.devices?.forEach((device, index) => {
      const phoneKey = device.newPhone;
      const phone = this.findPhone(phoneKey);
      if (phone) {
        const variant = device.storage || Object.keys(phone.variants)[0];
        const phoneCost = phone.variants[variant];
        const tradeInValue = tradeInValues[device.currentPhone] || 0;
        
        // If trade-in value > $400, trade it in. Otherwise, use Keep & Switch
        if (tradeInValue > 400) {
          const afterTradeIn = Math.max(0, phoneCost - tradeInValue);
          scenario.upfrontCost += afterTradeIn;
          scenario.promotionsApplied.push(`Trade-in Line ${index + 1}: -$${tradeInValue}`);
        } else if (keepAndSwitchLines < 4) {
          scenario.upfrontCost += phoneCost;
          keepAndSwitchLines++;
          scenario.promotionsApplied.push(`Keep & Switch Line ${index + 1}: $800 credit`);
        }
        
        scenario.lineItems.push({
          type: 'device',
          description: `${phone.name} ${variant}`,
          strategy: tradeInValue > 400 ? 'trade-in' : 'keep-switch'
        });
      }
    });

    const keepAndSwitchTotal = keepAndSwitchLines * 800;
    scenario.total24Month = (scenario.monthlyTotal * 24) + scenario.upfrontCost - keepAndSwitchTotal;
    
    const competitorMonthly = scenario.monthlyTotal + 30;
    scenario.totalSavings = (competitorMonthly * 24) - scenario.total24Month + keepAndSwitchTotal;

    return scenario;
  }

  calculateBundleScenario() {
    const scenario = {
      name: "Maximum Bundle Savings",
      type: "bundle_max",
      lineItems: [],
      monthlyTotal: 0,
      upfrontCost: 0,
      totalSavings: 0,
      promotionsApplied: []
    };

    // Plan with bundle discounts
    const planKey = this.customer.selectedPlan || 'GO5G_Next';
    const plan = plans.postpaid[planKey];
    const lineCount = this.customer.lines || 1;
    scenario.monthlyTotal = plan.pricing[lineCount] || plan.pricing[1] * lineCount;

    // Apply 3rd line free if applicable
    if (lineCount >= 3) {
      const lineDiscount = plan.pricing[1];
      scenario.monthlyTotal -= lineDiscount;
      scenario.promotionsApplied.push(`3rd Line FREE: -$${lineDiscount}/mo`);
    }

    // Add Home Internet with discount
    if (lineCount >= 2) {
      scenario.promotionsApplied.push("Home Internet: FREE (normally $60/mo)");
      scenario.lineItems.push({
        type: 'service',
        description: 'T-Mobile Home Internet',
        originalPrice: 60,
        finalPrice: 0
      });
    }

    // Insider discount if new customer
    if (this.customer.newCustomer && lineCount >= 2) {
      const insiderDiscount = scenario.monthlyTotal * 0.20;
      scenario.monthlyTotal -= insiderDiscount;
      scenario.promotionsApplied.push(`Insider 20% off: -$${insiderDiscount.toFixed(2)}/mo`);
    }

    // Add devices with bundle promotions
    this.customer.devices?.forEach((device) => {
      const phoneKey = device.newPhone;
      const phone = this.findPhone(phoneKey);
      if (phone) {
        const variant = device.storage || Object.keys(phone.variants)[0];
        const phoneCost = phone.variants[variant];
        const tradeInValue = tradeInValues[device.currentPhone] || 0;
        scenario.upfrontCost += Math.max(0, phoneCost - tradeInValue);
      }
    });

    scenario.total24Month = (scenario.monthlyTotal * 24) + scenario.upfrontCost;
    
    const competitorMonthly = scenario.monthlyTotal + 50; // Bigger savings with bundles
    scenario.totalSavings = (competitorMonthly * 24) - scenario.total24Month;

    return scenario;
  }

  findPhone(phoneKey) {
    for (const brand of Object.values(phoneData.phones)) {
      if (brand[phoneKey]) {
        return brand[phoneKey];
      }
    }
    return null;
  }

  getBestDeal() {
    if (this.scenarios.length === 0) {
      this.calculateAllScenarios();
    }
    return this.scenarios[0];
  }

  getComparisonMatrix() {
    if (this.scenarios.length === 0) {
      this.calculateAllScenarios();
    }
    return this.scenarios;
  }

  // Helper method to check Keep & Switch eligibility
  isEligibleForKeepAndSwitch() {
    // Check if customer has current carrier information
    const hasCarrierInfo = this.customer.carrier && this.customer.carrier.length > 0;
    
    // Check if switching from eligible carriers
    const keepAndSwitch = promotions.switcher_benefits.KEEP_AND_SWITCH;
    if (!keepAndSwitch) return false;
    
    const eligibleCarriers = keepAndSwitch.requirements.eligible_carriers;
    const isEligibleCarrier = hasCarrierInfo && 
      eligibleCarriers.some(carrier => 
        this.customer.carrier.toLowerCase().includes(carrier.toLowerCase())
      );
    
    // Must be switching (not existing T-Mobile customer)
    const isSwitching = !this.customer.isExisting;
    
    return isSwitching && (isEligibleCarrier || !hasCarrierInfo); // Allow if no carrier specified yet
  }
}