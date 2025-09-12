import { insurancePricing, accessoryLinePricing } from '../data/insuranceData';

function QuoteGeneratorPro({ results, customerData, repInfo, storeInfo }) {
  const FLORIDA_TAX_RATE = 0.07;
  const ACTIVATION_FEE = 10;
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getValidUntilDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3); // Valid for 72 hours
    return formatDate(date);
  };

  const calculateMonthlyTotal = () => {
    let total = results[0].monthlyTotal;
    
    // Add insurance costs
    customerData.devices.forEach(device => {
      if (device.insurance && device.newPhone) {
        const insuranceInfo = insurancePricing.getInsurancePrice(device.newPhone);
        total += insuranceInfo.monthly;
      }
    });
    
    // Add accessory line costs
    if (customerData.accessoryLines?.watch) {
      total += customerData.selectedPlan === 'Experience_Beyond' ? 
        accessoryLinePricing.watch.promotional : 
        accessoryLinePricing.watch.standard;
    }
    
    if (customerData.accessoryLines?.tablet) {
      total += customerData.selectedPlan === 'Experience_Beyond' ? 
        accessoryLinePricing.tablet.promotional : 
        accessoryLinePricing.tablet.standard;
    }
    
    if (customerData.accessoryLines?.homeInternet && customerData.lines < 2) {
      total += accessoryLinePricing.homeInternet.standard;
    }
    
    return total;
  };

  const calculateUpfrontCosts = () => {
    let deviceCosts = 0;
    let deviceTaxes = 0;
    let activationFees = customerData.lines * ACTIVATION_FEE;
    
    // Add accessory line activation fees
    if (customerData.accessoryLines?.watch) activationFees += accessoryLinePricing.watch.connectionFee;
    if (customerData.accessoryLines?.tablet) activationFees += accessoryLinePricing.tablet.connectionFee;
    
    // Calculate device costs and taxes
    if (results[0].devices) {
      results[0].devices.forEach(device => {
        if (device.downPayment) {
          deviceCosts += device.downPayment;
          deviceTaxes += (device.fullPrice || 0) * FLORIDA_TAX_RATE;
        }
      });
    }
    
    // Add accessory device costs if buying new
    if (customerData.watchDevice === 'new') {
      deviceCosts += 99; // Down payment for watch
      deviceTaxes += 399 * FLORIDA_TAX_RATE; // Tax on full watch price
    }
    
    if (customerData.tabletDevice === 'new') {
      deviceCosts += 149; // Down payment for tablet
      deviceTaxes += 599 * FLORIDA_TAX_RATE; // Tax on full tablet price
    }
    
    const monthlyTotal = calculateMonthlyTotal();
    const firstMonthService = monthlyTotal;
    const firstMonthTax = monthlyTotal * FLORIDA_TAX_RATE;
    
    return {
      deviceDownPayments: deviceCosts,
      deviceTaxes: deviceTaxes,
      activationFees: activationFees,
      firstMonthService: firstMonthService,
      firstMonthTax: firstMonthTax,
      total: deviceCosts + deviceTaxes + activationFees + firstMonthService + firstMonthTax
    };
  };

  const upfront = calculateUpfrontCosts();
  const monthlyTotal = calculateMonthlyTotal();
  const monthlyWithTax = monthlyTotal + (monthlyTotal * FLORIDA_TAX_RATE);
  const total24Months = (monthlyWithTax * 24) + upfront.total;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="quote-generator-pro">
      <div className="quote-page page-1">
        {/* Header */}
        <div className="quote-header">
          <div className="logo-section">
            <svg className="tmobile-logo" viewBox="0 0 200 60" fill="#E20074">
              <rect x="70" y="15" width="60" height="8"/>
              <rect x="96" y="15" width="8" height="30"/>
              <circle cx="140" cy="15" r="3"/>
            </svg>
            <div className="company-info">
              <h1>T-Mobile Smart Quote</h1>
              <p>Your Personalized Savings Plan</p>
            </div>
          </div>
          <div className="quote-meta">
            <div className="quote-number">Quote #{Date.now().toString().slice(-6)}</div>
            <div className="quote-date">{formatDate(new Date())}</div>
            <div className="valid-until">Valid Until: {getValidUntilDate()}</div>
          </div>
        </div>

        {/* Customer & Rep Info */}
        <div className="contact-section">
          <div className="rep-info">
            <h3>Your T-Mobile Expert</h3>
            <p className="rep-name">{repInfo?.name || 'T-Mobile Representative'}</p>
            <p>{repInfo?.email}</p>
            <p>{repInfo?.phone || storeInfo?.phone}</p>
          </div>
          <div className="store-info">
            <h3>Store Location</h3>
            <p>Store #{storeInfo?.storeId}</p>
            <p>{storeInfo?.address}</p>
            <p>{storeInfo?.city}, {storeInfo?.state} {storeInfo?.zip}</p>
          </div>
        </div>

        {/* Plan Summary */}
        <div className="plan-summary">
          <h2>Your Optimized Plan</h2>
          <div className="plan-details">
            <div className="plan-item">
              <span className="label">Phone Lines:</span>
              <span className="value">{customerData.lines}</span>
            </div>
            {customerData.accessoryLines?.watch && (
              <div className="plan-item">
                <span className="label">Watch Line:</span>
                <span className="value">1 ({customerData.watchDevice === 'new' ? 'New Device' : 'BYOD'})</span>
              </div>
            )}
            {customerData.accessoryLines?.tablet && (
              <div className="plan-item">
                <span className="label">Tablet Line:</span>
                <span className="value">1 ({customerData.tabletDevice === 'new' ? 'New Device' : 'BYOD'})</span>
              </div>
            )}
            {customerData.accessoryLines?.homeInternet && (
              <div className="plan-item">
                <span className="label">Home Internet:</span>
                <span className="value">{customerData.lines >= 2 ? 'FREE' : '$60/mo'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Monthly Cost Breakdown */}
        <div className="cost-section">
          <h2>Monthly Investment</h2>
          <table className="cost-table">
            <tbody>
              <tr>
                <td>Service Plan</td>
                <td className="amount">{formatCurrency(results[0].monthlyTotal)}</td>
              </tr>
              {customerData.devices.some(d => d.insurance) && (
                <tr>
                  <td>Protection 360 Insurance</td>
                  <td className="amount">
                    {formatCurrency(
                      customerData.devices.reduce((total, device) => {
                        if (device.insurance && device.newPhone) {
                          const info = insurancePricing.getInsurancePrice(device.newPhone);
                          return total + info.monthly;
                        }
                        return total;
                      }, 0)
                    )}
                  </td>
                </tr>
              )}
              {customerData.accessoryLines?.watch && (
                <tr>
                  <td>Watch Line</td>
                  <td className="amount">{formatCurrency(accessoryLinePricing.watch.promotional)}</td>
                </tr>
              )}
              {customerData.accessoryLines?.tablet && (
                <tr>
                  <td>Tablet Line</td>
                  <td className="amount">{formatCurrency(accessoryLinePricing.tablet.promotional)}</td>
                </tr>
              )}
              <tr className="subtotal">
                <td>Subtotal</td>
                <td className="amount">{formatCurrency(monthlyTotal)}</td>
              </tr>
              <tr>
                <td>FL Tax (7%)</td>
                <td className="amount">{formatCurrency(monthlyTotal * FLORIDA_TAX_RATE)}</td>
              </tr>
              <tr className="total">
                <td><strong>Total Monthly</strong></td>
                <td className="amount"><strong>{formatCurrency(monthlyWithTax)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Due Today */}
        <div className="cost-section">
          <h2>Due Today</h2>
          <table className="cost-table">
            <tbody>
              {upfront.deviceDownPayments > 0 && (
                <tr>
                  <td>Device Down Payments</td>
                  <td className="amount">{formatCurrency(upfront.deviceDownPayments)}</td>
                </tr>
              )}
              <tr>
                <td>Device Taxes</td>
                <td className="amount">{formatCurrency(upfront.deviceTaxes)}</td>
              </tr>
              <tr>
                <td>Activation Fees</td>
                <td className="amount">{formatCurrency(upfront.activationFees)}</td>
              </tr>
              <tr>
                <td>First Month Service</td>
                <td className="amount">{formatCurrency(upfront.firstMonthService)}</td>
              </tr>
              <tr>
                <td>First Month Tax</td>
                <td className="amount">{formatCurrency(upfront.firstMonthTax)}</td>
              </tr>
              <tr className="total">
                <td><strong>Total Due Today</strong></td>
                <td className="amount"><strong>{formatCurrency(upfront.total)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Page 2 */}
      <div className="quote-page page-2">
        {/* 24-Month Summary */}
        <div className="summary-section">
          <h2>24-Month Summary</h2>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="label">Total Monthly Payments (24 months)</span>
              <span className="value">{formatCurrency(monthlyWithTax * 24)}</span>
            </div>
            <div className="summary-item">
              <span className="label">Initial Payment</span>
              <span className="value">{formatCurrency(upfront.total)}</span>
            </div>
            <div className="summary-item total">
              <span className="label">Total 24-Month Cost</span>
              <span className="value">{formatCurrency(total24Months)}</span>
            </div>
            <div className="summary-item savings">
              <span className="label">Your Total Savings</span>
              <span className="value">{formatCurrency(results[0].totalSavings)}</span>
            </div>
          </div>
        </div>

        {/* Promotions Applied */}
        <div className="promotions-section">
          <h2>Promotions & Discounts Applied</h2>
          <ul className="promotions-list">
            {results[0].details?.map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
          </ul>
        </div>

        {/* Terms & Conditions */}
        <div className="terms-section">
          <h3>Important Information</h3>
          <ul>
            <li>This quote is valid for 72 hours from the date shown above</li>
            <li>Prices subject to change as promotional offers may expire</li>
            <li>Florida state tax (6%) and Palm Beach County tax (1%) included</li>
            <li>Device taxes calculated on full retail price per Florida law</li>
            <li>Activation fee of $10 per line plus $35 per connected device</li>
            <li>Protection 360 is optional and can be cancelled anytime</li>
            <li>24-month financing available with approved credit</li>
            <li>AutoPay discount requires bank account or debit card</li>
          </ul>
        </div>

        {/* Footer */}
        <div className="quote-footer">
          <div className="next-steps">
            <h3>Ready to Switch?</h3>
            <p>Visit us at Store #{storeInfo?.storeId} or call {storeInfo?.phone}</p>
            <p className="disclaimer">
              © 2025 T-Mobile USA. This quote is for informational purposes only. 
              Final pricing subject to credit approval and plan availability.
            </p>
          </div>
          <div className="qr-section">
            <div className="qr-placeholder">
              [QR Code]
            </div>
            <p>Scan to save quote</p>
          </div>
        </div>
      </div>

      <button className="print-btn no-print" onClick={handlePrint}>
        Print Quote
      </button>

      <style jsx>{`
        .quote-generator-pro {
          background: white;
          margin: 2rem 0;
        }

        .quote-page {
          width: 8.5in;
          min-height: 11in;
          padding: 0.5in;
          margin: 0 auto;
          background: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          page-break-after: always;
        }

        .quote-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding-bottom: 1rem;
          border-bottom: 3px solid var(--tmobile-magenta);
          margin-bottom: 1.5rem;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .tmobile-logo {
          width: 80px;
          height: 30px;
        }

        .company-info h1 {
          margin: 0;
          color: var(--tmobile-magenta);
          font-size: 1.5rem;
        }

        .company-info p {
          margin: 0;
          color: var(--tmobile-gray);
          font-size: 0.9rem;
        }

        .quote-meta {
          text-align: right;
        }

        .quote-number {
          font-weight: bold;
          color: var(--tmobile-magenta);
        }

        .quote-date, .valid-until {
          font-size: 0.9rem;
          color: var(--tmobile-gray);
        }

        .valid-until {
          color: #ff6b6b;
          font-weight: bold;
        }

        .contact-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .rep-info h3, .store-info h3 {
          margin: 0 0 0.5rem 0;
          color: var(--tmobile-magenta);
          font-size: 1rem;
        }

        .rep-info p, .store-info p {
          margin: 0.25rem 0;
          font-size: 0.9rem;
        }

        .rep-name {
          font-weight: bold;
        }

        .plan-summary {
          margin-bottom: 1.5rem;
        }

        .plan-summary h2 {
          color: var(--tmobile-magenta);
          border-bottom: 2px solid var(--tmobile-light-gray);
          padding-bottom: 0.5rem;
        }

        .plan-details {
          padding: 1rem 0;
        }

        .plan-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #eee;
        }

        .cost-section {
          margin-bottom: 1.5rem;
        }

        .cost-section h2 {
          color: var(--tmobile-magenta);
          border-bottom: 2px solid var(--tmobile-light-gray);
          padding-bottom: 0.5rem;
        }

        .cost-table {
          width: 100%;
          margin-top: 1rem;
        }

        .cost-table td {
          padding: 0.5rem 0;
          border-bottom: 1px solid #eee;
        }

        .cost-table .amount {
          text-align: right;
          font-weight: 500;
        }

        .cost-table .subtotal td {
          padding-top: 0.75rem;
          border-top: 2px solid var(--tmobile-light-gray);
        }

        .cost-table .total td {
          padding-top: 0.75rem;
          border-top: 3px solid var(--tmobile-magenta);
          border-bottom: none;
          font-size: 1.1rem;
          color: var(--tmobile-magenta);
        }

        .summary-section {
          margin-bottom: 1.5rem;
        }

        .summary-grid {
          display: grid;
          gap: 1rem;
          margin-top: 1rem;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          background: #f9f9f9;
          border-radius: 4px;
        }

        .summary-item.total {
          background: var(--tmobile-magenta);
          color: white;
        }

        .summary-item.savings {
          background: #4caf50;
          color: white;
        }

        .promotions-section {
          margin-bottom: 1.5rem;
        }

        .promotions-list {
          list-style: none;
          padding: 0;
          margin: 1rem 0;
        }

        .promotions-list li {
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .promotions-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: var(--tmobile-magenta);
        }

        .terms-section {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .terms-section h3 {
          margin: 0 0 0.5rem 0;
          color: var(--tmobile-magenta);
        }

        .terms-section ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
          font-size: 0.85rem;
        }

        .quote-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 3px solid var(--tmobile-magenta);
        }

        .next-steps h3 {
          margin: 0 0 0.5rem 0;
          color: var(--tmobile-magenta);
        }

        .next-steps p {
          margin: 0.25rem 0;
          font-size: 0.9rem;
        }

        .disclaimer {
          font-size: 0.75rem;
          color: var(--tmobile-gray);
          margin-top: 1rem;
        }

        .qr-section {
          text-align: center;
        }

        .qr-placeholder {
          width: 100px;
          height: 100px;
          border: 2px solid var(--tmobile-magenta);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }

        .qr-section p {
          margin: 0;
          font-size: 0.8rem;
        }

        .print-btn {
          display: block;
          margin: 2rem auto;
          padding: 1rem 2rem;
          background: var(--tmobile-magenta);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          cursor: pointer;
        }

        @media print {
          .quote-generator-pro {
            margin: 0;
          }

          .quote-page {
            width: 100%;
            min-height: 100vh;
            padding: 0.5in;
            margin: 0;
            box-shadow: none;
            page-break-after: always;
          }

          .page-2 {
            page-break-before: always;
          }

          .no-print {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .quote-page {
            width: 100%;
            padding: 1rem;
          }

          .contact-section {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default QuoteGeneratorPro;