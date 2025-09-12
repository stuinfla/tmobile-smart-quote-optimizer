import { useState, useEffect } from 'react';
import { phoneData, tradeInValues } from '../data/phoneData';
import { plans } from '../data/plans';
import { useSwipeGesture } from '../hooks/useSwipeGesture';

function ConversationFlowEnhanced({ currentStep, customerData, onAnswer, setCustomerData }) {
  const steps = ['lines', 'newPhones', 'currentPhones', 'plan', 'accessories'];
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
      // Haptic feedback for mobile
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
      // Haptic feedback for mobile
      if (navigator.vibrate) navigator.vibrate(10);
    }
  };

  // Add swipe gestures
  const swipeHandlers = useSwipeGesture(handleContinue, handleBack);

  const canContinue = () => {
    switch(currentStep) {
      case 'newPhones':
        return customerData.devices.every(d => d.newPhone && d.storage);
      case 'currentPhones':
        return customerData.devices.every(d => d.currentPhone);
      default:
        return true;
    }
  };

  // Smart recommendations based on selections
  const getSmartRecommendation = () => {
    if (currentStep === 'plan') {
      if (customerData.lines >= 3) {
        return "💡 GO5G Plus recommended - 3rd line FREE!";
      } else if (customerData.devices.some(d => d.newPhone?.includes('Pro'))) {
        return "💡 GO5G Next recommended - Upgrade every year for Pro phones";
      }
    }
    if (currentStep === 'accessories' && customerData.selectedPlan === 'GO5G_Next') {
      return "💡 Apple Watch Ultra 2 is FREE with your plan!";
    }
    return null;
  };

  const renderQuestion = () => {
    const recommendation = getSmartRecommendation();
    
    switch(currentStep) {
      case 'lines':
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">How many lines do you need?</h2>
            <div className="quick-select">
              <button className="quick-btn" onClick={() => {
                setCustomerData({...customerData, lines: 1, devices: [{ currentPhone: '', newPhone: '', storage: '' }]});
                setTimeout(handleContinue, 300);
              }}>Single</button>
              <button className="quick-btn popular" onClick={() => {
                setCustomerData({...customerData, lines: 2, devices: Array(2).fill().map(() => ({ currentPhone: '', newPhone: '', storage: '' }))});
                setTimeout(handleContinue, 300);
              }}>Couple</button>
              <button className="quick-btn best-value" onClick={() => {
                setCustomerData({...customerData, lines: 4, devices: Array(4).fill().map(() => ({ currentPhone: '', newPhone: '', storage: '' }))});
                setTimeout(handleContinue, 300);
              }}>Family</button>
            </div>
            <div className="answer-options">
              {[1, 2, 3, 4, 5].map(num => (
                <button 
                  key={num}
                  className={`option-button ${customerData.lines === num ? 'selected' : ''}`}
                  onClick={() => {
                    setCustomerData({
                      ...customerData, 
                      lines: num,
                      devices: Array(num).fill().map((_, i) => 
                        customerData.devices[i] || { currentPhone: '', newPhone: '', storage: '' }
                      )
                    });
                    setTimeout(handleContinue, 300);
                  }}
                >
                  <div style={{fontSize: '1.25rem', fontWeight: 'bold'}}>{num} {num === 1 ? 'Line' : 'Lines'}</div>
                  {num >= 3 && <span className="badge-free">3rd FREE!</span>}
                  <div className="price-preview">
                    ${plans.postpaid.GO5G_Next.pricing[num]}/mo
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
                  storage: '256GB'
                }));
                setCustomerData({...customerData, devices: newDevices});
              }}>All iPhone 17</button>
              <button className="pick-btn" onClick={() => {
                const newDevices = customerData.devices.map(() => ({
                  currentPhone: '',
                  newPhone: 'Galaxy_S25',
                  storage: '256GB'
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
            {recommendation && (
              <div className="recommendation-banner">
                {recommendation}
              </div>
            )}
            <div className="plan-comparison">
              {Object.entries(plans.postpaid).slice(0, 3).map(([key, plan]) => (
                <button 
                  key={key}
                  className={`plan-card ${customerData.selectedPlan === key ? 'selected' : ''} ${key === 'GO5G_Plus' ? 'popular' : ''}`}
                  onClick={() => {
                    setCustomerData({...customerData, selectedPlan: key});
                    setTimeout(handleContinue, 300);
                  }}
                >
                  {key === 'GO5G_Plus' && <span className="badge-popular">MOST POPULAR</span>}
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price-amount">${plan.pricing[customerData.lines] || plan.pricing[1] * customerData.lines}</span>
                    <span className="price-period">/mo</span>
                  </div>
                  <ul className="plan-features">
                    <li>{plan.features.hotspot}</li>
                    <li>{plan.features.streaming[0] || 'Basic'}</li>
                    {key === 'GO5G_Next' && <li>📱 Upgrade yearly</li>}
                    {key === 'GO5G_Plus' && customerData.lines >= 3 && <li>🎉 3rd line FREE</li>}
                  </ul>
                </button>
              ))}
            </div>
          </div>
        );

      case 'accessories':
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">Complete your setup</h2>
            {recommendation && (
              <div className="recommendation-banner pulse">
                {recommendation}
              </div>
            )}
            <div className="accessory-grid">
              <button 
                className={`accessory-card ${customerData.accessories.watch ? 'selected' : ''}`}
                onClick={() => {
                  const newAccessories = {...customerData.accessories, watch: !customerData.accessories.watch};
                  setCustomerData({...customerData, accessories: newAccessories});
                }}
              >
                <div className="accessory-icon">⌚</div>
                <h4>Apple Watch</h4>
                <div className="accessory-deal">
                  {customerData.selectedPlan === 'GO5G_Next' ? 
                    <><span className="strike">$799</span> <span className="free">FREE</span></> : 
                    <><span className="strike">$299</span> <span className="deal">$99</span></>
                  }
                </div>
                <span className="monthly">+$10/mo line</span>
              </button>
              
              <button 
                className={`accessory-card ${customerData.accessories.tablet ? 'selected' : ''}`}
                onClick={() => {
                  const newAccessories = {...customerData.accessories, tablet: !customerData.accessories.tablet};
                  setCustomerData({...customerData, accessories: newAccessories});
                }}
              >
                <div className="accessory-icon">📱</div>
                <h4>iPad</h4>
                <div className="accessory-deal">
                  <span className="deal">$230 OFF</span>
                </div>
                <span className="monthly">+$10/mo line</span>
              </button>
              
              <button 
                className={`accessory-card ${customerData.accessories.homeInternet ? 'selected' : ''} ${customerData.lines >= 2 ? 'free-badge' : ''}`}
                onClick={() => {
                  const newAccessories = {...customerData.accessories, homeInternet: !customerData.accessories.homeInternet};
                  setCustomerData({...customerData, accessories: newAccessories});
                }}
              >
                <div className="accessory-icon">🏠</div>
                <h4>Home Internet</h4>
                <div className="accessory-deal">
                  {customerData.lines >= 2 ? 
                    <><span className="strike">$60</span> <span className="free">FREE</span></> : 
                    <span className="regular">$60/mo</span>
                  }
                </div>
                <span className="monthly">5G broadband</span>
              </button>
            </div>
            
            <button 
              className="btn btn-primary calculate-btn"
              onClick={() => onAnswer(customerData.accessories)}
            >
              Calculate My Savings →
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="conversation-flow enhanced" {...swipeHandlers}>
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
          <span className="progress-text">{Math.round(getProgressPercentage())}%</span>
        </div>
        <div className="step-indicator">
          {steps.map((step, index) => (
            <span 
              key={step}
              className={`step-dot ${
                index < steps.indexOf(currentStep) ? 'completed' : 
                index === steps.indexOf(currentStep) ? 'active' : ''
              }`}
            />
          ))}
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
        {currentStep !== 'accessories' && (
          <button 
            className={`nav-btn continue ${!canContinue() ? 'disabled' : ''}`}
            onClick={handleContinue}
            disabled={!canContinue()}
          >
            Continue →
          </button>
        )}
      </div>
      
      <div className="swipe-hint">
        <span>← Swipe to navigate →</span>
      </div>
    </div>
  );
}

export default ConversationFlowEnhanced;