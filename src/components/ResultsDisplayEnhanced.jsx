function ResultsDisplayEnhanced({ results, customerData }) {
  // Florida tax rates for Delray Beach (33483)
  const FLORIDA_STATE_TAX = 0.06; // 6% state tax
  const PALM_BEACH_COUNTY_TAX = 0.01; // 1% county tax  
  const TOTAL_TAX_RATE = FLORIDA_STATE_TAX + PALM_BEACH_COUNTY_TAX; // 7% total
  const ACTIVATION_FEE_PER_LINE = 10; // $10 per line activation fee
  
  if (!results || results.length === 0) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Calculating best deals...</p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateTax = (amount) => {
    return amount * TOTAL_TAX_RATE;
  };

  const calculateUpfrontCosts = (scenario) => {
    // Calculate device down payments and taxes
    let deviceCosts = 0;
    let deviceTaxes = 0;
    
    if (scenario.devices) {
      scenario.devices.forEach(device => {
        if (device.downPayment) {
          deviceCosts += device.downPayment;
          deviceTaxes += calculateTax(device.fullPrice || 0); // Tax on full device price
        }
      });
    }
    
    // Calculate activation fees
    const activationFees = customerData.lines * ACTIVATION_FEE_PER_LINE;
    
    // First month service + tax
    const firstMonthService = scenario.monthlyTotal;
    const firstMonthTax = calculateTax(firstMonthService);
    
    return {
      deviceDownPayments: deviceCosts,
      deviceTaxes: deviceTaxes,
      activationFees: activationFees,
      firstMonthService: firstMonthService,
      firstMonthTax: firstMonthTax,
      total: deviceCosts + deviceTaxes + activationFees + firstMonthService + firstMonthTax
    };
  };

  const bestDeal = results[0];

  return (
    <div className="results-section">
      <div className="results-header">
        <h2 className="results-title">🎉 Your Optimized Deals</h2>
        <p className="results-subtitle">
          We found {results.length} ways to save. Here's your best option:
        </p>
        <div className="tax-notice">
          📍 Tax calculated for Delray Beach, FL (7% total: 6% state + 1% county)
        </div>
      </div>

      <div className="scenarios-grid">
        {results.map((scenario, index) => {
          const upfrontCosts = calculateUpfrontCosts(scenario);
          const monthlyWithTax = scenario.monthlyTotal + calculateTax(scenario.monthlyTotal);
          
          return (
            <div 
              key={index} 
              className={`scenario-card ${index === 0 ? 'best-deal' : ''}`}
            >
              {index === 0 && <div className="best-badge">BEST DEAL</div>}
              
              <h3 className="scenario-name">{scenario.name}</h3>
              
              <div className="scenario-metrics">
                <div className="metric-section">
                  <h4>Monthly Costs</h4>
                  <div className="metric-row">
                    <span className="metric-label">Service</span>
                    <span className="metric-value">
                      {formatCurrency(scenario.monthlyTotal)}
                    </span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">Tax (7%)</span>
                    <span className="metric-value">
                      {formatCurrency(calculateTax(scenario.monthlyTotal))}
                    </span>
                  </div>
                  <div className="metric-row total">
                    <span className="metric-label">Total Monthly</span>
                    <span className="metric-value">
                      {formatCurrency(monthlyWithTax)}
                    </span>
                  </div>
                </div>
                
                <div className="metric-section">
                  <h4>Due Today</h4>
                  {upfrontCosts.deviceDownPayments > 0 && (
                    <div className="metric-row">
                      <span className="metric-label">Device Down Payments</span>
                      <span className="metric-value">
                        {formatCurrency(upfrontCosts.deviceDownPayments)}
                      </span>
                    </div>
                  )}
                  {upfrontCosts.deviceTaxes > 0 && (
                    <div className="metric-row">
                      <span className="metric-label">Device Tax</span>
                      <span className="metric-value">
                        {formatCurrency(upfrontCosts.deviceTaxes)}
                      </span>
                    </div>
                  )}
                  <div className="metric-row">
                    <span className="metric-label">Activation ({customerData.lines} lines)</span>
                    <span className="metric-value">
                      {formatCurrency(upfrontCosts.activationFees)}
                    </span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">First Month Service</span>
                    <span className="metric-value">
                      {formatCurrency(upfrontCosts.firstMonthService)}
                    </span>
                  </div>
                  <div className="metric-row">
                    <span className="metric-label">First Month Tax</span>
                    <span className="metric-value">
                      {formatCurrency(upfrontCosts.firstMonthTax)}
                    </span>
                  </div>
                  <div className="metric-row total">
                    <span className="metric-label">Total Due Today</span>
                    <span className="metric-value large">
                      {formatCurrency(upfrontCosts.total)}
                    </span>
                  </div>
                </div>
                
                <div className="metric-row savings">
                  <span className="metric-label">Total Savings</span>
                  <span className="metric-value highlight">
                    {formatCurrency(scenario.totalSavings)}
                  </span>
                </div>
              </div>
              
              {scenario.details && (
                <div className="scenario-details">
                  <h4>Deal Breakdown:</h4>
                  <ul>
                    {scenario.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {scenario.requirements && (
                <div className="scenario-requirements">
                  <h4>Requirements:</h4>
                  <ul>
                    {scenario.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="tax-disclaimer">
        <p><strong>Tax Information:</strong></p>
        <ul>
          <li>Florida State Sales Tax: 6%</li>
          <li>Palm Beach County Tax: 1%</li>
          <li>Total Tax Rate: 7%</li>
          <li>Activation Fee: $10 per line</li>
          <li>Device taxes are calculated on the full retail price</li>
        </ul>
      </div>

      <style jsx>{`
        .results-section {
          padding: 2rem 0;
        }

        .results-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .results-title {
          font-size: 2rem;
          color: var(--tmobile-magenta);
          margin-bottom: 0.5rem;
        }

        .results-subtitle {
          color: var(--tmobile-gray);
          font-size: 1.1rem;
        }

        .tax-notice {
          margin-top: 1rem;
          padding: 0.75rem;
          background: rgba(226, 0, 116, 0.1);
          border-radius: 8px;
          font-size: 0.9rem;
          color: var(--tmobile-magenta);
        }

        .scenarios-grid {
          display: grid;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .scenario-card {
          background: white;
          border: 2px solid var(--tmobile-light-gray);
          border-radius: 12px;
          padding: 1.5rem;
          position: relative;
          transition: all 0.3s ease;
        }

        .scenario-card.best-deal {
          border-color: var(--tmobile-magenta);
          box-shadow: 0 4px 20px rgba(226, 0, 116, 0.15);
        }

        .best-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--tmobile-magenta);
          color: white;
          padding: 0.25rem 1rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: bold;
        }

        .scenario-name {
          color: var(--tmobile-black);
          font-size: 1.25rem;
          margin-bottom: 1rem;
          text-align: center;
        }

        .scenario-metrics {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .metric-section {
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .metric-section h4 {
          margin: 0 0 0.75rem 0;
          color: var(--tmobile-magenta);
          font-size: 1rem;
        }

        .metric-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }

        .metric-row.total {
          border-top: 2px solid var(--tmobile-magenta);
          border-bottom: none;
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          font-weight: bold;
        }

        .metric-row.savings {
          background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05));
          padding: 1rem;
          border-radius: 8px;
          border: none;
          margin-top: 1rem;
        }

        .metric-label {
          color: var(--tmobile-gray);
          font-size: 0.9rem;
        }

        .metric-value {
          font-weight: 600;
          color: var(--tmobile-black);
          font-size: 1rem;
        }

        .metric-value.large {
          font-size: 1.25rem;
          color: var(--tmobile-magenta);
        }

        .metric-value.highlight {
          color: #4caf50;
          font-size: 1.25rem;
        }

        .scenario-details,
        .scenario-requirements {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--tmobile-light-gray);
        }

        .scenario-details h4,
        .scenario-requirements h4 {
          color: var(--tmobile-black);
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .scenario-details ul,
        .scenario-requirements ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .scenario-details li,
        .scenario-requirements li {
          padding: 0.25rem 0;
          padding-left: 1.5rem;
          position: relative;
          font-size: 0.85rem;
          color: var(--tmobile-gray);
        }

        .scenario-details li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #4caf50;
        }

        .scenario-requirements li:before {
          content: "•";
          position: absolute;
          left: 0.5rem;
          color: var(--tmobile-magenta);
        }

        .tax-disclaimer {
          margin-top: 2rem;
          padding: 1rem;
          background: #f5f5f5;
          border-radius: 8px;
          font-size: 0.85rem;
          color: var(--tmobile-gray);
        }

        .tax-disclaimer ul {
          margin: 0.5rem 0 0 1.5rem;
          padding: 0;
        }

        @media (max-width: 768px) {
          .results-title {
            font-size: 1.5rem;
          }

          .scenario-card {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default ResultsDisplayEnhanced;