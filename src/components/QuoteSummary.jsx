import { useEffect, useState } from 'react';
import taxConfig from '../data/taxConfig.json';
import accessoryPricing from '../data/accessoryPricing.json';
import { insurancePricing } from '../data/insuranceData';
import '../styles/QuoteSummary.css';

function QuoteSummary({ customerData, planData, repInfo, storeInfo }) {
  const [summary, setSummary] = useState({
    upfront: 0,
    monthly: 0,
    devices: [],
    accessories: {},
    taxes: {}
  });

  useEffect(() => {
    calculateSummary();
  }, [customerData, planData]);

  const calculateSummary = () => {
    // Get tax rates for Florida/Palm Beach (default)
    const taxes = taxConfig.florida;
    const countyTax = taxes.counties.palm_beach;
    
    let upfrontTotal = 0;
    let monthlyTotal = 0;
    
    // 1. Activation Fees
    const activationFees = customerData.lines * taxes.fees.activation_fee_per_line;
    upfrontTotal += activationFees;
    
    // 2. Device Costs (if purchasing)
    let deviceCosts = 0;
    customerData.devices.forEach(device => {
      if (device.newPhone && device.storage) {
        // Get device price from phoneData
        const devicePrice = 999; // Would get from phoneData
        deviceCosts += devicePrice;
      }
    });
    
    // Apply device sales tax
    const deviceTax = deviceCosts * countyTax.total_device_tax;
    upfrontTotal += deviceCosts + deviceTax;
    
    // 3. Monthly Plan Costs
    const planMonthly = planData?.monthlyPrice || 0;
    monthlyTotal += planMonthly;
    
    // 4. Accessory Monthly Costs
    if (customerData.accessories) {
      // Apple Watches
      if (customerData.accessories.watches > 0) {
        monthlyTotal += customerData.accessories.watches * 10;
      }
      
      // iPads
      if (customerData.accessories.ipads?.count > 0) {
        const ipadPlan = customerData.accessories.ipads.plan === 'ipad_unlimited' ? 20 : 5;
        monthlyTotal += customerData.accessories.ipads.count * ipadPlan;
      }
      
      // Home Internet
      if (customerData.accessories.homeInternet) {
        monthlyTotal += customerData.lines >= 2 ? 0 : 60;
      }
      
      // Insurance - calculate tier-based pricing
      let insuranceTotal = 0;
      if (customerData.devices) {
        customerData.devices.forEach((device, index) => {
          if (customerData.accessories.insurance?.[index]) {
            const deviceModel = device.newPhone || device.model;
            const insuranceInfo = deviceModel ? 
              insurancePricing.getInsurancePrice(deviceModel) : 
              insurancePricing.tiers.tier3;
            insuranceTotal += insuranceInfo.monthly;
          }
        });
      }
      monthlyTotal += insuranceTotal;
    }
    
    // 5. Monthly Taxes & Fees
    const monthlyServiceTax = monthlyTotal * countyTax.total_service_tax;
    const regulatoryFees = customerData.lines * taxes.fees.regulatory_fee_per_line;
    const surcharges = customerData.lines * taxes.fees.federal_local_surcharge_per_line;
    
    const totalMonthlyWithTaxes = monthlyTotal + monthlyServiceTax + regulatoryFees + surcharges;
    
    setSummary({
      upfront: upfrontTotal,
      monthly: totalMonthlyWithTaxes,
      activationFees,
      deviceCosts,
      deviceTax,
      planMonthly,
      monthlyTaxes: monthlyServiceTax,
      regulatoryFees,
      surcharges,
      accessories: customerData.accessories || {}
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleShare = (method) => {
    const message = generateShareMessage();
    
    if (method === 'text') {
      // For mobile devices, open SMS
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        window.open(`sms:&body=${encodeURIComponent(message)}`);
      }
    } else if (method === 'email') {
      const subject = 'Your T-Mobile Quote';
      window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`);
    } else if (method === 'copy') {
      navigator.clipboard.writeText(message);
      alert('Quote copied to clipboard!');
    }
  };

  const generateShareMessage = () => {
    return `T-Mobile Quote Summary
    
Lines: ${customerData.lines}
Plan: ${planData?.name || 'Experience'}

UPFRONT: ${formatCurrency(summary.upfront)}
- Activation: ${formatCurrency(summary.activationFees)}
${summary.deviceCosts > 0 ? `- Devices + Tax: ${formatCurrency(summary.deviceCosts + summary.deviceTax)}` : ''}

MONTHLY: ${formatCurrency(summary.monthly)}
- Plan: ${formatCurrency(summary.planMonthly)}
${summary.accessories.watches > 0 ? `- Apple Watch (${summary.accessories.watches}): $${summary.accessories.watches * 10}` : ''}
${summary.accessories.ipads?.count > 0 ? `- iPad (${summary.accessories.ipads.count}): $${summary.accessories.ipads.count * (summary.accessories.ipads.plan === 'ipad_unlimited' ? 20 : 5)}` : ''}
${summary.accessories.homeInternet ? `- Home Internet: ${customerData.lines >= 2 ? 'FREE' : '$60'}` : ''}
- Taxes & Fees: ${formatCurrency(summary.monthlyTaxes + summary.regulatoryFees + summary.surcharges)}

Rep: ${repInfo?.name || 'T-Mobile Expert'}
Store: ${storeInfo?.storeId || '7785'}
Valid: September 2025`;
  };

  return (
    <div className="quote-summary">
      <div className="summary-header">
        <h2>Quote Summary</h2>
        <div className="share-buttons">
          <button onClick={() => handleShare('text')} title="Send as Text">📱</button>
          <button onClick={() => handleShare('email')} title="Send as Email">✉️</button>
          <button onClick={() => handleShare('copy')} title="Copy to Clipboard">📋</button>
        </div>
      </div>

      <div className="summary-section upfront">
        <h3>Due Today</h3>
        <div className="amount-large">{formatCurrency(summary.upfront)}</div>
        <div className="breakdown">
          <div className="line-item">
            <span>Activation ({customerData.lines} lines × $10)</span>
            <span>{formatCurrency(summary.activationFees)}</span>
          </div>
          {summary.deviceCosts > 0 && (
            <>
              <div className="line-item">
                <span>Devices</span>
                <span>{formatCurrency(summary.deviceCosts)}</span>
              </div>
              <div className="line-item">
                <span>Sales Tax (7%)</span>
                <span>{formatCurrency(summary.deviceTax)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="summary-section monthly">
        <h3>Monthly Total</h3>
        <div className="amount-large">{formatCurrency(summary.monthly)}</div>
        <div className="breakdown">
          <div className="line-item">
            <span>{customerData.lines} lines</span>
            <span>{formatCurrency(summary.planMonthly)}</span>
          </div>
          
          {summary.accessories.watches > 0 && (
            <div className="line-item">
              <span>Apple Watch ({summary.accessories.watches})</span>
              <span>${summary.accessories.watches * 10}</span>
            </div>
          )}
          
          {summary.accessories.ipads?.count > 0 && (
            <div className="line-item">
              <span>iPad {summary.accessories.ipads.plan === 'ipad_unlimited' ? 'Unlimited' : '5GB'} ({summary.accessories.ipads.count})</span>
              <span>${summary.accessories.ipads.count * (summary.accessories.ipads.plan === 'ipad_unlimited' ? 20 : 5)}</span>
            </div>
          )}
          
          {summary.accessories.homeInternet && (
            <div className="line-item">
              <span>Home Internet</span>
              <span>{customerData.lines >= 2 ? 'FREE' : '$60'}</span>
            </div>
          )}
          
          {summary.accessories.insurance?.filter(Boolean).length > 0 && (
            <div className="line-item">
              <span>Protection 360 ({summary.accessories.insurance.filter(Boolean).length} devices)</span>
              <span>${(() => {
                let total = 0;
                customerData.devices?.forEach((device, index) => {
                  if (summary.accessories.insurance?.[index]) {
                    const deviceModel = device.newPhone || device.model;
                    const insuranceInfo = deviceModel ? 
                      insurancePricing.getInsurancePrice(deviceModel) : 
                      insurancePricing.tiers.tier3;
                    total += insuranceInfo.monthly;
                  }
                });
                return total;
              })()}</span>
            </div>
          )}
          
          <div className="line-item taxes">
            <span>Taxes & Fees</span>
            <span>{formatCurrency(summary.monthlyTaxes + summary.regulatoryFees + summary.surcharges)}</span>
          </div>
        </div>
      </div>

      <div className="quote-footer">
        <div className="rep-info">
          {repInfo?.name || 'T-Mobile Expert'} • Store {storeInfo?.storeId || '7785'}
        </div>
        <div className="validity">
          Valid through September 2025
        </div>
      </div>
    </div>
  );
}

export default QuoteSummary;