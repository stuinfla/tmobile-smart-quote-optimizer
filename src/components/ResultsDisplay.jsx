function ResultsDisplay({ results, customerData }) {
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

  const bestDeal = results[0];

  return (
    <div className="results-section">
      <div className="results-header">
        <h2 className="results-title">🎉 Your Optimized Deals</h2>
        <p className="results-subtitle">
          We found {results.length} ways to save. Here's your best option:
        </p>
      </div>

      <div className="scenarios-grid">
        {results.map((scenario, index) => (
          <div 
            key={index} 
            className={`scenario-card ${index === 0 ? 'best-deal' : ''}`}
          >
            {index === 0 && <div className="best-badge">BEST DEAL</div>}
            
            <h3 className="scenario-name">{scenario.name}</h3>
            
            <div className="scenario-metrics">
              <div className="metric-row">
                <span className="metric-label">Monthly Cost</span>
                <span className="metric-value">
                  {formatCurrency(scenario.monthlyTotal)}
                </span>
              </div>
              
              <div className="metric-row">
                <span className="metric-label">Upfront Cost</span>
                <span className="metric-value">
                  {formatCurrency(scenario.upfrontCost)}
                </span>
              </div>
              
              {scenario.reimbursements && (
                <div className="metric-row">
                  <span className="metric-label">Bill Credits</span>
                  <span className="metric-value" style={{color: 'var(--tmobile-success)'}}>
                    +{formatCurrency(scenario.reimbursements)}
                  </span>
                </div>
              )}
              
              <div className="metric-row">
                <span className="metric-label">24-Month Total</span>
                <span className="metric-value">
                  {formatCurrency(scenario.total24Month)}
                </span>
              </div>
              
              <div className="metric-row" style={{
                marginTop: '0.5rem',
                paddingTop: '0.5rem',
                borderTop: '2px solid var(--tmobile-light-gray)'
              }}>
                <span className="metric-label" style={{fontWeight: 'bold'}}>You Save</span>
                <span className="metric-value savings">
                  {formatCurrency(scenario.totalSavings)}
                </span>
              </div>
            </div>

            {scenario.promotionsApplied && scenario.promotionsApplied.length > 0 && (
              <div className="promotions-applied">
                <div className="promotions-title">Promotions Applied</div>
                {scenario.promotionsApplied.map((promo, idx) => (
                  <div key={idx} className="promotion-item">
                    {promo}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1rem',
        background: 'var(--tmobile-light-gray)',
        borderRadius: '10px',
        textAlign: 'center'
      }}>
        <h4 style={{color: 'var(--tmobile-magenta)', marginBottom: '0.5rem'}}>
          💡 Pro Tip
        </h4>
        <p style={{fontSize: '0.9rem', color: 'var(--tmobile-gray)'}}>
          {bestDeal.type === 'keep_and_switch' 
            ? "Keep your current phones and get up to $800/line in bill credits!"
            : bestDeal.type === 'bundle_max'
            ? "Bundle services for maximum savings - Home Internet is FREE!"
            : "Trade in your devices for instant savings on new phones!"}
        </p>
      </div>
    </div>
  );
}

export default ResultsDisplay;