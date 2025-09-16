import { useState, useRef } from 'react';
import '../styles/professional-proposal.css';

function ProfessionalProposal({ results, customerData, repInfo, storeInfo, onClose }) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const proposalRef = useRef(null);
  
  const scenario = results?.[0] || {};
  const today = new Date();
  const validUntil = new Date(today.getTime() + (72 * 60 * 60 * 1000)); // 72 hours from now
  
  const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };
  
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };
  
  const handleShare = async (method) => {
    if (!customerName) {
      alert('Please enter customer name');
      return;
    }
    
    if (method === 'email' && !customerEmail) {
      alert('Please enter customer email');
      return;
    }
    
    if (method === 'sms' && !customerPhone) {
      alert('Please enter customer phone number');
      return;
    }
    
    setIsSending(true);
    
    // Create proposal data
    const proposalData = {
      customerName,
      customerPhone,
      customerEmail,
      repName: repInfo?.name || 'T-Mobile Representative',
      repPhone: repInfo?.phone || '1-800-T-MOBILE',
      repEmail: repInfo?.email || 'sales@t-mobile.com',
      storeName: storeInfo?.name || 'T-Mobile Store',
      storeAddress: storeInfo?.address || '',
      validUntil: formatDate(validUntil),
      scenario: scenario,
      lineCount: customerData.lines,
      devices: customerData.devices,
      monthlyTotal: scenario.monthlyTotal,
      upfrontTotal: scenario.upfrontTotal || 0,
      savings: scenario.totalSavings || 0
    };
    
    // In production, this would send to a backend service
    // For now, we'll create a shareable text version
    const proposalText = generateProposalText(proposalData);
    
    if (method === 'email') {
      // Create mailto link
      const subject = encodeURIComponent('Your T-Mobile Quote - Valid 72 Hours');
      const body = encodeURIComponent(proposalText);
      window.location.href = `mailto:${customerEmail}?subject=${subject}&body=${body}`;
    } else if (method === 'sms') {
      // Create SMS link (works on mobile)
      const smsBody = encodeURIComponent(`Your T-Mobile quote is ready! Monthly: ${formatCurrency(scenario.monthlyTotal)}. Valid for 72 hours. Check your email for full details or contact ${repInfo?.name} at ${repInfo?.phone}`);
      window.location.href = `sms:${customerPhone}?body=${smsBody}`;
    } else if (method === 'print') {
      window.print();
    } else if (method === 'copy') {
      navigator.clipboard.writeText(proposalText);
      alert('Proposal copied to clipboard!');
    }
    
    setTimeout(() => {
      setIsSending(false);
      setShowShareOptions(false);
    }, 1000);
  };
  
  const generateProposalText = (data) => {
    return `
T-MOBILE WIRELESS SERVICE PROPOSAL
=====================================

PREPARED FOR: ${data.customerName}
DATE: ${formatDate(new Date())}
VALID UNTIL: ${data.validUntil}

YOUR T-MOBILE REPRESENTATIVE
${data.repName}
${data.storeName}
Phone: ${data.repPhone}
Email: ${data.repEmail}

QUOTE SUMMARY
=====================================
Plan: ${data.scenario.planName || 'Experience Beyond'}
Lines: ${data.lineCount}

MONTHLY COSTS
Service: ${formatCurrency(data.monthlyTotal)}
${data.scenario.monthlyInsurance > 0 ? `Insurance: ${formatCurrency(data.scenario.monthlyInsurance)}` : ''}

DUE TODAY
Total: ${formatCurrency(data.upfrontTotal)}

TOTAL SAVINGS
${formatCurrency(data.savings)} over 24 months

IMPORTANT NOTES
=====================================
• This quote is valid for 72 hours or while promotions last
• AutoPay enrollment required for advertised pricing
• Credits applied over 24 months
• Subject to credit approval
• Taxes and fees included in pricing shown

Contact your representative to complete this offer!
    `;
  };
  
  return (
    <div className="professional-proposal">
      <div className="proposal-container" ref={proposalRef}>
        {/* Header with T-Mobile Branding */}
        <div className="proposal-header">
          <div className="tmobile-logo">
            <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
              <rect width="40" height="40" fill="#E20074"/>
              <text x="8" y="28" fill="white" fontSize="24" fontWeight="bold">T</text>
              <text x="50" y="28" fill="#E20074" fontSize="18" fontWeight="bold">Mobile</text>
            </svg>
          </div>
          <div className="proposal-title">
            <h1>Wireless Service Proposal</h1>
            <p className="validity-notice">Valid for 72 hours or while promotions last</p>
          </div>
        </div>
        
        {/* Customer Information Section */}
        <div className="customer-section">
          <h2>Customer Information</h2>
          <div className="info-grid">
            <div className="info-field">
              <label>Customer Name *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="customer-input"
              />
            </div>
            <div className="info-field">
              <label>Phone Number</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="(555) 555-5555"
                className="customer-input"
              />
            </div>
            <div className="info-field">
              <label>Email Address</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@email.com"
                className="customer-input"
              />
            </div>
          </div>
        </div>
        
        {/* Quote Details */}
        <div className="quote-details">
          <h2>Your Personalized Quote</h2>
          
          <div className="quote-summary">
            <div className="summary-card">
              <h3>{scenario.name || 'Best Deal'}</h3>
              <p className="plan-name">{scenario.planName || 'Experience Beyond'}</p>
              <p className="line-count">{customerData.lines} line{customerData.lines > 1 ? 's' : ''}</p>
            </div>
            
            <div className="pricing-grid">
              <div className="pricing-section">
                <h4>Monthly Investment</h4>
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Service</span>
                    <span>{formatCurrency(scenario.monthlyService || scenario.monthlyTotal)}</span>
                  </div>
                  {scenario.monthlyDeviceFinancing > 0 && (
                    <div className="price-row">
                      <span>Device Financing</span>
                      <span>{formatCurrency(scenario.monthlyDeviceFinancing)}</span>
                    </div>
                  )}
                  {scenario.monthlyInsurance > 0 && (
                    <div className="price-row">
                      <span>Protection 360</span>
                      <span>{formatCurrency(scenario.monthlyInsurance)}</span>
                    </div>
                  )}
                  <div className="price-row total">
                    <span>Total Monthly</span>
                    <span className="total-price">{formatCurrency(scenario.monthlyTotal)}</span>
                  </div>
                </div>
              </div>
              
              <div className="pricing-section">
                <h4>Due Today</h4>
                <div className="price-breakdown">
                  <div className="price-row">
                    <span>Activation</span>
                    <span>{formatCurrency(scenario.activationFees || customerData.lines * 10)}</span>
                  </div>
                  {scenario.deviceTaxes > 0 && (
                    <div className="price-row">
                      <span>Device Taxes</span>
                      <span>{formatCurrency(scenario.deviceTaxes)}</span>
                    </div>
                  )}
                  <div className="price-row">
                    <span>First Month</span>
                    <span>{formatCurrency(scenario.monthlyTotal)}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total Due</span>
                    <span className="total-price">
                      {formatCurrency(scenario.upfrontTotal || 
                        (scenario.activationFees || customerData.lines * 10) + 
                        (scenario.deviceTaxes || 0) + 
                        scenario.monthlyTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {scenario.totalSavings > 0 && (
              <div className="savings-highlight">
                <span className="savings-label">Your Total Savings</span>
                <span className="savings-amount">{formatCurrency(scenario.totalSavings)}</span>
                <span className="savings-period">over 24 months</span>
              </div>
            )}
          </div>
          
          {/* Included Features */}
          <div className="features-section">
            <h3>What's Included</h3>
            <div className="features-grid">
              <div className="feature">✓ Unlimited 5G Data</div>
              <div className="feature">✓ Netflix On Us (2+ lines)</div>
              <div className="feature">✓ Apple TV+ Included</div>
              <div className="feature">✓ Free International Texting</div>
              <div className="feature">✓ In-Flight WiFi</div>
              <div className="feature">✓ Scam Shield Protection</div>
            </div>
          </div>
          
          {/* Promotions Applied */}
          {scenario.promotionsApplied && scenario.promotionsApplied.length > 0 && (
            <div className="promotions-section">
              <h3>Promotions Applied</h3>
              <ul className="promotions-list">
                {scenario.promotionsApplied.map((promo, idx) => (
                  <li key={idx}>{promo}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Representative Information */}
        <div className="rep-section">
          <h3>Your T-Mobile Expert</h3>
          <div className="rep-card">
            <div className="rep-info">
              <p className="rep-name">{repInfo?.name || 'T-Mobile Representative'}</p>
              <p className="store-name">{storeInfo?.name || 'T-Mobile Store'}</p>
              {storeInfo?.address && <p className="store-address">{storeInfo.address}</p>}
            </div>
            <div className="rep-contact">
              <p>📱 {repInfo?.phone || '1-800-T-MOBILE'}</p>
              <p>✉️ {repInfo?.email || 'sales@t-mobile.com'}</p>
            </div>
          </div>
        </div>
        
        {/* Terms and Conditions */}
        <div className="terms-section">
          <h4>Important Information</h4>
          <ul>
            <li>This quote is valid for 72 hours from {formatDate(today)} or while promotional offers last, whichever comes first</li>
            <li>Pricing includes taxes and fees for your area</li>
            <li>AutoPay enrollment required for advertised pricing ($10/line discount)</li>
            <li>Device credits applied monthly over 24 months</li>
            <li>Subject to credit approval and service activation</li>
            <li>See store for complete terms and conditions</li>
          </ul>
        </div>
        
        {/* Footer */}
        <div className="proposal-footer">
          <p className="quote-number">Quote #: {Date.now().toString().slice(-8)}</p>
          <p className="generated-date">Generated: {formatDate(today)}</p>
          <p className="expires-date">Expires: {formatDate(validUntil)}</p>
        </div>
        
        {/* Copyright Notice */}
        <div className="copyright-notice">
          <p className="copyright-text">© 2025 Created by ISOVision.ai for the benefit of T-Mobile Corporate only.</p>
          <p className="contact-info">For licensing inquiries, please contact: Stuart Kerr | sikerr@gmail.com | (312) 953-9668 | ISOVision.ai</p>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="proposal-actions">
        {!showShareOptions ? (
          <>
            <button 
              className="btn btn-primary"
              onClick={() => setShowShareOptions(true)}
              disabled={!customerName}
            >
              Share Proposal
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => handleShare('print')}
            >
              Print
            </button>
            <button 
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </>
        ) : (
          <div className="share-options">
            <h3>How would you like to share?</h3>
            <div className="share-buttons">
              <button 
                className="share-btn email"
                onClick={() => handleShare('email')}
                disabled={isSending || !customerEmail}
              >
                📧 Email
              </button>
              <button 
                className="share-btn sms"
                onClick={() => handleShare('sms')}
                disabled={isSending || !customerPhone}
              >
                💬 Text Message
              </button>
              <button 
                className="share-btn copy"
                onClick={() => handleShare('copy')}
                disabled={isSending}
              >
                📋 Copy to Clipboard
              </button>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowShareOptions(false)}
            >
              Back
            </button>
          </div>
        )}
        
        {!customerName && !showShareOptions && (
          <p className="warning-text">* Please enter customer name to enable sharing</p>
        )}
      </div>
    </div>
  );
}

export default ProfessionalProposal;