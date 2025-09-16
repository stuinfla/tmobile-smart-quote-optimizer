import { useState, useEffect } from 'react';
import { phoneData, tradeInValues } from '../data/phoneData';
import { plans } from '../data/plans_sept_2025';
import { insurancePricing } from '../data/insuranceData';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import EnhancedAccessorySelector from './EnhancedAccessorySelector';
import '../styles/optimized-flow.css';

function OptimizedConversationFlow({ currentStep, customerData, onAnswer, setCustomerData }) {
  // Optimized flow order - gather critical info early
  const steps = [
    'customerType',     // New vs Existing (determines path)
    'customerInfo',     // Name, phone, email (for quotes)
    'carrier',         // Current carrier (for Keep & Switch)
    'qualification',   // Military/Senior/First Responder/Standard
    'lines',          // How many lines
    'newPhones',      // Which phones
    'financing',      // 24 vs 36 months
    'currentPhones',  // Trade-ins
    'plan',          // Plan selection
    'accessoryLines', // Watches/Tablets
    'insurance',     // Insurance selection
    'summary'        // Final review
  ];
  
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('forward');
  
  // Auto-advance function
  const autoAdvance = (delay = 300) => {
    setTimeout(() => {
      const currentIndex = steps.indexOf(currentStep);
      if (currentIndex < steps.length - 1) {
        setDirection('forward');
        setIsAnimating(true);
        setTimeout(() => {
          onAnswer('continue', steps[currentIndex + 1]);
          setIsAnimating(false);
        }, 200);
      }
    }, delay);
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setDirection('back');
      setIsAnimating(true);
      setTimeout(() => {
        onAnswer('back', steps[currentIndex - 1]);
        setIsAnimating(false);
      }, 200);
    }
  };

  const swipeHandlers = useSwipeGesture(() => {}, handleBack);

  const getProgressPercentage = () => {
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const renderQuestion = () => {
    switch(currentStep) {
      case 'customerType':
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">Are you a new or existing T-Mobile customer?</h2>
            <div className="answer-options large-buttons">
              <button 
                className={`option-button ${customerData.isExisting === false ? 'selected' : ''}`}
                onClick={() => {
                  setCustomerData({...customerData, isExisting: false});
                  autoAdvance();
                }}
              >
                <div className="option-icon">🆕</div>
                <div className="option-title">New Customer</div>
                <div className="option-subtitle">Switching to T-Mobile</div>
              </button>
              <button 
                className={`option-button ${customerData.isExisting === true ? 'selected' : ''}`}
                onClick={() => {
                  setCustomerData({...customerData, isExisting: true});
                  autoAdvance(500); // Skip carrier question for existing
                }}
              >
                <div className="option-icon">✅</div>
                <div className="option-title">Existing Customer</div>
                <div className="option-subtitle">Already with T-Mobile</div>
              </button>
            </div>
          </div>
        );

      case 'customerInfo':
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">Let's get your contact info</h2>
            <p className="sub-text">We'll use this to create your personalized quote</p>
            <div className="form-group">
              <input
                type="text"
                className="input-field"
                placeholder="Your name"
                value={customerData.name || ''}
                onChange={(e) => setCustomerData({...customerData, name: e.target.value})}
                onKeyPress={(e) => e.key === 'Enter' && customerData.name && autoAdvance()}
              />
              <input
                type="tel"
                className="input-field"
                placeholder="Phone number (optional)"
                value={customerData.phone || ''}
                onChange={(e) => setCustomerData({...customerData, phone: e.target.value})}
                onKeyPress={(e) => e.key === 'Enter' && customerData.name && autoAdvance()}
              />
              <input
                type="email"
                className="input-field"
                placeholder="Email (optional)"
                value={customerData.email || ''}
                onChange={(e) => setCustomerData({...customerData, email: e.target.value})}
                onKeyPress={(e) => e.key === 'Enter' && customerData.name && autoAdvance()}
              />
              {customerData.name && (
                <button className="continue-btn auto-advance" onClick={() => autoAdvance(0)}>
                  Continue →
                </button>
              )}
            </div>
          </div>
        );

      case 'carrier':
        // Skip for existing customers
        if (customerData.isExisting) {
          useEffect(() => {
            autoAdvance(0);
          }, []);
          return null;
        }
        
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">Which carrier are you switching from?</h2>
            <p className="sub-text">We'll help pay off your current phone!</p>
            <div className="answer-options">
              {['Verizon', 'AT&T', 'Sprint', 'Other', 'No carrier'].map(carrier => (
                <button 
                  key={carrier}
                  className={`option-button ${customerData.carrier === carrier ? 'selected' : ''}`}
                  onClick={() => {
                    setCustomerData({...customerData, carrier});
                    autoAdvance();
                  }}
                >
                  <div className="option-title">{carrier}</div>
                  {(carrier === 'Verizon' || carrier === 'AT&T') && (
                    <div className="badge-eligible">💰 Up to $800/line reimbursement</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 'qualification':
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">Do any of these apply to you?</h2>
            <p className="sub-text">Special pricing available for qualified customers</p>
            <div className="answer-options">
              <button 
                className={`option-button ${customerData.qualification === 'standard' ? 'selected' : ''} most-popular`}
                onClick={() => {
                  setCustomerData({...customerData, qualification: 'standard'});
                  autoAdvance();
                }}
              >
                <div className="option-title">Standard Customer</div>
                <div className="badge-popular">Most Common</div>
              </button>
              <button 
                className={`option-button ${customerData.qualification === 'military' ? 'selected' : ''}`}
                onClick={() => {
                  setCustomerData({...customerData, qualification: 'military'});
                  autoAdvance();
                }}
              >
                <div className="option-title">🎖️ Military / Veteran</div>
                <div className="option-subtitle">Save $35-70/month</div>
              </button>
              <button 
                className={`option-button ${customerData.qualification === 'firstResponder' ? 'selected' : ''}`}
                onClick={() => {
                  setCustomerData({...customerData, qualification: 'firstResponder'});
                  autoAdvance();
                }}
              >
                <div className="option-title">🚑 First Responder</div>
                <div className="option-subtitle">Save $20-40/month</div>
              </button>
              <button 
                className={`option-button ${customerData.qualification === 'senior' ? 'selected' : ''}`}
                onClick={() => {
                  setCustomerData({...customerData, qualification: 'senior'});
                  autoAdvance();
                }}
              >
                <div className="option-title">👴 55+ Senior</div>
                <div className="option-subtitle">Save $15-30/month</div>
              </button>
            </div>
          </div>
        );

      case 'lines':
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">How many phone lines do you need?</h2>
            <div className="quick-select">
              <button className="quick-btn" onClick={() => {
                const newData = {...customerData, lines: 1, devices: [{ currentPhone: '', newPhone: '', storage: '', insurance: false }]};
                setCustomerData(newData);
                autoAdvance();
              }}>
                <div className="quick-title">Single</div>
                <div className="quick-price">$105/mo</div>
              </button>
              <button className="quick-btn popular" onClick={() => {
                const newData = {...customerData, lines: 2, devices: Array(2).fill().map(() => ({ currentPhone: '', newPhone: '', storage: '', insurance: false }))};
                setCustomerData(newData);
                autoAdvance();
              }}>
                <div className="quick-title">Couple</div>
                <div className="quick-price">$180/mo</div>
                <div className="badge-popular">Popular</div>
              </button>
              <button className="quick-btn best-value" onClick={() => {
                const newData = {...customerData, lines: 4, devices: Array(4).fill().map(() => ({ currentPhone: '', newPhone: '', storage: '', insurance: false }))};
                setCustomerData(newData);
                autoAdvance();
              }}>
                <div className="quick-title">Family</div>
                <div className="quick-price">$280/mo</div>
                <div className="badge-value">Best Value</div>
              </button>
            </div>
            <div className="more-options">
              <button 
                className="text-link"
                onClick={() => {
                  // Show extended options
                }}
              >
                Need 5+ lines? Click here
              </button>
            </div>
          </div>
        );

      case 'newPhones':
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">Which new phones would you like?</h2>
            <div className="popular-picks">
              <button className="pick-btn featured" onClick={() => {
                const newDevices = customerData.devices.map(() => ({
                  ...customerData.devices[0],
                  newPhone: 'iPhone_17',
                  storage: '256GB'
                }));
                setCustomerData({...customerData, devices: newDevices});
                autoAdvance(500);
              }}>
                <span className="pick-icon">🍎</span>
                All iPhone 17
                <span className="badge-hot">HOT</span>
              </button>
              <button className="pick-btn" onClick={() => {
                const newDevices = customerData.devices.map(() => ({
                  ...customerData.devices[0],
                  newPhone: 'Galaxy_S25',
                  storage: '256GB'
                }));
                setCustomerData({...customerData, devices: newDevices});
                autoAdvance(500);
              }}>
                <span className="pick-icon">🤖</span>
                All Galaxy S25
              </button>
              <button className="pick-btn" onClick={() => {
                // Keep existing phones
                setCustomerData({...customerData, keepPhones: true});
                autoAdvance(500);
              }}>
                <span className="pick-icon">📱</span>
                Keep Current Phones
              </button>
            </div>
            
            {/* Device selector for custom choices */}
            {!customerData.keepPhones && (
              <div className="device-selector compact">
                {customerData.devices.map((device, index) => (
                  <div key={index} className="device-row">
                    <label>Line {index + 1}</label>
                    <select 
                      value={device.newPhone}
                      onChange={(e) => {
                        const newDevices = [...customerData.devices];
                        newDevices[index].newPhone = e.target.value;
                        setCustomerData({...customerData, devices: newDevices});
                        // Auto-advance when all phones selected
                        if (newDevices.every(d => d.newPhone)) {
                          autoAdvance(800);
                        }
                      }}
                    >
                      <option value="">Select...</option>
                      {Object.entries(phoneData.phones).map(([brand, phones]) => (
                        <optgroup key={brand} label={brand}>
                          {Object.entries(phones).map(([key, phone]) => (
                            <option key={key} value={key}>
                              {phone.name}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'financing':
        if (customerData.keepPhones) {
          useEffect(() => {
            autoAdvance(0);
          }, []);
          return null;
        }
        
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">Choose your financing term</h2>
            <div className="answer-options large-buttons">
              <button 
                className={`option-button ${customerData.financingTerm === '24' ? 'selected' : ''}`}
                onClick={() => {
                  setCustomerData({...customerData, financingTerm: '24'});
                  autoAdvance();
                }}
              >
                <div className="option-title">24 Months</div>
                <div className="option-subtitle">Higher monthly, pay off faster</div>
                <div className="badge-popular">Most Popular</div>
              </button>
              <button 
                className={`option-button ${customerData.financingTerm === '36' ? 'selected' : ''}`}
                onClick={() => {
                  setCustomerData({...customerData, financingTerm: '36'});
                  autoAdvance();
                }}
              >
                <div className="option-title">36 Months</div>
                <div className="option-subtitle">Lower monthly payments</div>
              </button>
            </div>
          </div>
        );

      case 'currentPhones':
        if (customerData.keepPhones) {
          useEffect(() => {
            autoAdvance(0);
          }, []);
          return null;
        }
        
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">Trade in for huge savings?</h2>
            <div className="trade-options">
              <button 
                className="trade-btn yes"
                onClick={() => {
                  // Show trade-in selector
                  setCustomerData({...customerData, wantsTrade: true});
                }}
              >
                <div className="trade-icon">💰</div>
                <div>Yes, I have phones to trade</div>
                <div className="trade-value">Up to $1000 off per phone</div>
              </button>
              <button 
                className="trade-btn no"
                onClick={() => {
                  const newDevices = customerData.devices.map(d => ({
                    ...d,
                    currentPhone: 'no_trade'
                  }));
                  setCustomerData({...customerData, devices: newDevices, wantsTrade: false});
                  autoAdvance();
                }}
              >
                <div className="trade-icon">❌</div>
                <div>No trade-ins</div>
              </button>
            </div>
            
            {customerData.wantsTrade && (
              <div className="trade-selector">
                {customerData.devices.map((device, index) => (
                  <div key={index} className="trade-row">
                    <label>Line {index + 1} trade-in</label>
                    <select 
                      value={device.currentPhone}
                      onChange={(e) => {
                        const newDevices = [...customerData.devices];
                        newDevices[index].currentPhone = e.target.value;
                        setCustomerData({...customerData, devices: newDevices});
                        // Auto-advance when all selected
                        if (newDevices.every(d => d.currentPhone)) {
                          autoAdvance(800);
                        }
                      }}
                    >
                      <option value="">Select trade-in...</option>
                      <option value="no_trade">No trade for this line</option>
                      {Object.entries(tradeInValues).map(([key, value]) => (
                        <option key={key} value={key}>
                          {key.replace(/_/g, ' ')} - ${value} value
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'plan':
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">Choose your plan</h2>
            <div className="plan-options">
              <button 
                className={`plan-card ${customerData.selectedPlan === 'EXPERIENCE_BEYOND' ? 'selected' : ''} recommended`}
                onClick={() => {
                  setCustomerData({...customerData, selectedPlan: 'EXPERIENCE_BEYOND'});
                  autoAdvance();
                }}
              >
                <div className="plan-header">
                  <div className="plan-name">Experience Beyond</div>
                  <div className="badge-recommended">RECOMMENDED</div>
                </div>
                <div className="plan-price">
                  ${plans.postpaid.EXPERIENCE_BEYOND.pricing[customerData.lines] * customerData.lines}/mo
                </div>
                <ul className="plan-features">
                  <li>✓ Unlimited Premium Data</li>
                  <li>✓ Netflix & Apple TV+ Included</li>
                  <li>✓ International Coverage</li>
                  <li>✓ In-flight WiFi</li>
                </ul>
              </button>
              
              <button 
                className={`plan-card ${customerData.selectedPlan === 'EXPERIENCE_MORE' ? 'selected' : ''}`}
                onClick={() => {
                  setCustomerData({...customerData, selectedPlan: 'EXPERIENCE_MORE'});
                  autoAdvance();
                }}
              >
                <div className="plan-header">
                  <div className="plan-name">Experience More</div>
                </div>
                <div className="plan-price">
                  ${plans.postpaid.EXPERIENCE_MORE.pricing[customerData.lines] * customerData.lines}/mo
                </div>
                <ul className="plan-features">
                  <li>✓ 100GB Premium Data</li>
                  <li>✓ Netflix Included</li>
                  <li>✓ Mexico & Canada</li>
                </ul>
              </button>
              
              <button 
                className={`plan-card ${customerData.selectedPlan === 'ESSENTIALS_SAVER' ? 'selected' : ''}`}
                onClick={() => {
                  setCustomerData({...customerData, selectedPlan: 'ESSENTIALS_SAVER'});
                  autoAdvance();
                }}
              >
                <div className="plan-header">
                  <div className="plan-name">Essentials Saver</div>
                </div>
                <div className="plan-price">
                  ${plans.postpaid.ESSENTIALS_SAVER.pricing[customerData.lines] * customerData.lines}/mo
                </div>
                <ul className="plan-features">
                  <li>✓ 50GB Premium Data</li>
                  <li>✓ Basic Coverage</li>
                </ul>
              </button>
            </div>
          </div>
        );

      case 'accessoryLines':
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <EnhancedAccessorySelector 
              customerData={customerData}
              setCustomerData={setCustomerData}
              hasPromoPlan={customerData.selectedPlan === 'EXPERIENCE_BEYOND'}
            />
            <button 
              className="continue-btn"
              onClick={() => autoAdvance(0)}
            >
              Continue →
            </button>
          </div>
        );

      case 'insurance':
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">Protect your investment?</h2>
            <p className="sub-text">Coverage for damage, loss, and theft</p>
            <div className="insurance-options">
              <button 
                className="insurance-btn all"
                onClick={() => {
                  const newDevices = customerData.devices.map(d => ({
                    ...d,
                    insurance: true
                  }));
                  setCustomerData({...customerData, devices: newDevices});
                  autoAdvance();
                }}
              >
                <div className="insurance-icon">🛡️</div>
                <div className="insurance-title">Protect All Lines</div>
                <div className="insurance-price">$18-22/line/month</div>
                <div className="badge-smart">Smart Choice</div>
              </button>
              
              <button 
                className="insurance-btn some"
                onClick={() => {
                  // Show individual selection
                  setCustomerData({...customerData, selectiveInsurance: true});
                }}
              >
                <div className="insurance-icon">📱</div>
                <div className="insurance-title">Select Specific Lines</div>
              </button>
              
              <button 
                className="insurance-btn none"
                onClick={() => {
                  const newDevices = customerData.devices.map(d => ({
                    ...d,
                    insurance: false
                  }));
                  setCustomerData({...customerData, devices: newDevices});
                  autoAdvance();
                }}
              >
                <div className="insurance-icon">❌</div>
                <div className="insurance-title">Skip Insurance</div>
                <div className="insurance-subtitle">I'll take the risk</div>
              </button>
            </div>
            
            {customerData.selectiveInsurance && (
              <div className="insurance-selector">
                {customerData.devices.map((device, index) => (
                  <div key={index} className="insurance-row">
                    <label>
                      <input
                        type="checkbox"
                        checked={device.insurance}
                        onChange={(e) => {
                          const newDevices = [...customerData.devices];
                          newDevices[index].insurance = e.target.checked;
                          setCustomerData({...customerData, devices: newDevices});
                        }}
                      />
                      Line {index + 1} - {device.newPhone ? insurancePricing.getInsurancePrice(device.newPhone)?.monthly || '$18' : '$18'}/mo
                    </label>
                  </div>
                ))}
                <button 
                  className="continue-btn"
                  onClick={() => autoAdvance(0)}
                >
                  Continue →
                </button>
              </div>
            )}
          </div>
        );

      case 'summary':
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">Review your selections</h2>
            <div className="summary-content">
              <div className="summary-section">
                <h3>Customer Info</h3>
                <p>{customerData.name || 'No name provided'}</p>
                {customerData.phone && <p>{customerData.phone}</p>}
                {customerData.email && <p>{customerData.email}</p>}
              </div>
              
              <div className="summary-section">
                <h3>Plan Details</h3>
                <p>{customerData.lines} line{customerData.lines > 1 ? 's' : ''}</p>
                <p>{plans.postpaid[customerData.selectedPlan]?.name}</p>
                {customerData.qualification !== 'standard' && (
                  <p className="qualification">{customerData.qualification} pricing</p>
                )}
              </div>
              
              <button 
                className="btn-primary"
                onClick={() => onAnswer('complete', null)}
              >
                Get My Quote →
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="optimized-conversation-flow" {...swipeHandlers}>
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
        <div className="step-indicator">
          Step {steps.indexOf(currentStep) + 1} of {steps.length}
        </div>
      </div>

      {/* Question Content */}
      <div className="question-container">
        {renderQuestion()}
      </div>

      {/* Back Button (minimal, only when needed) */}
      {steps.indexOf(currentStep) > 0 && (
        <button className="back-btn-minimal" onClick={handleBack}>
          ← Back
        </button>
      )}
    </div>
  );
}

export default OptimizedConversationFlow;