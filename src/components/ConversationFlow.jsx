import { phoneData, tradeInValues } from '../data/phoneData';
import { plans } from '../data/plans';

function ConversationFlow({ currentStep, customerData, onAnswer, setCustomerData }) {
  // Define the flow steps for navigation
  const steps = ['lines', 'newPhones', 'currentPhones', 'plan', 'accessories'];
  
  const getProgressPercentage = () => {
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      onAnswer('back', steps[currentIndex - 1]);
    }
  };

  const handleContinue = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      onAnswer('continue', steps[currentIndex + 1]);
    }
  };

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

  const renderQuestion = () => {
    switch(currentStep) {
      case 'lines':
        return (
          <div className="question-card">
            <h2 className="question-text">How many lines do you need?</h2>
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
                  {num >= 3 && <small style={{color: 'var(--tmobile-magenta)', fontWeight: 'bold'}}>3rd line FREE!</small>}
                  <div style={{fontSize: '0.875rem', opacity: 0.7, marginTop: '0.25rem'}}>
                    Starting at ${plans.postpaid.GO5G_Next.pricing[num]}/mo
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'newPhones':
        return (
          <div className="question-card">
            <h2 className="question-text">Which new phones would you like?</h2>
            <div className="device-selector">
              {customerData.devices.map((device, index) => (
                <div key={index} className="device-card">
                  <div className="input-group">
                    <label className="input-label">Line {index + 1} - New Phone</label>
                    <select 
                      className="input-field"
                      value={device.newPhone}
                      onChange={(e) => {
                        const newDevices = [...customerData.devices];
                        newDevices[index].newPhone = e.target.value;
                        newDevices[index].storage = ''; // Reset storage when phone changes
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
                    <div className="input-group" style={{marginTop: '0.5rem'}}>
                      <label className="input-label">Storage Option</label>
                      <select 
                        className="input-field"
                        value={device.storage}
                        onChange={(e) => {
                          const newDevices = [...customerData.devices];
                          newDevices[index].storage = e.target.value;
                          setCustomerData({...customerData, devices: newDevices});
                        }}
                      >
                        <option value="">Select storage...</option>
                        {Object.entries(phoneData.phones[Object.keys(phoneData.phones).find(b => phoneData.phones[b][device.newPhone])][device.newPhone].variants).map(([storage, price]) => (
                          <option key={storage} value={storage}>
                            {storage} - ${price}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'currentPhones':
        return (
          <div className="question-card">
            <h2 className="question-text">What phones do you currently have for trade-in?</h2>
            <p style={{fontSize: '0.9rem', opacity: 0.7, marginBottom: '1rem'}}>
              We'll calculate if trading in or keeping your phones saves more money
            </p>
            <div className="device-selector">
              {customerData.devices.map((device, index) => (
                <div key={index} className="device-card">
                  <div className="input-group">
                    <label className="input-label">Line {index + 1} - Current Phone</label>
                    <select 
                      className="input-field"
                      value={device.currentPhone}
                      onChange={(e) => {
                        const newDevices = [...customerData.devices];
                        newDevices[index].currentPhone = e.target.value;
                        setCustomerData({...customerData, devices: newDevices});
                      }}
                    >
                      <option value="">Select current phone...</option>
                      <option value="no_trade">No trade-in / Keep phone</option>
                      <optgroup label="iPhone">
                        {Object.keys(tradeInValues).filter(k => k.startsWith('iPhone')).map(phone => (
                          <option key={phone} value={phone}>
                            {phone.replace(/_/g, ' ')} - ${tradeInValues[phone]} value
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Samsung">
                        {Object.keys(tradeInValues).filter(k => k.startsWith('Samsung')).map(phone => (
                          <option key={phone} value={phone}>
                            {phone.replace(/_/g, ' ')} - ${tradeInValues[phone]} value
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Google">
                        {Object.keys(tradeInValues).filter(k => k.startsWith('Google')).map(phone => (
                          <option key={phone} value={phone}>
                            {phone.replace(/_/g, ' ')} - ${tradeInValues[phone]} value
                          </option>
                        ))}
                      </optgroup>
                      <option value="other">Other phone (minimal value)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'plan':
        return (
          <div className="question-card">
            <h2 className="question-text">Which plan works best for you?</h2>
            <div className="answer-options">
              {Object.entries(plans.postpaid).map(([key, plan]) => (
                <button 
                  key={key}
                  className={`option-button ${customerData.selectedPlan === key ? 'selected' : ''}`}
                  onClick={() => {
                    setCustomerData({...customerData, selectedPlan: key});
                    setTimeout(handleContinue, 300);
                  }}
                  style={{textAlign: 'left'}}
                >
                  <div style={{fontWeight: 'bold', fontSize: '1.1rem'}}>{plan.name}</div>
                  <div style={{fontSize: '1.25rem', color: 'var(--tmobile-magenta)', fontWeight: 'bold', margin: '0.25rem 0'}}>
                    ${plan.pricing[customerData.lines] || plan.pricing[1] * customerData.lines}/mo
                  </div>
                  <div style={{fontSize: '0.875rem', opacity: 0.8}}>
                    • {plan.features.hotspot}<br/>
                    • {plan.features.streaming.length > 0 ? plan.features.streaming.join(', ') : 'Basic streaming'}<br/>
                    {key === 'GO5G_Next' && '• Upgrade every year'}
                    {key === 'GO5G_Plus' && '• Most popular choice'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'accessories':
        return (
          <div className="question-card">
            <h2 className="question-text">Add accessories or extras?</h2>
            <div className="answer-options">
              <button 
                className={`option-button ${customerData.accessories.watch ? 'selected' : ''}`}
                onClick={() => {
                  const newAccessories = {...customerData.accessories, watch: !customerData.accessories.watch};
                  setCustomerData({...customerData, accessories: newAccessories});
                }}
              >
                <div style={{fontSize: '1.1rem'}}>⌚ Apple Watch</div>
                <div style={{fontWeight: 'bold', color: 'var(--tmobile-magenta)'}}>
                  {customerData.selectedPlan === 'GO5G_Next' ? 'Ultra 2 FREE ($799 value)' : 'SE3 for $99 ($200 off)'}
                </div>
                <small style={{opacity: 0.7}}>+$10/mo for line</small>
              </button>
              <button 
                className={`option-button ${customerData.accessories.tablet ? 'selected' : ''}`}
                onClick={() => {
                  const newAccessories = {...customerData.accessories, tablet: !customerData.accessories.tablet};
                  setCustomerData({...customerData, accessories: newAccessories});
                }}
              >
                <div style={{fontSize: '1.1rem'}}>📱 iPad/Tablet</div>
                <div style={{fontWeight: 'bold', color: 'var(--tmobile-magenta)'}}>$230 off iPad</div>
                <small style={{opacity: 0.7}}>+$10/mo for line</small>
              </button>
              <button 
                className={`option-button ${customerData.accessories.homeInternet ? 'selected' : ''}`}
                onClick={() => {
                  const newAccessories = {...customerData.accessories, homeInternet: !customerData.accessories.homeInternet};
                  setCustomerData({...customerData, accessories: newAccessories});
                }}
              >
                <div style={{fontSize: '1.1rem'}}>🏠 Home Internet</div>
                <div style={{fontWeight: 'bold', color: 'var(--tmobile-magenta)'}}>
                  {customerData.lines >= 2 ? 'FREE with 2+ lines' : '$60/mo'}
                </div>
                <small style={{opacity: 0.7}}>5G home broadband</small>
              </button>
            </div>
            <button 
              className="btn btn-primary" 
              style={{marginTop: '1.5rem', width: '100%'}}
              onClick={() => onAnswer(customerData.accessories)}
            >
              Calculate Best Deals →
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="conversation-flow">
      <div className="flow-header">
        <h1 className="flow-title">Smart Quote Builder</h1>
        <div className="flow-progress">
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${getProgressPercentage()}%`}}></div>
          </div>
          <span className="progress-text">{Math.round(getProgressPercentage())}%</span>
        </div>
      </div>
      
      {renderQuestion()}
      
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginTop: '1.5rem',
        justifyContent: 'space-between'
      }}>
        {steps.indexOf(currentStep) > 0 && (
          <button 
            className="btn btn-secondary"
            onClick={handleBack}
            style={{minWidth: '100px'}}
          >
            ← Back
          </button>
        )}
        {currentStep !== 'accessories' && (
          <button 
            className="btn btn-primary"
            onClick={handleContinue}
            disabled={!canContinue()}
            style={{minWidth: '100px', marginLeft: 'auto'}}
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  );
}

export default ConversationFlow;