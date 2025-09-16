import { useState, useEffect } from 'react';
import '../styles/compact-ui.css';

const brands = [
  { id: 'iPhone', name: 'iPhone', icon: '📱' },
  { id: 'Galaxy', name: 'Galaxy', icon: '📱' },
  { id: 'Pixel', name: 'Pixel', icon: '📱' }
];

const models = {
  iPhone: [
    { id: 'iPhone_17', name: 'iPhone 17', price: '$829.99', storageOptions: ['128GB', '256GB', '512GB'] },
    { id: 'iPhone_17_Pro', name: 'iPhone 17 Pro', price: '$1099.99', storageOptions: ['128GB', '256GB', '512GB', '1TB'] }
  ],
  Galaxy: [
    { id: 'Galaxy_S25', name: 'Galaxy S25', price: '$799.99', storageOptions: ['128GB', '256GB'] },
    { id: 'S25_Ultra', name: 'S25 Ultra', price: '$1199.99', storageOptions: ['256GB', '512GB', '1TB'] }
  ],
  Pixel: [
    { id: 'Pixel_10', name: 'Pixel 10', price: '$699.99', storageOptions: ['128GB', '256GB'] },
    { id: 'Pixel_10_Pro', name: 'Pixel 10 Pro', price: '$999.99', storageOptions: ['128GB', '256GB', '512GB'] }
  ]
};

function CompactAllLinesPhoneSelector({ devices, onDevicesUpdate, onContinue, step }) {
  const [selections, setSelections] = useState(
    devices.map(d => ({
      model: d.newPhone || 'iPhone_17_Pro',
      storage: d.storage || '128GB'
    }))
  );

  const isNewPhones = step === 'newPhones';
  const title = isNewPhones ? 'Select New Phones' : 'Current Phones for Trade-in';
  const subtitle = isNewPhones 
    ? 'Choose phones for all lines' 
    : 'Select phones to trade in or keep';

  const handleModelSelect = (lineIndex, modelId) => {
    const newSelections = [...selections];
    const model = Object.values(models).flat().find(m => m.id === modelId);
    newSelections[lineIndex].model = modelId;
    newSelections[lineIndex].storage = model.storageOptions[0]; // Reset to first storage option
    setSelections(newSelections);
    updateDevices(newSelections);
  };

  const handleStorageSelect = (lineIndex, storage) => {
    const newSelections = [...selections];
    newSelections[lineIndex].storage = storage;
    setSelections(newSelections);
    updateDevices(newSelections);
  };

  const updateDevices = (newSelections) => {
    const newDevices = devices.map((d, index) => ({
      ...d,
      [isNewPhones ? 'newPhone' : 'currentPhone']: newSelections[index].model,
      storage: newSelections[index].storage
    }));
    onDevicesUpdate(newDevices);
  };

  const handleQuickSelect = (modelId) => {
    const model = Object.values(models).flat().find(m => m.id === modelId);
    
    const newSelections = devices.map(() => ({
      model: modelId,
      storage: model.storageOptions[0]
    }));
    setSelections(newSelections);
    updateDevices(newSelections);
  };

  const allSelected = selections.every(s => s.model && s.storage);
  const progressPercent = isNewPhones ? 40 : 50;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      background: '#f5f5f5',
      overflow: 'hidden',
      zIndex: 1
    }}>
      {/* Header with Continue button */}
      <div style={{
        background: 'white',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        padding: '0.5rem',
        zIndex: 101,
        position: 'fixed',
        top: '60px',
        left: 0,
        right: 0
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#666' }}>
            Step {isNewPhones ? 4 : 5} of 10
          </div>
          <button 
            onClick={() => onContinue && onContinue()}
            disabled={false}
            style={{
              padding: '0.5rem 1.5rem',
              background: '#e20074',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              zIndex: 102,
              position: 'relative',
              pointerEvents: 'auto',
              display: 'block',
              visibility: 'visible'
            }}
          >
            Continue →
          </button>
        </div>
        <div style={{
          height: '3px',
          background: '#e0e0e0'
        }}>
          <div style={{
            height: '100%',
            background: '#e20074',
            width: `${progressPercent}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        padding: '1rem',
        paddingTop: '8rem',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: 600,
            marginBottom: '0.5rem',
            color: '#333'
          }}>{title}</h2>
          <p style={{
            fontSize: '0.85rem',
            color: '#666',
            marginBottom: '1rem'
          }}>{subtitle}</p>

          {/* Quick select buttons */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => handleQuickSelect('iPhone_17_Pro')}
              style={{
                padding: '0.5rem 1rem',
                background: '#e20074',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              📱 All iPhone 17 Pro
            </button>
            <button
              onClick={() => handleQuickSelect('iPhone_17')}
              style={{
                padding: '0.5rem 1rem',
                background: 'white',
                color: '#e20074',
                border: '2px solid #e20074',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              📱 All iPhone 17
            </button>
            <button
              onClick={() => handleQuickSelect('S25_Ultra')}
              style={{
                padding: '0.5rem 1rem',
                background: 'white',
                color: '#e20074',
                border: '2px solid #e20074',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              📱 All S25 Ultra
            </button>
          </div>
        </div>

        {/* Lines with selections */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '0.5rem',
          flex: 1
        }}>
          {devices.map((device, index) => {
            const selection = selections[index];
            const selectedModel = Object.values(models).flat().find(m => m.id === selection.model);
            
            return (
              <div key={index} style={{
                background: 'white',
                borderRadius: '8px',
                padding: '0.75rem',
                border: allSelected ? '2px solid #e20074' : '2px solid transparent'
              }}>
                <h3 style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: '#333',
                  marginBottom: '0.5rem'
                }}>Line {index + 1}</h3>

                {/* Model selection with dropdown */}
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#666',
                    marginBottom: '0.25rem',
                    fontWeight: 600
                  }}>Phone Model</div>
                  <select
                    value={selection.model}
                    onChange={(e) => handleModelSelect(index, e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      border: '2px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      background: 'white',
                      fontWeight: 500
                    }}
                  >
                    {Object.entries(models).map(([brand, phoneModels]) => (
                      <optgroup key={brand} label={`${brand} Phones`}>
                        {phoneModels.map(model => (
                          <option key={model.id} value={model.id}>
                            {model.name} - {model.price}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                {/* Storage selection */}
                {selectedModel && (
                  <div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#666',
                      marginBottom: '0.25rem',
                      fontWeight: 600
                    }}>Storage</div>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
                      gap: '0.35rem'
                    }}>
                      {selectedModel.storageOptions.map(storage => (
                        <button
                          key={storage}
                          onClick={() => handleStorageSelect(index, storage)}
                          style={{
                            padding: '0.4rem',
                            background: selection.storage === storage ? 'rgba(226, 0, 116, 0.1)' : 'white',
                            border: selection.storage === storage ? '2px solid #e20074' : '2px solid #e0e0e0',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textAlign: 'center'
                          }}
                        >
                          {storage}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Version info at bottom */}
      <div style={{
        fontSize: '0.55rem',
        color: '#ccc',
        textAlign: 'center',
        padding: '0.5rem'
      }}>
        v2.6.5
      </div>
    </div>
  );
}

export default CompactAllLinesPhoneSelector;