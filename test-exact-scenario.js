// Direct test of the exact scenario using the optimizer
import { DealOptimizer } from './src/utils/optimizerFixed.js';

console.log('='.repeat(80));
console.log('TESTING YOUR EXACT SCENARIO');
console.log('='.repeat(80));

// Your exact scenario
const customerData = {
  isExisting: false,
  newCustomer: true,
  carrier: 'verizon', // Coming from Verizon for Keep & Switch
  lines: 3,
  devices: [
    { 
      currentPhone: 'no_trade', 
      newPhone: 'iPhone_17_Pro', 
      storage: '256GB', 
      insurance: true 
    },
    { 
      currentPhone: 'no_trade', 
      newPhone: 'iPhone_17_Pro', 
      storage: '256GB', 
      insurance: true 
    },
    { 
      currentPhone: 'no_trade', 
      newPhone: 'iPhone_17_Pro', 
      storage: '256GB', 
      insurance: true 
    }
  ],
  selectedPlan: 'EXPERIENCE_BEYOND',
  accessoryLines: {
    watch: true,
    tablet: true,
    homeInternet: false
  },
  watchDevice: 'byod', // Bringing your own watch
  tabletDevice: 'byod', // Bringing your own iPads (2)
  location: 'miami_dade'
};

console.log('\nScenario Details:');
console.log('✓ 3 new lines');
console.log('✓ 3x iPhone 17 Pro (256GB) @ $1199 each');
console.log('✓ Experience Beyond plan');
console.log('✓ All phones with Protection 360 insurance');
console.log('✓ BYOD Apple Watch (existing - just $5/mo line)');
console.log('✓ BYOD 2 iPads (existing - just $5/mo per line)');
console.log('✓ New customer from Verizon');

const optimizer = new DealOptimizer(customerData);
const scenarios = optimizer.calculateAllScenarios();

// Get the best deal (should be Keep & Switch since no trade-ins)
const bestDeal = scenarios[0];

console.log('\n' + '='.repeat(80));
console.log('RESULTS FROM APPLICATION:');
console.log('='.repeat(80));

console.log('\n📱 Monthly Breakdown:');
console.log(`- Plan (3 lines Experience Beyond): $${bestDeal.monthlyService}`);
console.log(`- Device Financing: $${bestDeal.monthlyDeviceFinancing?.toFixed(2)}`);
console.log(`- Insurance (3 phones): $${bestDeal.monthlyInsurance}`);
console.log(`- Accessory Lines: $${bestDeal.monthlyAccessoryPlans}`);
console.log(`- Accessory Device Financing: $${bestDeal.monthlyAccessoryFinancing?.toFixed(2)}`);
console.log(`- Taxes: $${bestDeal.monthlyTaxes?.toFixed(2)}`);
console.log(`- Fees: $${bestDeal.monthlyFees?.toFixed(2)}`);
console.log('-'.repeat(40));
console.log(`TOTAL MONTHLY: $${bestDeal.monthlyTotal?.toFixed(2)}`);

console.log('\n💳 Upfront Costs:');
console.log(`- Device Taxes: $${bestDeal.deviceTaxes?.toFixed(2)}`);
console.log(`- Accessory Taxes: $${bestDeal.accessoryTaxes?.toFixed(2)}`);
console.log(`- Activation Fees: $${bestDeal.activationFees?.toFixed(2)}`);
console.log(`- First Month Payment: $${bestDeal.firstMonthPayment?.toFixed(2)}`);
console.log('-'.repeat(40));
console.log(`TOTAL UPFRONT: $${bestDeal.upfrontTotal?.toFixed(2)}`);

console.log('\n📊 Promotions Applied:');
bestDeal.promotionsApplied?.forEach(promo => {
  console.log(`- ${promo}`);
});

console.log('\n' + '='.repeat(80));
console.log('📋 YOUR CHECKSUM VALUES:');
console.log('='.repeat(80));
console.log(`MONTHLY PAYMENT: $${bestDeal.monthlyTotal?.toFixed(2)}`);
console.log(`UPFRONT COST: $${bestDeal.upfrontTotal?.toFixed(2)}`);
console.log('='.repeat(80));

// Compare with expected values
console.log('\n⚖️ Comparison with Expected:');
console.log('Expected Monthly: $390.40');
console.log(`Actual Monthly: $${bestDeal.monthlyTotal?.toFixed(2)}`);
console.log('Expected Upfront: $852.19');
console.log(`Actual Upfront: $${bestDeal.upfrontTotal?.toFixed(2)}`);