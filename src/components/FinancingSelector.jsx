import React, { useState, useEffect } from 'react';
import { calculateDeviceFinancing } from '../data/complete_pricing_database';
import '../styles/financing-selector.css';

const FinancingSelector = ({ 
  devices, 
  onFinancingUpdate, 
  initialFinancing = '24' 
}) => {
  const [selectedFinancing, setSelectedFinancing] = useState(initialFinancing);
  const [showComparison, setShowComparison] = useState(false);

  const financingOptions = {
    '24': {
      label: '24-Month Financing',
      description: '0% APR • No down payment',
      benefits: ['Lower total cost', 'Pay off device faster', 'Upgrade eligible after 12 months'],
      icon: '📅'
    },
    '36': {
      label: '36-Month Financing',
      description: '0% APR • No down payment',
      benefits: ['33% lower monthly payments', 'More budget flexibility', 'Extended payment period'],
      icon: '📆',
      highlight: true
    }
  };

  useEffect(() => {
    if (onFinancingUpdate) {
      onFinancingUpdate({
        term: selectedFinancing,
        details: financingOptions[selectedFinancing]
      });
    }
  }, [selectedFinancing]);

  const calculateTotalFinancing = () => {
    if (!devices || devices.length === 0) return null;

    const totals = {
      '24': { monthly: 0, total: 0 },
      '36': { monthly: 0, total: 0 }
    };

    devices.forEach(device => {
      if (device.newPhone && device.retailPrice) {
        const financing24 = calculateDeviceFinancing(device.retailPrice, 24);
        const financing36 = calculateDeviceFinancing(device.retailPrice, 36);
        
        totals['24'].monthly += parseFloat(financing24.monthlyPayment);
        totals['24'].total += device.retailPrice;
        
        totals['36'].monthly += parseFloat(financing36.monthlyPayment);
        totals['36'].total += device.retailPrice;
      }
    });

    return totals;
  };

  const totals = calculateTotalFinancing();

  return (
    <div className="financing-selector">
      <div className="financing-header">
        <h3>Device Financing Options</h3>
        <p className="financing-subtitle">
          Choose your payment plan for new devices
        </p>
      </div>

      <div className="financing-options">
        {Object.entries(financingOptions).map(([term, details]) => (
          <button
            key={term}
            className={`financing-card ${selectedFinancing === term ? 'selected' : ''} ${details.highlight ? 'highlighted' : ''}`}
            onClick={() => setSelectedFinancing(term)}
          >
            {details.highlight && (
              <div className="popular-badge">Most Popular</div>
            )}
            <div className="financing-icon">{details.icon}</div>
            <div className="financing-content">
              <div className="financing-label">{details.label}</div>
              <div className="financing-description">{details.description}</div>
              
              {totals && (
                <div className="financing-price">
                  <span className="price-amount">${totals[term].monthly.toFixed(2)}</span>
                  <span className="price-period">/mo per device</span>
                </div>
              )}
              
              <ul className="financing-benefits">
                {details.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
            
            {selectedFinancing === term && (
              <div className="financing-check">✓</div>
            )}
          </button>
        ))}
      </div>

      {totals && (
        <button 
          className="btn-compare"
          onClick={() => setShowComparison(!showComparison)}
        >
          {showComparison ? 'Hide' : 'Show'} Payment Comparison
        </button>
      )}

      {showComparison && totals && (
        <div className="financing-comparison">
          <h4>Monthly Payment Comparison</h4>
          <div className="comparison-table">
            <div className="comparison-row header">
              <div className="comparison-cell">Financing Term</div>
              <div className="comparison-cell">Monthly Payment</div>
              <div className="comparison-cell">Total Cost</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-cell">24 Months</div>
              <div className="comparison-cell">${totals['24'].monthly.toFixed(2)}</div>
              <div className="comparison-cell">${totals['24'].total.toFixed(2)}</div>
            </div>
            <div className="comparison-row highlighted">
              <div className="comparison-cell">
                36 Months
                <span className="savings-badge">Save ${(totals['24'].monthly - totals['36'].monthly).toFixed(2)}/mo</span>
              </div>
              <div className="comparison-cell">${totals['36'].monthly.toFixed(2)}</div>
              <div className="comparison-cell">${totals['36'].total.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="comparison-note">
            <p>
              <strong>💡 Pro Tip:</strong> Choose 36-month financing to reduce your monthly payment by 
              <strong> ${(totals['24'].monthly - totals['36'].monthly).toFixed(2)}</strong> per month with 0% APR!
            </p>
          </div>
        </div>
      )}

      <div className="financing-note">
        <p>
          <strong>Note:</strong> All financing options include 0% APR with approved credit. 
          No down payment required. You can pay off your device early at any time without penalties.
        </p>
      </div>
    </div>
  );
};

export default FinancingSelector;