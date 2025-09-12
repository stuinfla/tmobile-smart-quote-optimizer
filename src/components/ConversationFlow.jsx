import { phoneData, tradeInValues } from '../data/phoneData';
import { plans } from '../data/plans';

function ConversationFlow({ currentStep, customerData, onAnswer, setCustomerData }) {
  const getProgressPercentage = () => {
    const steps = ['customerType', 'carrier', 'lines', 'currentPhones', 'newPhones', 'plan', 'accessories'];
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const renderQuestion = () => {
    switch(currentStep) {
      case 'customerType':
        return (
          <div className="question-card">
            <h2 className="question-text">Are you a current T-Mobile customer?</h2>
            <div className="answer-options">
              <button 
                className="option-button"
                onClick={() => onAnswer('new')}
              >
                <div>🆕 New Customer</div>
                <small style={{opacity: 0.7}}>Switching from another carrier</small>
              </button>
              <button 
                className="option-button"
                onClick={() => onAnswer('existing')}
              >
                <div>📱 Existing Customer</div>
                <small style={{opacity: 0.7}}>Already with T-Mobile</small>
              </button>
            </div>
          </div>
        );

      case 'carrier':
        return (
          <div className="question-card">
            <h2 className="question-text">
              {customerData.newCustomer ? 'Which carrier are you switching from?' : 'Which carrier were you with?'}
            </h2>
            <div className="answer-options">
              {['Verizon', 'AT&T', 'Xfinity', 'Spectrum', 'UScellular', 'Other'].map(carrier => (
                <button 
                  key={carrier}
                  className="option-button"
                  onClick={() => onAnswer(carrier)}
                >
                  {carrier}
                </button>
              ))}
            </div>
          </div>
        );

      case 'lines':
        return (
          <div className="question-card">
            <h2 className="question-text">How many lines do you need?</h2>
            <div className="answer-options">
              {[1, 2, 3, 4, 5].map(num => (
                <button 
                  key={num}
                  className="option-button"
                  onClick={() => onAnswer(num)}
                >
                  <div>{num} {num === 1 ? 'Line' : 'Lines'}</div>
                  {num >= 3 && <small style={{color: 'var(--tmobile-magenta)'}}>3rd line FREE!</small>}
                </button>
              ))}
            </div>
          </div>
        );

      case 'currentPhones':
        return (
          <div className="question-card">
            <h2 className="question-text">What phones do you currently have?</h2>
            <div className="device-selector">
              {customerData.devices.map((device, index) => (
                <div key={index} className="device-card">
                  <div className="input-group">
                    <label className="input-label">Line {index + 1} Current Phone</label>
                    <select 
                      className="input-field"
                      value={device.currentPhone}
                      onChange={(e) => {
                        const newDevices = [...customerData.devices];
                        newDevices[index].currentPhone = e.target.value;
                        setCustomerData({...customerData, devices: newDevices});
                      }}
                    >
                      <option value="">Select phone...</option>
                      <optgroup label="iPhone">
                        {Object.keys(tradeInValues).filter(k => k.startsWith('iPhone')).map(phone => (
                          <option key={phone} value={phone}>
                            {phone.replace(/_/g, ' ')} - ${tradeInValues[phone]} trade value
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Samsung">
                        {Object.keys(tradeInValues).filter(k => k.startsWith('Samsung')).map(phone => (
                          <option key={phone} value={phone}>
                            {phone.replace(/_/g, ' ')} - ${tradeInValues[phone]} trade value
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Google">
                        {Object.keys(tradeInValues).filter(k => k.startsWith('Google')).map(phone => (
                          <option key={phone} value={phone}>
                            {phone.replace(/_/g, ' ')} - ${tradeInValues[phone]} trade value
                          </option>
                        ))}
                      </optgroup>
                      <option value="other">Other/No Trade-In</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="btn btn-primary" 
              style={{marginTop: '1rem'}}
              onClick={() => onAnswer('continue')}
            >
              Continue
            </button>
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
                    <label className="input-label">Line {index + 1} New Phone</label>
                    <select 
                      className="input-field"
                      value={device.newPhone}
                      onChange={(e) => {
                        const newDevices = [...customerData.devices];
                        newDevices[index].newPhone = e.target.value;
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
                      <label className="input-label">Storage</label>
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
            <button 
              className="btn btn-primary" 
              style={{marginTop: '1rem'}}
              onClick={() => onAnswer('continue')}
            >
              Continue
            </button>
          </div>
        );

      case 'plan':
        return (
          <div className="question-card">
            <h2 className="question-text">Which plan would you like?</h2>
            <div className="answer-options">
              {Object.entries(plans.postpaid).map(([key, plan]) => (
                <button 
                  key={key}
                  className={`option-button ${customerData.selectedPlan === key ? 'selected' : ''}`}
                  onClick={() => onAnswer(key)}
                  style={{textAlign: 'left'}}
                >
                  <div style={{fontWeight: 'bold'}}>{plan.name}</div>
                  <div style={{fontSize: '0.9rem', opacity: 0.8}}>
                    ${plan.pricing[customerData.lines] || plan.pricing[1] * customerData.lines}/mo for {customerData.lines} lines
                  </div>
                  <div style={{fontSize: '0.8rem', opacity: 0.7, marginTop: '0.25rem'}}>
                    {plan.features.hotspot} • {plan.features.streaming.length > 0 ? plan.features.streaming[0] : 'Basic'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'accessories':
        return (
          <div className="question-card">
            <h2 className="question-text">Would you like any accessories or add-ons?</h2>
            <div className="answer-options">
              <button 
                className={`option-button ${customerData.accessories.watch ? 'selected' : ''}`}
                onClick={() => {
                  const newAccessories = {...customerData.accessories, watch: !customerData.accessories.watch};
                  setCustomerData({...customerData, accessories: newAccessories});
                }}
              >
                <div>⌚ Apple Watch</div>
                <small>{customerData.selectedPlan === 'GO5G_Next' ? 'Ultra 2 FREE' : 'SE3 for $99'}</small>
              </button>
              <button 
                className={`option-button ${customerData.accessories.tablet ? 'selected' : ''}`}
                onClick={() => {
                  const newAccessories = {...customerData.accessories, tablet: !customerData.accessories.tablet};
                  setCustomerData({...customerData, accessories: newAccessories});
                }}
              >
                <div>📱 iPad/Tablet</div>
                <small>$230 off iPad Pro/Air</small>
              </button>
              <button 
                className={`option-button ${customerData.accessories.homeInternet ? 'selected' : ''}`}
                onClick={() => {
                  const newAccessories = {...customerData.accessories, homeInternet: !customerData.accessories.homeInternet};
                  setCustomerData({...customerData, accessories: newAccessories});
                }}
              >
                <div>🏠 Home Internet</div>
                <small>FREE with 2+ lines</small>
              </button>
            </div>
            <button 
              className="btn btn-primary" 
              style={{marginTop: '1.5rem', width: '100%'}}
              onClick={() => onAnswer(customerData.accessories)}
            >
              Calculate Best Deals
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
    </div>
  );
}

export default ConversationFlow;