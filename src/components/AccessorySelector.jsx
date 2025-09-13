import { useState, useEffect } from 'react';
import accessoryPricing from '../data/accessoryPricing.json';
import '../styles/AccessorySelector.css';

function AccessorySelector({ customerData, setCustomerData, onNext }) {
  const [accessories, setAccessories] = useState({
    watches: 0,
    ipads: { count: 0, plan: 'ipad_5gb' },
    homeInternet: false,
    insurance: Array(customerData.lines).fill(false)
  });

  useEffect(() => {
    // Initialize from customerData if exists
    if (customerData.accessories) {
      setAccessories(customerData.accessories);
    }
  }, [customerData]);

  const handleWatchQuantity = (delta) => {
    const newCount = Math.max(0, Math.min(customerData.lines, accessories.watches + delta));
    setAccessories({...accessories, watches: newCount});
  };

  const handleIpadQuantity = (delta) => {
    const newCount = Math.max(0, Math.min(4, accessories.ipads.count + delta));
    setAccessories({
      ...accessories, 
      ipads: {...accessories.ipads, count: newCount}
    });
  };

  const handleIpadPlan = (plan) => {
    setAccessories({
      ...accessories,
      ipads: {...accessories.ipads, plan}
    });
  };

  const handleInsurance = (lineIndex) => {
    const newInsurance = [...accessories.insurance];
    newInsurance[lineIndex] = !newInsurance[lineIndex];
    setAccessories({...accessories, insurance: newInsurance});
  };

  const calculateMonthlyTotal = () => {
    let total = 0;
    
    // Watches
    total += accessories.watches * accessoryPricing.apple_watch.plans[0].monthlyPrice;
    
    // iPads
    if (accessories.ipads.count > 0) {
      const ipadPlan = accessoryPricing.ipad.plans.find(p => p.id === accessories.ipads.plan);
      total += accessories.ipads.count * ipadPlan.monthlyPrice;
    }
    
    // Home Internet
    if (accessories.homeInternet) {
      total += customerData.lines >= 2 ? 0 : 60; // Free with 2+ lines
    }
    
    // Insurance
    const insuredLines = accessories.insurance.filter(Boolean).length;
    total += insuredLines * accessoryPricing.insurance.protection360.monthlyPrice;
    
    return total;
  };

  const handleContinue = () => {
    setCustomerData({
      ...customerData,
      accessories: accessories
    });
    onNext();
  };

  return (
    <div className="accessory-selector">
      <h2 className="section-title">Add Accessories & Protection</h2>
      
      {/* Apple Watch */}
      <div className="accessory-section">
        <div className="accessory-header">
          <div className="accessory-info">
            <span className="accessory-icon">⌚</span>
            <div>
              <h3>Apple Watch</h3>
              <p className="promo-text">$200 off any Apple Watch with new line</p>
              <p className="price-text">$10/month per watch line</p>
            </div>
          </div>
          <div className="quantity-selector">
            <button onClick={() => handleWatchQuantity(-1)} disabled={accessories.watches === 0}>−</button>
            <span className="quantity">{accessories.watches}</span>
            <button onClick={() => handleWatchQuantity(1)} disabled={accessories.watches >= customerData.lines}>+</button>
          </div>
        </div>
      </div>

      {/* iPad */}
      <div className="accessory-section">
        <div className="accessory-header">
          <div className="accessory-info">
            <span className="accessory-icon">📱</span>
            <div>
              <h3>iPad</h3>
              <p className="promo-text">$230 off iPad with new line</p>
            </div>
          </div>
          <div className="quantity-selector">
            <button onClick={() => handleIpadQuantity(-1)} disabled={accessories.ipads.count === 0}>−</button>
            <span className="quantity">{accessories.ipads.count}</span>
            <button onClick={() => handleIpadQuantity(1)} disabled={accessories.ipads.count >= 4}>+</button>
          </div>
        </div>
        {accessories.ipads.count > 0 && (
          <div className="plan-selector">
            <label>
              <input
                type="radio"
                checked={accessories.ipads.plan === 'ipad_5gb'}
                onChange={() => handleIpadPlan('ipad_5gb')}
              />
              <span>5GB Data - $5/month per iPad</span>
            </label>
            <label>
              <input
                type="radio"
                checked={accessories.ipads.plan === 'ipad_unlimited'}
                onChange={() => handleIpadPlan('ipad_unlimited')}
              />
              <span>Unlimited Data - $20/month per iPad</span>
            </label>
          </div>
        )}
      </div>

      {/* Home Internet */}
      <div className="accessory-section">
        <div className="accessory-header">
          <div className="accessory-info">
            <span className="accessory-icon">🏠</span>
            <div>
              <h3>5G Home Internet</h3>
              <p className="promo-text">
                {customerData.lines >= 2 ? 'FREE with 2+ voice lines!' : '$60/month'}
              </p>
              <p className="price-text">5G broadband for your home</p>
            </div>
          </div>
          <div className="toggle-switch">
            <input
              type="checkbox"
              checked={accessories.homeInternet}
              onChange={() => setAccessories({...accessories, homeInternet: !accessories.homeInternet})}
            />
            <span className="toggle-slider"></span>
          </div>
        </div>
      </div>

      {/* Device Protection */}
      <div className="accessory-section">
        <h3>Device Protection - $18/month per phone</h3>
        <p className="section-subtitle">Protection 360 with AppleCare Services</p>
        <div className="insurance-grid">
          {customerData.devices.map((device, index) => (
            <label key={index} className="insurance-option">
              <input
                type="checkbox"
                checked={accessories.insurance[index]}
                onChange={() => handleInsurance(index)}
              />
              <span>
                Line {index + 1}
                {device.newPhone && ` - ${device.newPhone.replace(/_/g, ' ')}`}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="monthly-summary">
        <h4>Additional Monthly Charges</h4>
        <div className="summary-line">
          <span>Accessories & Protection:</span>
          <span className="price">${calculateMonthlyTotal()}/month</span>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleContinue}>
        Calculate My Savings →
      </button>
    </div>
  );
}

export default AccessorySelector;