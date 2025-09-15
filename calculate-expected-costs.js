// Manual calculation for the exact scenario
console.log('='.repeat(80));
console.log('EXPECTED COST CALCULATION');
console.log('='.repeat(80));

console.log('\nScenario:');
console.log('- 3 new lines');
console.log('- 3x iPhone 17 Pro (256GB) - $1199 each');
console.log('- Experience Beyond plan');
console.log('- All phones with insurance');
console.log('- BYOD Apple Watch (just line fee)');
console.log('- BYOD 2 iPads (just line fees)');
console.log('- New customer from Verizon (Keep & Switch)');

console.log('\n' + '='.repeat(80));
console.log('MONTHLY COSTS:');
console.log('='.repeat(80));

// Plan cost - Experience Beyond for 3 lines
const planPerLine = 66.67; // With AutoPay from plans_sept_2025.js
const planTotal = planPerLine * 3;
console.log(`\n1. Plan (3 lines @ $${planPerLine.toFixed(2)} with AutoPay): $${planTotal.toFixed(2)}`);

// Device financing - 3x iPhone 17 Pro
// As new customer from Verizon, should get $800 credit per line
const iphonePrice = 1199; // iPhone 17 Pro 256GB
const newCustomerCredit = 800; // Keep & Switch credit
const financedAmount = iphonePrice - newCustomerCredit;
const monthlyPerPhone = financedAmount / 24;
const totalPhoneFinancing = monthlyPerPhone * 3;
console.log(`\n2. Device Financing:`);
console.log(`   iPhone 17 Pro: $${iphonePrice}`);
console.log(`   Less new customer credit: -$${newCustomerCredit}`);
console.log(`   Financed amount: $${financedAmount}`);
console.log(`   Monthly per phone: $${monthlyPerPhone.toFixed(2)}`);
console.log(`   Total (3 phones): $${totalPhoneFinancing.toFixed(2)}`);

// Insurance - iPhone 17 Pro is Tier 5 ($25/month)
const insurancePerPhone = 25; // Tier 5 from insuranceData.js
const totalInsurance = insurancePerPhone * 3;
console.log(`\n3. Insurance (3x @ $${insurancePerPhone}): $${totalInsurance}`);

// Accessory lines (with Experience Beyond = promotional rates)
const watchLine = 5; // Promotional rate with Experience Beyond
const tabletLine = 5; // Promotional rate with Experience Beyond
const totalTabletLines = tabletLine * 2; // 2 iPads
const totalAccessoryLines = watchLine + totalTabletLines;
console.log(`\n4. Accessory Lines:`);
console.log(`   Apple Watch line: $${watchLine}`);
console.log(`   iPad lines (2x @ $${tabletLine}): $${totalTabletLines}`);
console.log(`   Total accessory lines: $${totalAccessoryLines}`);

// Taxes and fees (Miami-Dade: 14.44% on service)
const serviceTaxRate = 0.1444;
const serviceSubtotal = planTotal + totalAccessoryLines; // Service charges subject to tax
const serviceTaxes = serviceSubtotal * serviceTaxRate;
const regulatoryFees = 3.99 * 3; // Per line
const federalSurcharge = 2.50 * 3; // Per line
const totalTaxesAndFees = serviceTaxes + regulatoryFees + federalSurcharge;
console.log(`\n5. Taxes & Fees (Miami-Dade):`);
console.log(`   Service taxes (14.44%): $${serviceTaxes.toFixed(2)}`);
console.log(`   Regulatory fees ($3.99 x 3): $${regulatoryFees.toFixed(2)}`);
console.log(`   Federal surcharge ($2.50 x 3): $${federalSurcharge.toFixed(2)}`);
console.log(`   Total taxes & fees: $${totalTaxesAndFees.toFixed(2)}`);

// TOTAL MONTHLY
const totalMonthly = planTotal + totalPhoneFinancing + totalInsurance + totalAccessoryLines + totalTaxesAndFees;
console.log('\n' + '='.repeat(80));
console.log('TOTAL MONTHLY PAYMENT: $' + totalMonthly.toFixed(2));
console.log('='.repeat(80));

console.log('\n' + '='.repeat(80));
console.log('UPFRONT COSTS:');
console.log('='.repeat(80));

// Device taxes (7% on full price, paid upfront)
const deviceTaxRate = 0.07;
const deviceTaxPerPhone = iphonePrice * deviceTaxRate;
const totalDeviceTax = deviceTaxPerPhone * 3;
console.log(`\n1. Device taxes (7% on $${iphonePrice} x 3): $${totalDeviceTax.toFixed(2)}`);

// Activation fees ($35 per device)
const activationPerDevice = 35;
const totalDevices = 3 + 1 + 2; // 3 phones + 1 watch + 2 tablets
const totalActivation = activationPerDevice * totalDevices;
console.log(`\n2. Activation fees ($${activationPerDevice} x ${totalDevices} devices): $${totalActivation}`);

// First month's service
console.log(`\n3. First month's service: $${totalMonthly.toFixed(2)}`);

// TOTAL UPFRONT
const totalUpfront = totalDeviceTax + totalActivation + totalMonthly;
console.log('\n' + '='.repeat(80));
console.log('TOTAL UPFRONT COST: $' + totalUpfront.toFixed(2));
console.log('='.repeat(80));

console.log('\n📊 SUMMARY FOR YOUR CHECKSUM:');
console.log('=' .repeat(80));
console.log('MONTHLY PAYMENT: $' + totalMonthly.toFixed(2));
console.log('UPFRONT COST: $' + totalUpfront.toFixed(2));
console.log('=' .repeat(80));