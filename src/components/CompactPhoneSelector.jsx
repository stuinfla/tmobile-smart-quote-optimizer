import { useState } from 'react';
import { phoneData } from '../data/phoneData';
import '../styles/compact-ui.css';

function CompactPhoneSelector({ devices, onDevicesUpdate, onContinue, step }) {
  const popularPhones = [
    { id: 'iPhone_17', name: 'iPhone 17', brand: 'apple' },
    { id: 'iPhone_17_Pro', name: 'iPhone 17 Pro', brand: 'apple' },
    { id: 'Galaxy_S25', name: 'Galaxy S25', brand: 'samsung' },
    { id: 'Galaxy_S25_Ultra', name: 'S25 Ultra', brand: 'samsung' }
  ];

  const handlePhoneSelect = (deviceIndex, phoneId) => {
    const newDevices = [...devices];
    newDevices[deviceIndex].newPhone = phoneId;
    newDevices[deviceIndex].storage = ''; // Reset storage
    onDevicesUpdate(newDevices);
  };

  const handleStorageSelect = (deviceIndex, storage) => {
    const newDevices = [...devices];
    newDevices[deviceIndex].storage = storage;
    onDevicesUpdate(newDevices);
    
    // Check if all devices are complete
    if (newDevices.every(d => d.newPhone && d.storage)) {
      setTimeout(() => onContinue && onContinue(), 300);
    }
  };

  const handleQuickSelect = (phoneId, storage) => {
    const newDevices = devices.map(() => ({
      ...devices[0],
      newPhone: phoneId,
      storage: storage
    }));
    onDevicesUpdate(newDevices);
    setTimeout(() => onContinue && onContinue(), 300);
  };

  const getPhoneInfo = (phoneId) => {
    const brand = Object.keys(phoneData.phones).find(b => phoneData.phones[b][phoneId]);
    return brand ? phoneData.phones[brand][phoneId] : null;
  };

  const currentDevice = devices.find(d => !d.newPhone || !d.storage) || devices[0];
  const currentIndex = Math.max(0, devices.findIndex(d => !d.newPhone || !d.storage));

  return (
    <div className="compact-qualification-container">
      {/* Compact header */}
      <div className="compact-header">
        <div className="progress-bar-compact">
          <div className="progress-fill-compact" style={{ width: '30%' }} />
        </div>
        <div style={{ fontSize: '0.75rem', color: '#666', textAlign: 'center', marginTop: '2px' }}>
          Step 3 of 10 - Line {currentIndex + 1} of {devices.length}
        </div>
      </div>

      {/* Main content - no scroll */}
      <div className="compact-content">
        <div className="question-card-compact">
          <h2 className="question-title-compact">
            {devices.length > 1 ? `Choose phone for Line ${currentIndex + 1}` : 'Choose your new phone'}
          </h2>
          
          {/* Quick select for multiple lines */}
          {devices.length > 1 && currentIndex === 0 && (
            <div className="quick-picks-compact">
              <button 
                className="quick-pick-btn"
                onClick={() => handleQuickSelect('iPhone_17', '256GB')}
              >
                All iPhone 17
              </button>
              <button 
                className="quick-pick-btn"
                onClick={() => handleQuickSelect('Galaxy_S25', '256GB')}
              >
                All Galaxy S25
              </button>
            </div>
          )}

          {/* Phone selection */}
          {!currentDevice?.newPhone ? (
            <div className="phone-grid-compact">
              {popularPhones.map(phone => {
                const phoneInfo = getPhoneInfo(phone.id);
                const basePrice = phoneInfo ? Object.values(phoneInfo.variants)[0] : 0;
                return (
                  <button
                    key={phone.id}
                    className="phone-btn-compact"
                    onClick={() => handlePhoneSelect(currentIndex, phone.id)}
                  >
                    <div className="phone-name-compact">{phone.name}</div>
                    <div className="phone-price-compact">from ${basePrice}</div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Storage selection */
            <div className="storage-selection-compact">
              <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                {getPhoneInfo(currentDevice.newPhone)?.name} - Select storage:
              </div>
              <div className="storage-grid-compact">
                {Object.entries(getPhoneInfo(currentDevice.newPhone)?.variants || {}).map(([storage, price]) => (
                  <button
                    key={storage}
                    className={`storage-btn-compact ${currentDevice.storage === storage ? 'selected' : ''}`}
                    onClick={() => handleStorageSelect(currentIndex, storage)}
                  >
                    <div className="storage-size-compact">{storage}</div>
                    <div className="storage-price-compact">${price}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Show selected devices */}
          {devices.length > 1 && (
            <div className="selected-devices-compact">
              {devices.map((device, idx) => (
                device.newPhone && device.storage && (
                  <div key={idx} className="selected-device-compact">
                    Line {idx + 1}: {getPhoneInfo(device.newPhone)?.name} {device.storage}
                  </div>
                )
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fixed continue button */}
      <div className="continue-area-compact">
        <button 
          className="continue-btn-compact"
          onClick={() => onContinue && onContinue()}
          disabled={!devices.every(d => d.newPhone && d.storage)}
        >
          Continue →
        </button>
        <div className="version-footer-compact">
          v2.6.2
        </div>
      </div>
    </div>
  );
}

export default CompactPhoneSelector;