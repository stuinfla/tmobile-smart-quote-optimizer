import { phoneData, tradeInValues } from '../data/phoneData';
import { promotions } from '../data/promotions';
import { plans } from '../data/plans';

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
        if (index === 1 && this.customer.newLine && 
            (planKey === 'GO5G_Next' || planKey === 'GO5G_Plus')) {
          const bogoValue = Math.min(830, afterTradeIn);
          scenario.promotionsApplied.push(`BOGO Line ${index + 1}: -$${bogoValue}`);
          scenario.upfrontCost += afterTradeIn - bogoValue;
        } else {
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
      scenario.monthlyTotal += 10; // Watch line
      if (planKey === 'GO5G_Next') {
        scenario.promotionsApplied.push("Apple Watch Ultra 2: FREE (normally $799)");
      } else {
        scenario.promotionsApplied.push("Apple Watch SE: $99 (normally $299)");
        scenario.upfrontCost += 99;
      }
    }

    if (this.customer.accessories?.tablet) {
      scenario.monthlyTotal += 10; // Tablet line
      scenario.promotionsApplied.push("iPad discount: -$230");
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
    const eligibleLines = Math.min(lineCount, keepAndSwitch.max_lines);
    scenario.reimbursements = eligibleLines * keepAndSwitch.max_per_line;
    scenario.promotionsApplied.push(`Keep & Switch: $${scenario.reimbursements} in bill credits`);

    // Port-in credits
    const portInCredits = Math.min(lineCount, 3) * 200;
    scenario.reimbursements += portInCredits;
    scenario.promotionsApplied.push(`Port-in Credits: $${portInCredits}`);

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
}