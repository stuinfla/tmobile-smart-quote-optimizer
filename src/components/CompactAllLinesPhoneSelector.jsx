import { useState, useEffect } from 'react';
import '../styles/compact-ui.css';

// Phones ordered by popularity at T-Mobile
const phoneOptions = [
  // iPhone 17 Series (Most Popular)
  { id: 'iPhone_17', name: 'iPhone 17', price: 829.99, brand: 'Apple' },
  { id: 'iPhone_17_Pro', name: 'iPhone 17 Pro', price: 1099.99, brand: 'Apple' },
  { id: 'iPhone_17_Pro_Max', name: 'iPhone 17 Pro Max', price: 1199.99, brand: 'Apple' },
  { id: 'iPhone_17_Plus', name: 'iPhone 17 Plus', price: 929.99, brand: 'Apple' },
  { id: 'iPhone_17_Air', name: 'iPhone 17 Air', price: 999.99, brand: 'Apple' },
  
  // Samsung Galaxy S25 Series (Second Most Popular)
  { id: 'Galaxy_S25', name: 'Samsung Galaxy S25', price: 799.99, brand: 'Samsung' },
  { id: 'S25_Ultra', name: 'Samsung Galaxy S25 Ultra', price: 1199.99, brand: 'Samsung' },
  { id: 'Galaxy_S25_Plus', name: 'Samsung Galaxy S25+', price: 999.99, brand: 'Samsung' },
  
  // Google Pixel Series
  { id: 'Pixel_10', name: 'Google Pixel 10', price: 699.99, brand: 'Google' },
  { id: 'Pixel_10_Pro', name: 'Google Pixel 10 Pro', price: 999.99, brand: 'Google' },
  
  // OnePlus
  { id: 'OnePlus_13', name: 'OnePlus 13', price: 729.99, brand: 'OnePlus' },
  { id: 'OnePlus_13_Pro', name: 'OnePlus 13 Pro', price: 899.99, brand: 'OnePlus' },
];

const storageOptions = {
  Apple: ['128GB', '256GB', '512GB', '1TB'],
  Samsung: ['256GB', '512GB', '1TB'],
  Google: ['128GB', '256GB', '512GB'],
  OnePlus: ['256GB', '512GB'],
  default: ['128GB', '256GB']
};

function CompactAllLinesPhoneSelector({ devices, onDevicesUpdate, onContinue, onBack, step }) {
  const [selections, setSelections] = useState(
    devices.map(d => ({
      model: d.newPhone || 'iPhone_17',
      storage: d.storage || '256GB'
    }))
  );

  const isNewPhones = step === 'newPhones';
  const title = isNewPhones ? 'Select New Phones' : 'Current Phones';

  const updateDevices = (newSelections) => {
    const newDevices = devices.map((d, index) => ({
      ...d,
      [isNewPhones ? 'newPhone' : 'currentPhone']: newSelections[index].model,
      storage: newSelections[index].storage
    }));
    onDevicesUpdate(newDevices);
  };

  // Initialize devices on first load
  useEffect(() => {
    const initialSelections = devices.map(d => ({
      model: d.newPhone || 'iPhone_17',
      storage: d.storage || '256GB'
    }));
    setSelections(initialSelections);
    updateDevices(initialSelections);
  }, []);

  const handleModelSelect = (lineIndex, modelId) => {
    const newSelections = [...selections];
    const phone = phoneOptions.find(p => p.id === modelId);
    const brand = phone?.brand || 'default';
    const availableStorage = storageOptions[brand] || storageOptions.default;
    
    newSelections[lineIndex].model = modelId;
    // Reset to default storage for this brand
    newSelections[lineIndex].storage = availableStorage.includes('256GB') ? '256GB' : availableStorage[0];
    
    setSelections(newSelections);
    updateDevices(newSelections);
  };

  const handleStorageSelect = (lineIndex, storage) => {
    const newSelections = [...selections];
    newSelections[lineIndex].storage = storage;
    setSelections(newSelections);
    updateDevices(newSelections);
  };

  const handleQuickSelect = (modelId) => {
    const phone = phoneOptions.find(p => p.id === modelId);
    const brand = phone?.brand || 'default';
    const availableStorage = storageOptions[brand] || storageOptions.default;
    const defaultStorage = availableStorage.includes('256GB') ? '256GB' : availableStorage[0];
    
    const newSelections = devices.map(() => ({
      model: modelId,
      storage: defaultStorage
    }));
    setSelections(newSelections);
    updateDevices(newSelections);
  };

  const allSelected = selections.every(s => s.model && s.storage);

  // Auto-advance when all selections are complete
  useEffect(() => {
    if (allSelected && onContinue) {
      setTimeout(() => {
        onContinue();
      }, 800); // Brief delay to let user see their selection
    }
  }, [allSelected, onContinue]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      background: '#f5f5f5'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        padding: '0.75rem 1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '1rem',
                cursor: 'pointer',
                padding: '0.25rem',
                color: '#333'
              }}
            >
              ← Back
            </button>
          )}
          <div style={{ 
            fontSize: '0.85rem', 
            color: '#666',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)'
          }}>
            Step 4 of 10
          </div>
          {allSelected && (
            <div style={{
              padding: '0.4rem 1rem',
              background: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 600
            }}>
              ✓ Complete
            </div>
          )}
        </div>
        <div style={{
          height: '3px',
          background: '#e0e0e0',
          borderRadius: '3px'
        }}>
          <div style={{
            height: '100%',
            background: '#e20074',
            width: '40%',
            borderRadius: '3px'
          }} />
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '1rem'
      }}>
        {/* Title and Quick Select */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            color: '#333'
          }}>{title}</h2>
          
          {/* Quick select buttons */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => handleQuickSelect('iPhone_17')}
              style={{
                padding: '0.4rem 0.8rem',
                background: '#e20074',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              All iPhone 17
            </button>
            <button
              onClick={() => handleQuickSelect('iPhone_17_Pro')}
              style={{
                padding: '0.4rem 0.8rem',
                background: 'white',
                color: '#e20074',
                border: '2px solid #e20074',
                borderRadius: '16px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              All iPhone 17 Pro
            </button>
            <button
              onClick={() => handleQuickSelect('Galaxy_S25')}
              style={{
                padding: '0.4rem 0.8rem',
                background: 'white',
                color: '#666',
                border: '2px solid #e0e0e0',
                borderRadius: '16px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              All Galaxy S25
            </button>
          </div>
        </div>

        {/* Lines with dropdowns - All 4 visible */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '0.75rem'
        }}>
          {devices.map((device, index) => {
            const selection = selections[index];
            const selectedPhone = phoneOptions.find(p => p.id === selection.model);
            const brand = selectedPhone?.brand || 'default';
            const availableStorage = storageOptions[brand] || storageOptions.default;
            
            return (
              <div key={index} style={{
                background: 'white',
                borderRadius: '8px',
                padding: '0.75rem',
                border: '1px solid #e0e0e0'
              }}>
                {/* Line header */}
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#333',
                  marginBottom: '0.5rem'
                }}>
                  Line {index + 1}
                </div>

                {/* Phone dropdown */}
                <select
                  value={selection.model}
                  onChange={(e) => handleModelSelect(index, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    background: 'white',
                    marginBottom: '0.5rem',
                    fontWeight: 500
                  }}
                >
                  <optgroup label="iPhone (Most Popular)">
                    {phoneOptions.filter(p => p.brand === 'Apple').map(phone => (
                      <option key={phone.id} value={phone.id}>
                        {phone.name} - ${phone.price}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Samsung Galaxy">
                    {phoneOptions.filter(p => p.brand === 'Samsung').map(phone => (
                      <option key={phone.id} value={phone.id}>
                        {phone.name} - ${phone.price}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Google Pixel">
                    {phoneOptions.filter(p => p.brand === 'Google').map(phone => (
                      <option key={phone.id} value={phone.id}>
                        {phone.name} - ${phone.price}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="OnePlus">
                    {phoneOptions.filter(p => p.brand === 'OnePlus').map(phone => (
                      <option key={phone.id} value={phone.id}>
                        {phone.name} - ${phone.price}
                      </option>
                    ))}
                  </optgroup>
                </select>

                {/* Storage options */}
                <div style={{
                  display: 'flex',
                  gap: '0.35rem'
                }}>
                  {availableStorage.map(storage => (
                    <button
                      key={storage}
                      onClick={() => handleStorageSelect(index, storage)}
                      style={{
                        flex: 1,
                        padding: '0.35rem',
                        background: selection.storage === storage ? '#e20074' : 'white',
                        color: selection.storage === storage ? 'white' : '#666',
                        border: selection.storage === storage ? '1px solid #e20074' : '1px solid #e0e0e0',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CompactAllLinesPhoneSelector;