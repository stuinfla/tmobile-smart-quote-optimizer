import { useState } from 'react';
import '../styles/results-enhanced.css';

function ResultsDisplayComplete({ results, customerData }) {
  const [expandedScenario, setExpandedScenario] = useState(null);
  const [showPerLineBreakdown, setShowPerLineBreakdown] = useState(false);
  
  // Florida wireless service taxes and fees for Delray Beach (33483)
  const FLORIDA_COMMUNICATIONS_TAX = 0.0688; // 6.88% FL communications services tax
  const PALM_BEACH_COUNTY_TAX = 0.01; // 1% local tax
  const FEDERAL_USF_FEE = 0.0124; // 1.24% Federal Universal Service Fund
  const REGULATORY_FEE_PER_LINE = 3.99; // T-Mobile Regulatory Programs fee per line
  const FEDERAL_LOCAL_SURCHARGE_PER_LINE = 2.50; // Average federal/local surcharges per line
  const ACTIVATION_FEE_PER_LINE = 10; // $10 per line activation fee
  
  // Total percentage-based tax rate for wireless services
  const TOTAL_TAX_RATE = FLORIDA_COMMUNICATIONS_TAX + PALM_BEACH_COUNTY_TAX + FEDERAL_USF_FEE;
  
  if (!results || results.length === 0) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Calculating best deals...</p>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatCurrencyPrecise = (amount) => {
    const num = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const calculateServiceTaxesAndFees = (monthlyServiceAmount, lineCount) => {
    const amount = parseFloat(monthlyServiceAmount) || 0;
    const lines = parseInt(lineCount) || 1;
    
    // Percentage-based taxes
    const percentageTaxes = amount * TOTAL_TAX_RATE;
    
    // Per-line fees
    const regulatoryFees = lines * REGULATORY_FEE_PER_LINE;
    const surcharges = lines * FEDERAL_LOCAL_SURCHARGE_PER_LINE;
    
    return {
      percentageTaxes,
      regulatoryFees,
      surcharges,
      total: percentageTaxes + regulatoryFees + surcharges
    };
  };

  const calculateDeviceTax = (amount) => {
    // Devices are subject to sales tax only (not communications tax)
    const DEVICE_SALES_TAX = 0.06 + 0.01; // 6% state + 1% county
    return (parseFloat(amount) || 0) * DEVICE_SALES_TAX;
  };

  const calculateUpfrontCosts = (scenario) => {
    // Calculate device down payments and taxes
    let deviceCosts = 0;
    let deviceTaxes = 0;
    
    if (scenario.devices) {
      scenario.devices.forEach(device => {
        if (device.downPayment) {
          deviceCosts += device.downPayment;
        }
        if (device.fullPrice) {
          deviceTaxes += calculateDeviceTax(device.fullPrice);
        }
      });
    }
    
    // Add device taxes from scenario if available
    if (scenario.deviceTaxes) {
      deviceTaxes = scenario.deviceTaxes;
    }
    
    // Calculate activation fees
    const lineCount = customerData.lines || 1;
    const activationFees = lineCount * ACTIVATION_FEE_PER_LINE;
    
    // First month service + taxes and fees
    const firstMonthService = parseFloat(scenario.monthlyTotal) || 0;
    const firstMonthTaxesAndFees = calculateServiceTaxesAndFees(
      parseFloat(scenario.monthlyService) || firstMonthService, 
      lineCount
    );
    
    return {
      deviceDownPayments: deviceCosts,
      deviceTaxes: deviceTaxes,
      activationFees: activationFees,
      firstMonthService: firstMonthService,
      firstMonthTaxesAndFees: firstMonthTaxesAndFees,
      total: deviceCosts + deviceTaxes + activationFees + firstMonthService + firstMonthTaxesAndFees.total
    };
  };

  const toggleExpand = (index) => {
    setExpandedScenario(expandedScenario === index ? null : index);
  };

  return (
    <div className="results-section">
      <div className="results-header">
        <h2 className="results-title">🎉 Your Optimized Deals</h2>
        <p className="results-subtitle">
          We found {results.length} ways to save. Here's your best option:
        </p>
        <div className="tax-notice">
          📍 Taxes & fees calculated for Delray Beach, FL - includes communications tax, federal fees, and T-Mobile regulatory charges
        </div>
        
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${!showPerLineBreakdown ? 'active' : ''}`}
            onClick={() => setShowPerLineBreakdown(false)}
          >
            Summary View
          </button>
          <button 
            className={`toggle-btn ${showPerLineBreakdown ? 'active' : ''}`}
            onClick={() => setShowPerLineBreakdown(true)}
          >
            Per-Line Breakdown
          </button>
        </div>
      </div>

      <div className="scenarios-grid">
        {results.map((scenario, index) => {
          const upfrontCosts = calculateUpfrontCosts(scenario);
          const monthlyService = parseFloat(scenario.monthlyService) || parseFloat(scenario.monthlyTotal) || 0;
          const lineCount = customerData.lines || 1;
          const monthlyTaxesAndFees = calculateServiceTaxesAndFees(monthlyService, lineCount);
          const monthlyTotal = parseFloat(scenario.monthlyTotal) || 0;
          const monthlyWithTaxesAndFees = monthlyTotal > 0 ? monthlyTotal : monthlyService + monthlyTaxesAndFees.total;
          const isExpanded = expandedScenario === index;
          
          return (
            <div 
              key={index} 
              className={`scenario-card ${index === 0 ? 'best-deal' : ''} ${isExpanded ? 'expanded' : ''}`}
            >
              {index === 0 && <div className="best-badge">BEST DEAL</div>}
              
              <h3 className="scenario-name">{scenario.name}</h3>
              
              {!showPerLineBreakdown ? (
                // Summary View
                <div className="scenario-metrics">
                  <div className="metric-section">
                    <h4>Monthly Costs</h4>
                    <div className="metric-row">
                      <span className="metric-label">Service ({lineCount} lines)</span>
                      <span className="metric-value">
                        {formatCurrency(monthlyService)}
                      </span>
                    </div>
                    {scenario.monthlyDeviceFinancing > 0 && (
                      <div className="metric-row">
                        <span className="metric-label">Device Financing</span>
                        <span className="metric-value">
                          {formatCurrency(scenario.monthlyDeviceFinancing)}
                        </span>
                      </div>
                    )}
                    {scenario.monthlyAccessoryPlans > 0 && (
                      <div className="metric-row">
                        <span className="metric-label">Accessory Plans</span>
                        <span className="metric-value">
                          {formatCurrency(scenario.monthlyAccessoryPlans)}
                        </span>
                      </div>
                    )}
                    {scenario.monthlyInsurance > 0 && (
                      <div className="metric-row">
                        <span className="metric-label">Insurance</span>
                        <span className="metric-value">
                          {formatCurrency(scenario.monthlyInsurance)}
                        </span>
                      </div>
                    )}
                    <div className="metric-row">
                      <span className="metric-label">Taxes & Fees</span>
                      <span className="metric-value">
                        {formatCurrency(monthlyTaxesAndFees.total)}
                      </span>
                    </div>
                    <div className="metric-row total">
                      <span className="metric-label">Total Monthly</span>
                      <span className="metric-value">
                        {formatCurrency(monthlyWithTaxesAndFees)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="metric-section">
                    <h4>Due Today</h4>
                    {upfrontCosts.deviceTaxes > 0 && (
                      <div className="metric-row">
                        <span className="metric-label">Device Tax</span>
                        <span className="metric-value">
                          {formatCurrency(upfrontCosts.deviceTaxes)}
                        </span>
                      </div>
                    )}
                    <div className="metric-row">
                      <span className="metric-label">Activation ({lineCount} lines)</span>
                      <span className="metric-value">
                        {formatCurrency(upfrontCosts.activationFees)}
                      </span>
                    </div>
                    <div className="metric-row">
                      <span className="metric-label">First Month</span>
                      <span className="metric-value">
                        {formatCurrency(monthlyWithTaxesAndFees)}
                      </span>
                    </div>
                    <div className="metric-row total">
                      <span className="metric-label">Total Due Today</span>
                      <span className="metric-value large">
                        {formatCurrency(upfrontCosts.total)}
                      </span>
                    </div>
                  </div>
                  
                  {scenario.totalSavings > 0 && (
                    <div className="metric-row savings">
                      <span className="metric-label">Total Savings</span>
                      <span className="metric-value highlight">
                        {formatCurrency(scenario.totalSavings)}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                // Per-Line Breakdown View
                <div className="per-line-breakdown">
                  <h4>Cost Breakdown by Line</h4>
                  {scenario.perLineBreakdown && scenario.perLineBreakdown.length > 0 ? (
                    <div className="line-breakdown-table">
                      <div className="table-header">
                        <div>Line</div>
                        <div>Device</div>
                        <div>Service</div>
                        <div>Financing</div>
                        <div>Insurance</div>
                        <div>Total</div>
                      </div>
                      {scenario.perLineBreakdown.map((line, idx) => (
                        <div key={idx} className="table-row">
                          <div className="line-number">{line.lineNumber}</div>
                          <div className="device-name">{line.device}</div>
                          <div>{formatCurrencyPrecise(line.monthlyService)}</div>
                          <div>{formatCurrencyPrecise(line.deviceFinancing || 0)}</div>
                          <div>{formatCurrencyPrecise(line.insurance || 0)}</div>
                          <div className="line-total">
                            {formatCurrencyPrecise(line.totalMonthly)}
                          </div>
                        </div>
                      ))}
                      <div className="table-row total-row">
                        <div colSpan="5">Total Monthly</div>
                        <div className="grand-total">
                          {formatCurrency(monthlyWithTaxesAndFees)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="simple-breakdown">
                      <p>Service per line: {formatCurrency(monthlyService / lineCount)}</p>
                      <p>Taxes & fees per line: {formatCurrency(monthlyTaxesAndFees.total / lineCount)}</p>
                      <p className="total">Total per line: {formatCurrency(monthlyWithTaxesAndFees / lineCount)}</p>
                    </div>
                  )}
                </div>
              )}
              
              <button 
                className="expand-toggle"
                onClick={() => toggleExpand(index)}
              >
                {isExpanded ? 'Show Less' : 'Show Details'}
              </button>
              
              {isExpanded && (
                <div className="expanded-details">
                  {scenario.promotionsApplied && scenario.promotionsApplied.length > 0 && (
                    <div className="promotions-applied">
                      <h4>Promotions Applied:</h4>
                      <ul>
                        {scenario.promotionsApplied.map((promo, idx) => (
                          <li key={idx} className="promotion-item">{promo}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {scenario.devices && scenario.devices.length > 0 && (
                    <div className="device-details">
                      <h4>Device Details:</h4>
                      <ul>
                        {scenario.devices.map((device, idx) => (
                          <li key={idx}>
                            {device.phone}: ${device.monthlyAfterCredit?.toFixed(2) || 0}/mo
                            {device.promotionCredit > 0 && ` (saves $${device.promotionCredit.toFixed(2)}/mo)`}
                          </li>
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
                  
                  <div className="tax-breakdown">
                    <h4>Tax & Fee Details:</h4>
                    <ul>
                      <li>Service Tax ({(TOTAL_TAX_RATE * 100).toFixed(1)}%): {formatCurrency(monthlyTaxesAndFees.percentageTaxes)}</li>
                      <li>Regulatory Fees: {formatCurrency(monthlyTaxesAndFees.regulatoryFees)}</li>
                      <li>Federal Surcharges: {formatCurrency(monthlyTaxesAndFees.surcharges)}</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="action-buttons">
        <button 
          className="btn btn-primary share-btn"
          onClick={() => {
            // Create shareable summary
            const scenario = results[0];
            const summary = `T-Mobile Quote Summary\n` +
              `Plan: ${scenario.planName}\n` +
              `Lines: ${customerData.lines}\n` +
              `Monthly Total: ${formatCurrency(scenario.monthlyTotal)}\n` +
              `Savings: ${formatCurrency(scenario.totalSavings || 0)}`;
            
            if (navigator.share) {
              navigator.share({
                title: 'T-Mobile Quote',
                text: summary
              });
            } else {
              navigator.clipboard.writeText(summary);
              alert('Quote copied to clipboard!');
            }
          }}
        >
          Share Quote
        </button>
        
        <button 
          className="btn btn-secondary print-btn"
          onClick={() => window.print()}
        >
          Print Quote
        </button>
      </div>

      <div className="tax-disclaimer">
        <p><strong>Taxes & Fees Information:</strong></p>
        <ul>
          <li>Florida Communications Services Tax: 6.88%</li>
          <li>Palm Beach County Local Tax: 1%</li>
          <li>Federal Universal Service Fund: 1.24%</li>
          <li>T-Mobile Regulatory Programs Fee: $3.99 per line</li>
          <li>Federal & Local Surcharges: ~$2.50 per line</li>
          <li>Activation Fee: $10 per line</li>
          <li>Device taxes calculated at 7% sales tax on full retail price</li>
        </ul>
      </div>
    </div>
  );
}

export default ResultsDisplayComplete;