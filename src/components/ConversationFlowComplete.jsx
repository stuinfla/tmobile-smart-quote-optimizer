import { useState, useEffect } from 'react';
import { phoneData, tradeInValues } from '../data/phoneData';
import { plans } from '../data/plans_sept_2025';
import { insurancePricing, accessoryLinePricing } from '../data/insuranceData';
import { useSwipeGesture } from '../hooks/useSwipeGesture';

function ConversationFlowComplete({ currentStep, customerData, onAnswer, setCustomerData }) {
  const steps = ['lines', 'newPhones', 'insurance', 'currentPhones', 'plan', 'accessoryLines', 'accessoryDevices', 'summary'];
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('forward');
  
  const getProgressPercentage = () => {
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
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
      if (navigator.vibrate) navigator.vibrate(10);
    }
  };

  const handleContinue = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1 && canContinue()) {
      setDirection('forward');
      setIsAnimating(true);
      setTimeout(() => {
        onAnswer('continue', steps[currentIndex + 1]);
        setIsAnimating(false);
      }, 200);
      if (navigator.vibrate) navigator.vibrate(10);
    }
  };

  const swipeHandlers = useSwipeGesture(handleContinue, handleBack);

  const canContinue = () => {
    switch(currentStep) {
      case 'newPhones':
        return customerData.devices.every(d => d.newPhone && d.storage);
      case 'currentPhones':
        return customerData.devices.every(d => d.currentPhone !== undefined);
      case 'accessoryDevices':
        return !customerData.accessoryLines || 
               (customerData.accessoryLines.watch ? customerData.watchDevice !== undefined : true) &&
               (customerData.accessoryLines.tablet ? customerData.tabletDevice !== undefined : true);
      default:
        return true;
    }
  };

  const renderQuestion = () => {
    switch(currentStep) {
      case 'lines':
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">How many phone lines do you need?</h2>
            <div className="quick-select">
              <button className="quick-btn" onClick={() => {
                const newData = {...customerData, lines: 1, devices: [{ currentPhone: '', newPhone: '', storage: '', insurance: false }]};
                setCustomerData(newData);
                setTimeout(() => onAnswer('continue', 'newPhones'), 400);
              }}>Single</button>
              <button className="quick-btn popular" onClick={() => {
                const newData = {...customerData, lines: 2, devices: Array(2).fill().map(() => ({ currentPhone: '', newPhone: '', storage: '', insurance: false }))};
                setCustomerData(newData);
                setTimeout(() => onAnswer('continue', 'newPhones'), 400);
              }}>Couple</button>
              <button className="quick-btn best-value" onClick={() => {
                const newData = {...customerData, lines: 4, devices: Array(4).fill().map(() => ({ currentPhone: '', newPhone: '', storage: '', insurance: false }))};
                setCustomerData(newData);
                setTimeout(() => onAnswer('continue', 'newPhones'), 400);
              }}>Family</button>
            </div>
            <div className="answer-options">
              {[1, 2, 3, 4, 5].map(num => (
                <button 
                  key={num}
                  className={`option-button ${customerData.lines === num ? 'selected' : ''}`}
                  onClick={() => {
                    const newData = {
                      ...customerData, 
                      lines: num,
                      devices: Array(num).fill().map((_, i) => 
                        customerData.devices[i] || { currentPhone: '', newPhone: '', storage: '', insurance: false }
                      )
                    };
                    setCustomerData(newData);
                    setTimeout(() => onAnswer('continue', 'newPhones'), 400);
                  }}
                >
                  <div style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{num} {num === 1 ? 'Line' : 'Lines'}</div>
                  {num >= 3 && <span className="badge-free">3rd FREE!</span>}
                  <div className="price-preview">
                    ${plans.postpaid.EXPERIENCE_BEYOND.pricing[num]}/mo
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'newPhones':
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">Which new phones would you like?</h2>
            <div className="popular-picks">
              <span className="label">Popular picks:</span>
              <button className="pick-btn" onClick={() => {
                const newDevices = customerData.devices.map(() => ({
                  currentPhone: '',
                  newPhone: 'iPhone_17',
                  storage: '256GB',
                  insurance: false
                }));
                setCustomerData({...customerData, devices: newDevices});
              }}>All iPhone 17</button>
              <button className="pick-btn" onClick={() => {
                const newDevices = customerData.devices.map(() => ({
                  currentPhone: '',
                  newPhone: 'Galaxy_S25',
                  storage: '256GB',
                  insurance: false
                }));
                setCustomerData({...customerData, devices: newDevices});
              }}>All Galaxy S25</button>
            </div>
            <div className="device-selector">
              {customerData.devices.map((device, index) => (
                <div key={index} className="device-card animated">
                  <div className="input-group">
                    <label className="input-label">Line {index + 1}</label>
                    <select 
                      className="input-field"
                      value={device.newPhone}
                      onChange={(e) => {
                        const newDevices = [...customerData.devices];
                        newDevices[index].newPhone = e.target.value;
                        newDevices[index].storage = '';
                        setCustomerData({...customerData, devices: newDevices});
                      }}
                    >
                      <option value="">Select phone...</option>
                      {Object.entries(phoneData.phones).map(([brand, phones]) => (
                        <optgroup key={brand} label={brand.charAt(0).toUpperCase() + brand.slice(1)}>
                          {Object.entries(phones).map(([key, phone]) => (
                            <option key={key} value={key}>
                              {phone.name} - from ${Object.values(phone.variants)[0]}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  {device.newPhone && phoneData.phones[Object.keys(phoneData.phones).find(b => phoneData.phones[b][device.newPhone])]?.[device.newPhone] && (
                    <div className="input-group storage-selector">
                      {Object.entries(phoneData.phones[Object.keys(phoneData.phones).find(b => phoneData.phones[b][device.newPhone])][device.newPhone].variants).map(([storage, price]) => (
                        <button
                          key={storage}
                          className={`storage-btn ${device.storage === storage ? 'selected' : ''}`}
                          onClick={() => {
                            const newDevices = [...customerData.devices];
                            newDevices[index].storage = storage;
                            setCustomerData({...customerData, devices: newDevices});
                          }}
                        >
                          <span className="storage-size">{storage}</span>
                          <span className="storage-price">${price}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'insurance':
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">Protect your devices with Protection 360?</h2>
            <p className="sub-text">Covers damage, loss, theft + McAfee Security</p>
            
            <div className="insurance-selector">
              {customerData.devices.map((device, index) => {
                const insuranceInfo = device.newPhone ? 
                  insurancePricing.getInsurancePrice(device.newPhone) : 
                  insurancePricing.tiers.tier3;
                
                return (
                  <div key={index} className="insurance-card">
                    <div className="device-info">
                      <h4>Line {index + 1}</h4>
                      <span className="device-name">
                        {device.newPhone ? phoneData.phones[Object.keys(phoneData.phones).find(b => phoneData.phones[b][device.newPhone])]?.[device.newPhone]?.name : 'Device'}
                      </span>
                    </div>
                    
                    <div className="insurance-toggle">
                      <label className="toggle-container">
                        <input
                          type="checkbox"
                          checked={device.insurance}
                          onChange={(e) => {
                            const newDevices = [...customerData.devices];
                            newDevices[index].insurance = e.target.checked;
                            setCustomerData({...customerData, devices: newDevices});
                          }}
                        />
                        <span className="toggle-slider"></span>
                      </label>
                      <div className="insurance-price">
                        <span className="price">${insuranceInfo.monthly}/mo</span>
                        <span className="deductible">$0 screen repair</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="insurance-benefits">
              <h4>What's included:</h4>
              <ul>
                <li>✓ Same-day replacement</li>
                <li>✓ Unlimited claims</li>
                <li>✓ AppleCare Services (iPhone)</li>
                <li>✓ McAfee Security Suite</li>
              </ul>
            </div>
          </div>
        );

      case 'currentPhones':
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">Trade-in or Keep & Switch?</h2>
            <p className="help-text">
              We'll calculate both options and show you which saves more!
            </p>
            <div className="trade-toggle">
              <button 
                className="toggle-btn"
                onClick={() => {
                  const newDevices = customerData.devices.map(d => ({...d, currentPhone: 'no_trade'}));
                  setCustomerData({...customerData, devices: newDevices});
                }}
              >
                Keep All Phones
                <span className="sub-text">Get up to $800/line credit</span>
              </button>
              <button 
                className="toggle-btn"
                onClick={() => {
                  const newDevices = customerData.devices.map(d => ({...d, currentPhone: 'iPhone_15'}));
                  setCustomerData({...customerData, devices: newDevices});
                }}
              >
                Trade All In
                <span className="sub-text">Get instant discounts</span>
              </button>
            </div>
            <div className="device-selector">
              {customerData.devices.map((device, index) => (
                <div key={index} className="device-card compact">
                  <label className="input-label">Line {index + 1}</label>
                  <select 
                    className="input-field"
                    value={device.currentPhone}
                    onChange={(e) => {
                      const newDevices = [...customerData.devices];
                      newDevices[index].currentPhone = e.target.value;
                      setCustomerData({...customerData, devices: newDevices});
                    }}
                  >
                    <option value="">Select...</option>
                    <option value="no_trade">Keep phone (Keep & Switch)</option>
                    {Object.keys(tradeInValues)
                      .filter(k => k.includes('iPhone') || k.includes('Galaxy'))
                      .slice(0, 10)
                      .map(phone => (
                        <option key={phone} value={phone}>
                          {phone.replace(/_/g, ' ')} - ${tradeInValues[phone]}
                        </option>
                      ))}
                    <option value="other">Other/Damaged</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        );

      case 'plan':
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">Choose your plan</h2>
            <div className="plan-comparison">
              {Object.entries(plans.postpaid).slice(0, 3).map(([key, plan]) => (
                <button 
                  key={key}
                  className={`plan-card ${customerData.selectedPlan === key ? 'selected' : ''} ${key === 'EXPERIENCE_BEYOND' ? 'popular' : ''}`}
                  onClick={() => {
                    setCustomerData({...customerData, selectedPlan: key});
                    setTimeout(() => onAnswer('continue', 'accessoryLines'), 400);
                  }}
                >
                  {key === 'EXPERIENCE_BEYOND' && <span className="badge-popular">MOST POPULAR</span>}
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price-amount">${plan.pricing[customerData.lines] || plan.pricing[1] * customerData.lines}</span>
                    <span className="price-period">/mo</span>
                  </div>
                  <ul className="plan-features">
                    {plan.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        );

      case 'accessoryLines':
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">Add connected devices?</h2>
            <p className="sub-text">Save big on watch and tablet lines</p>
            
            <div className="accessory-options">
              <button 
                className={`accessory-line-btn ${customerData.accessoryLines?.watch ? 'selected' : ''}`}
                onClick={() => {
                  const newAccessoryLines = {
                    ...customerData.accessoryLines,
                    watch: !customerData.accessoryLines?.watch
                  };
                  setCustomerData({...customerData, accessoryLines: newAccessoryLines});
                }}
              >
                <div className="accessory-icon">⌚</div>
                <h4>Apple Watch / Galaxy Watch</h4>
                <div className="accessory-pricing">
                  <span className="promo-price">$5/mo</span>
                  <span className="regular-price strike">$12/mo</span>
                </div>
                <span className="promo-text">With Experience Beyond</span>
              </button>

              <button 
                className={`accessory-line-btn ${customerData.accessoryLines?.tablet ? 'selected' : ''}`}
                onClick={() => {
                  const newAccessoryLines = {
                    ...customerData.accessoryLines,
                    tablet: !customerData.accessoryLines?.tablet
                  };
                  setCustomerData({...customerData, accessoryLines: newAccessoryLines});
                }}
              >
                <div className="accessory-icon">📱</div>
                <h4>iPad / Tablet</h4>
                <div className="accessory-pricing">
                  <span className="promo-price">$5/mo</span>
                  <span className="regular-price strike">$20/mo</span>
                </div>
                <span className="promo-text">30GB high-speed data</span>
              </button>

              <button 
                className={`accessory-line-btn ${customerData.accessoryLines?.homeInternet ? 'selected' : ''}`}
                onClick={() => {
                  const newAccessoryLines = {
                    ...customerData.accessoryLines,
                    homeInternet: !customerData.accessoryLines?.homeInternet
                  };
                  setCustomerData({...customerData, accessoryLines: newAccessoryLines});
                }}
              >
                <div className="accessory-icon">🏠</div>
                <h4>Home Internet</h4>
                <div className="accessory-pricing">
                  {customerData.lines >= 2 ? (
                    <>
                      <span className="promo-price">FREE</span>
                      <span className="regular-price strike">$60/mo</span>
                    </>
                  ) : (
                    <span className="regular-price">$60/mo</span>
                  )}
                </div>
                <span className="promo-text">5G unlimited home broadband</span>
              </button>
            </div>
            
            <button 
              className="skip-btn"
              onClick={() => {
                setCustomerData({...customerData, accessoryLines: null});
                setTimeout(() => onAnswer('continue', 'summary'), 400);
              }}
            >
              Skip connected devices →
            </button>
          </div>
        );

      case 'accessoryDevices':
        if (!customerData.accessoryLines || (!customerData.accessoryLines.watch && !customerData.accessoryLines.tablet)) {
          setTimeout(() => onAnswer('continue', 'summary'), 100);
          return null;
        }
        
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">Are you buying new or bringing your own?</h2>
            
            <div className="device-choice-container">
              {customerData.accessoryLines?.watch && (
                <div className="device-choice-card">
                  <h4>⌚ Watch Line</h4>
                  <div className="choice-buttons">
                    <button 
                      className={`choice-btn ${customerData.watchDevice === 'new' ? 'selected' : ''}`}
                      onClick={() => setCustomerData({...customerData, watchDevice: 'new'})}
                    >
                      Buy New Watch
                      <span className="sub-text">Starting at $15/mo</span>
                    </button>
                    <button 
                      className={`choice-btn ${customerData.watchDevice === 'byod' ? 'selected' : ''}`}
                      onClick={() => setCustomerData({...customerData, watchDevice: 'byod'})}
                    >
                      Bring My Own
                      <span className="sub-text">Just add line</span>
                    </button>
                  </div>
                </div>
              )}
              
              {customerData.accessoryLines?.tablet && (
                <div className="device-choice-card">
                  <h4>📱 Tablet Line</h4>
                  <div className="choice-buttons">
                    <button 
                      className={`choice-btn ${customerData.tabletDevice === 'new' ? 'selected' : ''}`}
                      onClick={() => setCustomerData({...customerData, tabletDevice: 'new'})}
                    >
                      Buy New iPad/Tablet
                      <span className="sub-text">Starting at $20/mo</span>
                    </button>
                    <button 
                      className={`choice-btn ${customerData.tabletDevice === 'byod' ? 'selected' : ''}`}
                      onClick={() => setCustomerData({...customerData, tabletDevice: 'byod'})}
                    >
                      Bring My Own
                      <span className="sub-text">Just add line</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'summary':
        const totalLines = customerData.lines + 
          (customerData.accessoryLines?.watch ? 1 : 0) + 
          (customerData.accessoryLines?.tablet ? 1 : 0);
        
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">Ready to see your savings?</h2>
            
            <div className="summary-card">
              <h3>Your Quote Summary</h3>
              <ul className="summary-list">
                <li>{customerData.lines} phone line{customerData.lines > 1 ? 's' : ''}</li>
                {customerData.devices.filter(d => d.insurance).length > 0 && (
                  <li>Protection 360 on {customerData.devices.filter(d => d.insurance).length} device{customerData.devices.filter(d => d.insurance).length > 1 ? 's' : ''}</li>
                )}
                {customerData.accessoryLines?.watch && (
                  <li>Apple Watch line ({customerData.watchDevice === 'new' ? 'buying new' : 'bringing own'})</li>
                )}
                {customerData.accessoryLines?.tablet && (
                  <li>Tablet line ({customerData.tabletDevice === 'new' ? 'buying new' : 'bringing own'})</li>
                )}
                {customerData.accessoryLines?.homeInternet && (
                  <li>Home Internet (5G unlimited)</li>
                )}
              </ul>
              <div className="total-lines">
                Total Lines: {totalLines}
              </div>
            </div>
            
            <button 
              className="btn btn-primary calculate-btn"
              onClick={() => onAnswer('calculate')}
            >
              Calculate My Quote →
            </button>
          </div>
        );

      // Keep existing cases for newPhones, currentPhones, plan
      default:
        return null;
    }
  };

  return (
    <div className="conversation-flow complete" {...swipeHandlers}>
      <div className="flow-header">
        <h1 className="flow-title">Smart Quote Builder</h1>
        <div className="flow-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{
                width: `${getProgressPercentage()}%`,
                transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </div>
          <span className="progress-text">
            Step {steps.indexOf(currentStep) + 1} of {steps.length}
          </span>
        </div>
      </div>

      {renderQuestion()}

      <div className="navigation-bar">
        {steps.indexOf(currentStep) > 0 && (
          <button 
            className="nav-btn back"
            onClick={handleBack}
          >
            ← Back
          </button>
        )}
        {currentStep !== 'summary' && (
          <button 
            className={`nav-btn continue ${!canContinue() ? 'disabled' : ''}`}
            onClick={handleContinue}
            disabled={!canContinue()}
          >
            Continue →
          </button>
        )}
      </div>

      <style jsx>{`
        .insurance-selector {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin: 1.5rem 0;
        }

        .insurance-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: white;
          border: 2px solid var(--tmobile-light-gray);
          border-radius: 8px;
        }

        .device-info h4 {
          margin: 0;
          color: var(--tmobile-magenta);
        }

        .device-name {
          font-size: 0.875rem;
          color: var(--tmobile-gray);
        }

        .insurance-toggle {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .toggle-container {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }

        .toggle-container input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 34px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background-color: var(--tmobile-magenta);
        }

        input:checked + .toggle-slider:before {
          transform: translateX(26px);
        }

        .insurance-price {
          text-align: right;
        }

        .insurance-price .price {
          display: block;
          font-weight: bold;
          color: var(--tmobile-magenta);
        }

        .insurance-price .deductible {
          display: block;
          font-size: 0.75rem;
          color: #4caf50;
        }

        .insurance-benefits {
          background: rgba(226, 0, 116, 0.05);
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .insurance-benefits h4 {
          margin: 0 0 0.5rem 0;
          color: var(--tmobile-magenta);
        }

        .insurance-benefits ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .insurance-benefits li {
          padding: 0.25rem 0;
          color: var(--tmobile-gray);
        }

        .accessory-options {
          display: grid;
          gap: 1rem;
          margin: 1.5rem 0;
        }

        .accessory-line-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border: 2px solid var(--tmobile-light-gray);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .accessory-line-btn.selected {
          border-color: var(--tmobile-magenta);
          background: rgba(226, 0, 116, 0.05);
        }

        .accessory-line-btn:hover {
          border-color: var(--tmobile-magenta);
        }

        .accessory-icon {
          font-size: 2rem;
        }

        .accessory-line-btn h4 {
          margin: 0;
          flex: 1;
        }

        .accessory-pricing {
          text-align: right;
        }

        .promo-price {
          font-size: 1.25rem;
          font-weight: bold;
          color: var(--tmobile-magenta);
          margin-right: 0.5rem;
        }

        .regular-price {
          color: var(--tmobile-gray);
        }

        .strike {
          text-decoration: line-through;
        }

        .promo-text {
          display: block;
          font-size: 0.75rem;
          color: var(--tmobile-gray);
          margin-top: 0.25rem;
        }

        .skip-btn {
          width: 100%;
          padding: 0.75rem;
          background: transparent;
          border: 2px solid var(--tmobile-light-gray);
          border-radius: 8px;
          color: var(--tmobile-gray);
          cursor: pointer;
          transition: all 0.2s;
        }

        .skip-btn:hover {
          border-color: var(--tmobile-magenta);
          color: var(--tmobile-magenta);
        }

        .device-choice-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin: 1.5rem 0;
        }

        .device-choice-card {
          background: white;
          border: 2px solid var(--tmobile-light-gray);
          border-radius: 8px;
          padding: 1rem;
        }

        .device-choice-card h4 {
          margin: 0 0 1rem 0;
          color: var(--tmobile-magenta);
        }

        .choice-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .choice-btn {
          padding: 1rem;
          background: white;
          border: 2px solid var(--tmobile-light-gray);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .choice-btn.selected {
          border-color: var(--tmobile-magenta);
          background: rgba(226, 0, 116, 0.05);
        }

        .choice-btn:hover {
          border-color: var(--tmobile-magenta);
        }

        .choice-btn .sub-text {
          display: block;
          font-size: 0.75rem;
          color: var(--tmobile-gray);
          margin-top: 0.25rem;
        }

        .summary-card {
          background: rgba(226, 0, 116, 0.05);
          padding: 1.5rem;
          border-radius: 8px;
          margin: 1.5rem 0;
        }

        .summary-card h3 {
          margin: 0 0 1rem 0;
          color: var(--tmobile-magenta);
        }

        .summary-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .summary-list li {
          padding: 0.5rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .summary-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: var(--tmobile-magenta);
        }

        .total-lines {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(226, 0, 116, 0.2);
          font-weight: bold;
          color: var(--tmobile-magenta);
        }

        .calculate-btn {
          width: 100%;
          padding: 1rem;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .choice-buttons {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default ConversationFlowComplete;