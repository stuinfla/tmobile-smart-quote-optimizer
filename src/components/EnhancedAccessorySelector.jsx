import { useState } from 'react';
import '../styles/accessory-selector.css';

const tabletDataPlans = {
  partial: {
    name: '5GB Data',
    price: 5,
    description: '5GB high-speed data, then 128Kbps'
  },
  unlimited: {
    name: 'Unlimited',
    price: 20,
    description: 'Unlimited high-speed data',
    discount: {
      second: 0.5, // 50% off second line
      description: '2nd tablet 50% off'
    }
  }
};

const watchPlans = {
  standard: {
    price: 12,
    promotional: 5, // With Experience Beyond
    description: 'Unlimited data for smartwatch'
  }
};

function EnhancedAccessorySelector({ customerData, setCustomerData, hasPromoPlan }) {
  const [accessoryLines, setAccessoryLines] = useState({
    watches: customerData.accessoryLines?.watches || [],
    tablets: customerData.accessoryLines?.tablets || [],
    homeInternet: customerData.accessoryLines?.homeInternet || false
  });

  const addWatch = () => {
    const newWatch = {
      id: `watch-${Date.now()}`,
      type: 'watch',
      device: 'byod', // 'new' or 'byod'
      model: null,
      price: hasPromoPlan ? watchPlans.standard.promotional : watchPlans.standard.price
    };
    
    const updated = {
      ...accessoryLines,
      watches: [...accessoryLines.watches, newWatch]
    };
    setAccessoryLines(updated);
    updateCustomerData(updated);
  };

  const addTablet = () => {
    const newTablet = {
      id: `tablet-${Date.now()}`,
      type: 'tablet',
      device: 'byod', // 'new' or 'byod'
      model: null,
      dataType: 'unlimited', // 'partial' or 'unlimited'
      price: calculateTabletPrice(accessoryLines.tablets.length, 'unlimited')
    };
    
    const updated = {
      ...accessoryLines,
      tablets: [...accessoryLines.tablets, newTablet]
    };
    setAccessoryLines(updated);
    updateCustomerData(updated);
  };

  const removeAccessory = (type, id) => {
    let updated;
    if (type === 'watch') {
      updated = {
        ...accessoryLines,
        watches: accessoryLines.watches.filter(w => w.id !== id)
      };
    } else if (type === 'tablet') {
      const newTablets = accessoryLines.tablets.filter(t => t.id !== id);
      // Recalculate prices for remaining tablets
      const repricedTablets = newTablets.map((tablet, index) => ({
        ...tablet,
        price: calculateTabletPrice(index, tablet.dataType)
      }));
      updated = {
        ...accessoryLines,
        tablets: repricedTablets
      };
    }
    setAccessoryLines(updated);
    updateCustomerData(updated);
  };

  const updateTabletDataType = (id, dataType) => {
    const tabletIndex = accessoryLines.tablets.findIndex(t => t.id === id);
    const updatedTablets = accessoryLines.tablets.map((tablet, index) => {
      if (tablet.id === id) {
        return {
          ...tablet,
          dataType,
          price: calculateTabletPrice(tabletIndex, dataType)
        };
      }
      return tablet;
    });
    
    const updated = {
      ...accessoryLines,
      tablets: updatedTablets
    };
    setAccessoryLines(updated);
    updateCustomerData(updated);
  };

  const updateDeviceChoice = (type, id, deviceChoice, model = null) => {
    let updated;
    if (type === 'watch') {
      updated = {
        ...accessoryLines,
        watches: accessoryLines.watches.map(w => 
          w.id === id ? { ...w, device: deviceChoice, model } : w
        )
      };
    } else if (type === 'tablet') {
      updated = {
        ...accessoryLines,
        tablets: accessoryLines.tablets.map(t => 
          t.id === id ? { ...t, device: deviceChoice, model } : t
        )
      };
    }
    setAccessoryLines(updated);
    updateCustomerData(updated);
  };

  const calculateTabletPrice = (index, dataType) => {
    if (dataType === 'partial') {
      return tabletDataPlans.partial.price;
    }
    
    // For unlimited: first tablet is $20, second is 50% off ($10), rest are $20
    if (index === 1) {
      // Second unlimited tablet gets 50% off
      const unlimitedCount = accessoryLines.tablets.filter(t => t.dataType === 'unlimited').length;
      if (unlimitedCount >= 1) {
        return tabletDataPlans.unlimited.price * 0.5;
      }
    }
    
    return tabletDataPlans.unlimited.price;
  };

  const toggleHomeInternet = () => {
    const updated = {
      ...accessoryLines,
      homeInternet: !accessoryLines.homeInternet
    };
    setAccessoryLines(updated);
    updateCustomerData(updated);
  };

  const updateCustomerData = (lines) => {
    setCustomerData({
      ...customerData,
      accessoryLines: lines
    });
  };

  const getTotalAccessoryLines = () => {
    return accessoryLines.watches.length + 
           accessoryLines.tablets.length + 
           (accessoryLines.homeInternet ? 1 : 0);
  };

  const getMonthlyAccessoryCost = () => {
    let total = 0;
    
    // Watches
    accessoryLines.watches.forEach(watch => {
      total += watch.price;
    });
    
    // Tablets with proper discount logic
    accessoryLines.tablets.forEach(tablet => {
      total += tablet.price;
    });
    
    // Home Internet (free with 2+ lines)
    if (accessoryLines.homeInternet) {
      total += customerData.lines >= 2 ? 0 : 60;
    }
    
    return total;
  };

  return (
    <div className="enhanced-accessory-selector">
      <h2 className="question-text">Add connected devices to your plan</h2>
      <p className="sub-text">Customize your connected ecosystem</p>

      {/* Watches Section */}
      <div className="accessory-section">
        <div className="section-header">
          <h3>⌚ Smartwatches ({accessoryLines.watches.length})</h3>
          <button className="add-btn" onClick={addWatch}>
            + Add Watch
          </button>
        </div>
        
        {accessoryLines.watches.map((watch, index) => (
          <div key={watch.id} className="accessory-item">
            <div className="item-header">
              <span className="item-title">Watch {index + 1}</span>
              <button 
                className="remove-btn"
                onClick={() => removeAccessory('watch', watch.id)}
              >
                Remove
              </button>
            </div>
            
            <div className="device-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name={`watch-${watch.id}`}
                  checked={watch.device === 'byod'}
                  onChange={() => updateDeviceChoice('watch', watch.id, 'byod')}
                />
                <span>Bring my own - ${watch.price}/mo</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name={`watch-${watch.id}`}
                  checked={watch.device === 'new'}
                  onChange={() => updateDeviceChoice('watch', watch.id, 'new', 'Apple_Watch_Series_9')}
                />
                <span>Buy new watch - ${watch.price}/mo + device</span>
              </label>
              
              {watch.device === 'new' && (
                <select 
                  className="model-select"
                  value={watch.model || 'Apple_Watch_Series_9'}
                  onChange={(e) => updateDeviceChoice('watch', watch.id, 'new', e.target.value)}
                >
                  <option value="Apple_Watch_Series_9">Apple Watch Series 9 - $399</option>
                  <option value="Apple_Watch_SE">Apple Watch SE - $249</option>
                  <option value="Apple_Watch_Ultra_2">Apple Watch Ultra 2 - $799</option>
                  <option value="Galaxy_Watch_6">Galaxy Watch 6 - $299</option>
                </select>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tablets Section */}
      <div className="accessory-section">
        <div className="section-header">
          <h3>📱 Tablets ({accessoryLines.tablets.length})</h3>
          <button className="add-btn" onClick={addTablet}>
            + Add Tablet
          </button>
        </div>
        
        {accessoryLines.tablets.length > 1 && 
         accessoryLines.tablets.filter(t => t.dataType === 'unlimited').length > 1 && (
          <div className="promo-banner">
            🎉 2nd unlimited tablet line is 50% off!
          </div>
        )}
        
        {accessoryLines.tablets.map((tablet, index) => (
          <div key={tablet.id} className="accessory-item">
            <div className="item-header">
              <span className="item-title">Tablet {index + 1}</span>
              <button 
                className="remove-btn"
                onClick={() => removeAccessory('tablet', tablet.id)}
              >
                Remove
              </button>
            </div>
            
            <div className="data-plan-selector">
              <h4>Select Data Plan:</h4>
              <label className="radio-option">
                <input
                  type="radio"
                  name={`tablet-data-${tablet.id}`}
                  checked={tablet.dataType === 'partial'}
                  onChange={() => updateTabletDataType(tablet.id, 'partial')}
                />
                <span>
                  5GB Data - $5/mo
                  <small>5GB high-speed, then 128Kbps</small>
                </span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name={`tablet-data-${tablet.id}`}
                  checked={tablet.dataType === 'unlimited'}
                  onChange={() => updateTabletDataType(tablet.id, 'unlimited')}
                />
                <span>
                  Unlimited - ${tablet.price}/mo
                  {index === 1 && tablet.dataType === 'unlimited' && 
                   accessoryLines.tablets[0]?.dataType === 'unlimited' && (
                    <span className="discount-badge">50% OFF!</span>
                  )}
                  <small>Unlimited high-speed data</small>
                </span>
              </label>
            </div>
            
            <div className="device-options">
              <label className="radio-option">
                <input
                  type="radio"
                  name={`tablet-device-${tablet.id}`}
                  checked={tablet.device === 'byod'}
                  onChange={() => updateDeviceChoice('tablet', tablet.id, 'byod')}
                />
                <span>Bring my own tablet</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name={`tablet-device-${tablet.id}`}
                  checked={tablet.device === 'new'}
                  onChange={() => updateDeviceChoice('tablet', tablet.id, 'new', 'iPad_10th_Gen')}
                />
                <span>Buy new tablet</span>
              </label>
              
              {tablet.device === 'new' && (
                <select 
                  className="model-select"
                  value={tablet.model || 'iPad_10th_Gen'}
                  onChange={(e) => updateDeviceChoice('tablet', tablet.id, 'new', e.target.value)}
                >
                  <option value="iPad_10th_Gen">iPad (10th Gen) - $449</option>
                  <option value="iPad_Air">iPad Air - $599</option>
                  <option value="iPad_Pro_11">iPad Pro 11" - $799</option>
                  <option value="iPad_Pro_13">iPad Pro 13" - $1299</option>
                  <option value="Galaxy_Tab_S9">Galaxy Tab S9 - $799</option>
                </select>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Home Internet Section */}
      <div className="accessory-section">
        <div className="section-header">
          <h3>🏠 Home Internet</h3>
        </div>
        
        <button 
          className={`home-internet-btn ${accessoryLines.homeInternet ? 'selected' : ''}`}
          onClick={toggleHomeInternet}
        >
          <div className="internet-info">
            <h4>T-Mobile 5G Home Internet</h4>
            <div className="pricing">
              {customerData.lines >= 2 ? (
                <>
                  <span className="promo-price">FREE</span>
                  <span className="regular-price strike">$60/mo</span>
                </>
              ) : (
                <span className="regular-price">$60/mo</span>
              )}
            </div>
            <span className="description">Unlimited 5G home broadband</span>
          </div>
          <div className="selection-indicator">
            {accessoryLines.homeInternet ? '✓ Selected' : 'Select'}
          </div>
        </button>
      </div>

      {/* Summary */}
      <div className="accessory-summary">
        <h4>Accessory Lines Summary</h4>
        <ul>
          {accessoryLines.watches.length > 0 && (
            <li>{accessoryLines.watches.length} watch line{accessoryLines.watches.length > 1 ? 's' : ''}</li>
          )}
          {accessoryLines.tablets.length > 0 && (
            <li>
              {accessoryLines.tablets.length} tablet line{accessoryLines.tablets.length > 1 ? 's' : ''}
              {accessoryLines.tablets.filter(t => t.dataType === 'unlimited').length > 1 && 
                ' (with 2nd unlimited 50% off!)'}
            </li>
          )}
          {accessoryLines.homeInternet && (
            <li>Home Internet {customerData.lines >= 2 ? '(FREE)' : ''}</li>
          )}
        </ul>
        <div className="total-cost">
          Additional monthly cost: <strong>${getMonthlyAccessoryCost()}/mo</strong>
        </div>
      </div>

    </div>
  );
}

export default EnhancedAccessorySelector;