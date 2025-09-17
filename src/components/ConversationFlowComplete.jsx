import { useState, useEffect } from 'react';
import { phoneData, tradeInValues } from '../data/phoneData';
import { plans } from '../data/plans_sept_2025';
import { insurancePricing, accessoryLinePricing } from '../data/insuranceData';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import EnhancedAccessorySelector from './EnhancedAccessorySelector';
import CustomerQualification from './CustomerQualification';
import CustomerTypeSelector from './CustomerTypeSelector';
import CompactLinesSelector from './CompactLinesSelector';
import CompactCarrierSelector from './CompactCarrierSelector';
import CompactAllLinesPhoneSelector from './CompactAllLinesPhoneSelector';
import CompactTradeInSelector from './CompactTradeInSelector';
import CompactFinancingSelector from './CompactFinancingSelector';
import FinancingSelector from './FinancingSelector';
import FloatingContinueButton from './FloatingContinueButton';
import ProgressDots from './ProgressDots';
import '../styles/insurance-fixes.css';
import '../styles/compact-ui.css';

function ConversationFlowComplete({ currentStep, customerData, onAnswer, setCustomerData }) {
  // Smart flow: Adapt based on customer type
  const getSteps = () => {
    // Base flow for existing customers
    if (customerData.isExisting) {
      return ['customerType', 'lines', 'currentPhones', 'newPhones', 'plan', 'accessoryLines', 'accessoryDevices', 'insurance', 'summary'];
    }
    
    // Smart flow for new customers: carrier first, then decide on trade-in
    if (customerData.newCustomer) {
      // If coming from Verizon/AT&T with Keep & Switch, skip trade-in
      const isKeepAndSwitchEligible = ['Verizon', 'AT&T'].includes(customerData.carrier);
      if (isKeepAndSwitchEligible && customerData.carrier) {
        // Fast path: Skip trade-in for Keep & Switch customers
        return ['customerType', 'lines', 'carrier', 'newPhones', 'plan', 'accessoryLines', 'accessoryDevices', 'insurance', 'summary'];
      }
      // Standard new customer flow
      return ['customerType', 'lines', 'carrier', 'currentPhones', 'newPhones', 'plan', 'accessoryLines', 'accessoryDevices', 'insurance', 'summary'];
    }
    
    // Default flow
    return ['customerType', 'lines', 'carrier', 'currentPhones', 'newPhones', 'plan', 'accessoryLines', 'accessoryDevices', 'insurance', 'summary'];
  };
  
  const steps = getSteps();
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
        // Special handling: After carrier selection, determine next step
        let nextStep = steps[currentIndex + 1];
        if (currentStep === 'carrier' && ['Verizon', 'AT&T'].includes(customerData.carrier)) {
          // Skip currentPhones for Keep & Switch eligible customers
          const newSteps = getSteps();
          const nextIndex = newSteps.indexOf(currentStep) + 1;
          nextStep = newSteps[nextIndex];
        }
        onAnswer('continue', nextStep);
        setIsAnimating(false);
      }, 200);
      if (navigator.vibrate) navigator.vibrate(10);
    }
  };

  const swipeHandlers = useSwipeGesture(handleContinue, handleBack);

  const canContinue = () => {
    switch(currentStep) {
      case 'customerType':
        return customerData.isExisting !== undefined;
      case 'lines':
        return customerData.lines > 0 && customerData.devices.length === customerData.lines;
      case 'carrier':
        return customerData.carrier && customerData.carrier !== '';
      case 'newPhones':
        return customerData.devices.every(d => d.newPhone && d.storage);
      case 'currentPhones':
        // Fix: Allow any non-null value as valid (including empty string for no trade-in)
        return customerData.devices.every(d => d.currentPhone !== undefined && d.currentPhone !== null);
      case 'plan':
        return customerData.selectedPlan && customerData.selectedPlan !== '';
      case 'accessoryLines':
        return true; // Always allow continuation from accessory lines (can skip)
      case 'accessoryDevices':
        // Check if devices are selected when accessory lines are chosen
        if (!customerData.accessoryLines) return true;
        const needsWatchDevice = customerData.accessoryLines?.watch && customerData.watchDevice === undefined;
        const needsTabletDevice = customerData.accessoryLines?.tablet && customerData.tabletDevice === undefined;
        return !needsWatchDevice && !needsTabletDevice;
      case 'insurance':
        return true; // Always allow continuation from insurance (optional)
      case 'summary':
        return true; // Always can calculate from summary
      default:
        return true;
    }
  };

  const renderQuestion = () => {
    switch(currentStep) {
      case 'customerType':
        return (
          <CustomerTypeSelector
            onSelect={(data) => {
              // Update customer data
              const newCustomerData = {
                ...customerData,
                isExisting: data.type === 'existing',
                newCustomer: data.type === 'new',
                discountCategory: data.category
              };
              setCustomerData(newCustomerData);
              
              // Navigate to next step directly without checking canContinue
              // since we know the data is valid if onSelect was called
              const currentIndex = steps.indexOf(currentStep);
              if (currentIndex < steps.length - 1) {
                const nextStep = steps[currentIndex + 1];
                onAnswer('continue', nextStep);
              }
            }}
            onNext={handleContinue}
          />
        );
      case 'lines':
        return (
          <CompactLinesSelector
            onLinesUpdate={(data) => {
              setCustomerData({
                ...customerData,
                lines: data.lines,
                devices: data.devices
              });
            }}
            initialLines={customerData.lines}
            onContinue={handleContinue}
            onBack={handleBack}
          />
        );

      case 'carrier':
        return (
          <CompactCarrierSelector
            onCarrierUpdate={(data) => {
              setCustomerData({
                ...customerData,
                carrier: data.carrier,
                isCompetitor: data.isCompetitor,
                defaultTradeIn: data.defaultTradeIn
              });
            }}
            initialCarrier={customerData.carrier}
            onContinue={handleContinue}
            onBack={handleBack}
          />
        );

      case 'newPhones':
        return (
          <CompactAllLinesPhoneSelector
            devices={customerData.devices}
            onDevicesUpdate={(newDevices) => {
              setCustomerData({...customerData, devices: newDevices});
            }}
            onContinue={handleContinue}
            onBack={handleBack}
            step="newPhones"
          />
        );


      case 'insurance':
        const allLinesInsured = customerData.devices.every(d => d.insurance);
        const noLinesInsured = customerData.devices.every(d => !d.insurance);
        
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">Protect your devices with Protection 360?</h2>
            <p className="sub-text">Covers damage, loss, theft + McAfee Security</p>
            
            {/* All Lines Toggle */}
            <div className="all-lines-toggle">
              <button
                className={`toggle-all-btn ${allLinesInsured ? 'active' : ''}`}
                onClick={() => {
                  const newDevices = customerData.devices.map(d => ({...d, insurance: true}));
                  setCustomerData({...customerData, devices: newDevices});
                  // Advance to next step after updating state  
                  const currentIndex = steps.indexOf('insurance');
                  const nextStep = steps[currentIndex + 1];
                  setTimeout(() => onAnswer('continue', nextStep), 400);
                }}
              >
                Protect All Lines
              </button>
              <button
                className={`toggle-all-btn ${noLinesInsured ? 'active' : ''}`}
                onClick={() => {
                  const newDevices = customerData.devices.map(d => ({...d, insurance: false}));
                  setCustomerData({...customerData, devices: newDevices});
                  // Advance to next step after updating state  
                  const currentIndex = steps.indexOf('insurance');
                  const nextStep = steps[currentIndex + 1];
                  setTimeout(() => onAnswer('continue', nextStep), 400);
                }}
              >
                Skip Insurance
              </button>
            </div>
            
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
                      <button
                        className={`insurance-btn ${device.insurance ? 'active' : ''}`}
                        onClick={() => {
                          const newDevices = [...customerData.devices];
                          newDevices[index].insurance = !newDevices[index].insurance;
                          setCustomerData({...customerData, devices: newDevices});
                        }}
                      >
                        <span className="checkbox-icon">{device.insurance ? '✓' : ''}</span>
                        <div className="insurance-details">
                          <span className="price">${insuranceInfo.monthly}/mo</span>
                          <span className="deductible">$0 screen repair</span>
                        </div>
                      </button>
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
          <CompactTradeInSelector
            devices={customerData.devices}
            onDevicesUpdate={(newDevices) => {
              setCustomerData({...customerData, devices: newDevices});
            }}
            onContinue={handleContinue}
            isCompetitor={customerData.isCompetitor}
          />
        );
        
      case 'currentPhones_old':
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
                    // Navigate to next step in the flow
                    const currentIndex = steps.indexOf('plan');
                    const nextStep = steps[currentIndex + 1];
                    setTimeout(() => onAnswer('continue', nextStep), 400);
                  }}
                >
                  {key === 'EXPERIENCE_BEYOND' && <span className="badge-popular">MOST POPULAR</span>}
                  <h3>{plan.name}</h3>
                  <div className="plan-price">
                    <span className="price-amount">${(plan.pricing[customerData.lines] || plan.pricing[1]) * customerData.lines}</span>
                    <span className="price-period">/mo</span>
                  </div>
                  <ul className="plan-features">
                    {plan.features && (
                      <>
                        <li>{plan.features.data || 'Unlimited data'}</li>
                        <li>{plan.features.hotspot || 'Mobile hotspot'}</li>
                        {plan.features.streaming && <li>{Array.isArray(plan.features.streaming) ? plan.features.streaming[0] : plan.features.streaming}</li>}
                      </>
                    )}
                  </ul>
                </button>
              ))}
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
            
            <div style={{marginTop: '1rem', textAlign: 'center'}}>
              <div style={{
                background: '#22c55e',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'inline-block'
              }}>
                ✓ Continue via navigation dots below
              </div>
            </div>
            
            {/* Skip button */}
            <button 
              className="skip-btn"
              onClick={() => {
                setCustomerData({...customerData, accessoryLines: null});
                setTimeout(() => onAnswer('continue', 'insurance'), 400);
              }}
              style={{
                marginTop: '0.5rem',
                background: 'transparent',
                border: 'none',
                color: '#666',
                textDecoration: 'underline',
                cursor: 'pointer',
                fontSize: '0.9rem',
                display: 'block',
                width: '100%',
                textAlign: 'center'
              }}
            >
              Skip all accessories
            </button>
          </div>
        );

      case 'accessoryDevices':
        if (!customerData.accessoryLines || (!customerData.accessoryLines.watch && !customerData.accessoryLines.tablet)) {
          setTimeout(() => onAnswer('continue', 'insurance'), 100);
          return null;
        }
        
        const hasPromoPlan = customerData.selectedPlan === 'EXPERIENCE_BEYOND';
        
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
                      onClick={() => setCustomerData({...customerData, watchDevice: 'new', watchModel: 'Apple_Watch_Series_9'})}
                    >
                      Buy New Watch
                      <span className="sub-text">Apple Watch from $15/mo</span>
                    </button>
                    <button 
                      className={`choice-btn ${customerData.watchDevice === 'byod' ? 'selected' : ''}`}
                      onClick={() => setCustomerData({...customerData, watchDevice: 'byod', watchModel: null})}
                    >
                      Bring My Own
                      <span className="sub-text">Just add ${hasPromoPlan ? '5' : '12'}/mo line</span>
                    </button>
                  </div>
                  {customerData.watchDevice === 'new' && (
                    <div className="model-selector" style={{marginTop: '1rem'}}>
                      <label style={{display: 'block', marginBottom: '0.5rem'}}>Select Watch Model:</label>
                      <select 
                        value={customerData.watchModel || 'Apple_Watch_Series_9'}
                        onChange={(e) => setCustomerData({...customerData, watchModel: e.target.value})}
                        className="input-field"
                      >
                        <option value="Apple_Watch_Series_9">Apple Watch Series 9 - $399</option>
                        <option value="Apple_Watch_SE">Apple Watch SE - $249</option>
                        <option value="Apple_Watch_Ultra_2">Apple Watch Ultra 2 - $799</option>
                        <option value="Galaxy_Watch_6">Galaxy Watch 6 - $299</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
              
              {customerData.accessoryLines?.tablet && (
                <div className="device-choice-card">
                  <h4>📱 Tablet Line</h4>
                  <div className="choice-buttons">
                    <button 
                      className={`choice-btn ${customerData.tabletDevice === 'new' ? 'selected' : ''}`}
                      onClick={() => setCustomerData({...customerData, tabletDevice: 'new', tabletModel: 'iPad_10th_Gen'})}
                    >
                      Buy New iPad/Tablet
                      <span className="sub-text">iPad from $20/mo</span>
                    </button>
                    <button 
                      className={`choice-btn ${customerData.tabletDevice === 'byod' ? 'selected' : ''}`}
                      onClick={() => setCustomerData({...customerData, tabletDevice: 'byod', tabletModel: null})}
                    >
                      Bring My Own
                      <span className="sub-text">Just add ${hasPromoPlan ? '5' : '20'}/mo line</span>
                    </button>
                  </div>
                  {customerData.tabletDevice === 'new' && (
                    <div className="model-selector" style={{marginTop: '1rem'}}>
                      <label style={{display: 'block', marginBottom: '0.5rem'}}>Select Tablet Model:</label>
                      <select 
                        value={customerData.tabletModel || 'iPad_10th_Gen'}
                        onChange={(e) => setCustomerData({...customerData, tabletModel: e.target.value})}
                        className="input-field"
                      >
                        <option value="iPad_10th_Gen">iPad (10th Gen) - $449</option>
                        <option value="iPad_Air">iPad Air - $599</option>
                        <option value="iPad_Pro_11">iPad Pro 11" - $799</option>
                        <option value="iPad_Pro_13">iPad Pro 13" - $1299</option>
                        <option value="Galaxy_Tab_S9">Galaxy Tab S9 - $799</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 'summary':
        // Handle both old and new accessory data structures
        let accessoryLineCount = 0;
        let accessorySummary = [];
        
        if (customerData.accessoryLines) {
          // New structure with arrays
          if (Array.isArray(customerData.accessoryLines?.watches)) {
            accessoryLineCount += customerData.accessoryLines.watches.length;
            if (customerData.accessoryLines.watches.length > 0) {
              accessorySummary.push(`${customerData.accessoryLines.watches.length} watch line${customerData.accessoryLines.watches.length > 1 ? 's' : ''}`);
            }
          }
          if (Array.isArray(customerData.accessoryLines?.tablets)) {
            accessoryLineCount += customerData.accessoryLines.tablets.length;
            if (customerData.accessoryLines.tablets.length > 0) {
              const unlimitedCount = customerData.accessoryLines.tablets.filter(t => t.dataType === 'unlimited').length;
              const partialCount = customerData.accessoryLines.tablets.filter(t => t.dataType === 'partial').length;
              let tabletText = `${customerData.accessoryLines.tablets.length} tablet line${customerData.accessoryLines.tablets.length > 1 ? 's' : ''}`;
              if (unlimitedCount > 0 && partialCount > 0) {
                tabletText += ` (${unlimitedCount} unlimited, ${partialCount} partial)`;
              } else if (unlimitedCount > 1) {
                tabletText += ' (2nd unlimited 50% off!)';
              }
              accessorySummary.push(tabletText);
            }
          }
          // Old structure compatibility
          if (customerData.accessoryLines?.watch && !Array.isArray(customerData.accessoryLines?.watches)) {
            accessoryLineCount += 1;
            accessorySummary.push('1 watch line');
          }
          if (customerData.accessoryLines?.tablet && !Array.isArray(customerData.accessoryLines?.tablets)) {
            accessoryLineCount += 1;
            accessorySummary.push('1 tablet line');
          }
          if (customerData.accessoryLines?.homeInternet) {
            accessoryLineCount += 1;
            accessorySummary.push(`Home Internet ${customerData.lines >= 2 ? '(FREE)' : ''}`);
          }
        }
        
        const totalLines = customerData.lines + accessoryLineCount;
        
        return (
          <div className={`question-card ${isAnimating ? `slide-${direction}` : ''}`}>
            <h2 className="question-text">Ready to see your savings?</h2>
            
            <div className="summary-card">
              <h3>Your Quote Summary</h3>
              <ul className="summary-list">
                {customerData.qualification && customerData.qualification !== 'standard' && (
                  <li style={{color: '#E20074', fontWeight: 'bold'}}>
                    {customerData.qualification === 'military' && '🎖️ Military Discount'}
                    {customerData.qualification === 'firstResponder' && '🚑 First Responder Discount'}
                    {customerData.qualification === 'seniorPlus55' && '👴 55+ Senior Discount'}
                    {customerData.qualification === 'business' && '💼 Business Account'}
                  </li>
                )}
                <li>{customerData.lines} phone line{customerData.lines > 1 ? 's' : ''}</li>
                {customerData.financingTerm && (
                  <li>📆 {customerData.financingTerm}-month device financing (0% APR)</li>
                )}
                {customerData.devices.filter(d => d.insurance).length > 0 && (
                  <li>Protection 360 on {customerData.devices.filter(d => d.insurance).length} device{customerData.devices.filter(d => d.insurance).length > 1 ? 's' : ''}</li>
                )}
                {accessorySummary.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
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

  // For compact components, return them directly without wrapper
  if (['customerType', 'lines', 'carrier', 'newPhones', 'currentPhones'].includes(currentStep)) {
    return renderQuestion();
  }

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
      
      {/* Progress dots at bottom */}
      <ProgressDots 
        currentStep={currentStep}
        onStepClick={(stepId) => {
          // Allow navigation to completed steps
          const targetIndex = steps.indexOf(stepId);
          const currentIndex = steps.indexOf(currentStep);
          if (targetIndex <= currentIndex) {
            onAnswer('navigate', stepId);
          }
        }}
      />
    </div>
  );
}

export default ConversationFlowComplete;