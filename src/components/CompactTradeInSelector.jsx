import { useState, useEffect } from 'react';
import '../styles/compact-ui.css';

const tradeInOptions = [
  { id: 'keep', name: 'Keep & Switch', desc: 'Up to $800 credit', icon: '💰' },
  { id: 'iPhone_15_Pro', name: 'iPhone 15 Pro', desc: 'Up to $1000 trade', icon: '📱' },
  { id: 'iPhone_14', name: 'iPhone 14', desc: 'Up to $800 trade', icon: '📱' },
  { id: 'Galaxy_S23', name: 'Galaxy S23', desc: 'Up to $800 trade', icon: '📱' },
  { id: 'broken', name: 'Broken Phone', desc: '$200 trade credit', icon: '📵' },
  { id: 'no_trade', name: 'No Trade-in', desc: 'Full price', icon: '❌' }
];

function CompactTradeInSelector({ devices, onDevicesUpdate, onContinue, isCompetitor }) {
  const defaultOption = isCompetitor ? 'keep' : 'iPhone_14';
  const [selections, setSelections] = useState(
    devices.map(d => d.currentPhone || defaultOption)
  );

  useEffect(() => {
    // Set smart defaults based on carrier
    if (!devices[0].currentPhone) {
      const newDevices = devices.map(d => ({
        ...d,
        currentPhone: defaultOption
      }));
      onDevicesUpdate(newDevices);
      setSelections(devices.map(() => defaultOption));
    }
  }, []);

  const handleTradeSelect = (lineIndex, optionId) => {
    const newSelections = [...selections];
    newSelections[lineIndex] = optionId;
    setSelections(newSelections);

    const newDevices = [...devices];
    newDevices[lineIndex].currentPhone = optionId;
    onDevicesUpdate(newDevices);
  };

  const handleQuickSelect = (optionId) => {
    const newSelections = devices.map(() => optionId);
    setSelections(newSelections);

    const newDevices = devices.map(d => ({
      ...d,
      currentPhone: optionId
    }));
    onDevicesUpdate(newDevices);
  };

  const allSelected = selections.every(s => s && s !== '');

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
      overflow: 'hidden'
    }}>
      {/* Header with Continue button */}
      <div style={{
        background: 'white',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        padding: '0.5rem',
        zIndex: 1000
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          <div style={{ fontSize: '0.75rem', color: '#666' }}>
            Step 5 of 10
          </div>
          <button 
            onClick={() => onContinue && onContinue()}
            disabled={!allSelected}
            style={{
              padding: '0.5rem 1.5rem',
              background: allSelected ? '#e20074' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: allSelected ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease'
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
            width: '50%',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        padding: '1rem',
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
          }}>Trade-in or Keep & Switch?</h2>
          <p style={{
            fontSize: '0.85rem',
            color: '#666',
            marginBottom: '1rem'
          }}>
            {isCompetitor 
              ? "Keep & Switch gives you up to $800/line credit!" 
              : "Select your current phones for trade-in value"}
          </p>

          {/* Quick action buttons */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            {isCompetitor && (
              <button
                onClick={() => handleQuickSelect('keep')}
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
                💰 All Keep & Switch
              </button>
            )}
            <button
              onClick={() => handleQuickSelect('iPhone_15_Pro')}
              style={{
                padding: '0.5rem 1rem',
                background: isCompetitor ? 'white' : '#e20074',
                color: isCompetitor ? '#e20074' : 'white',
                border: isCompetitor ? '2px solid #e20074' : 'none',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              All iPhone 15 Pro
            </button>
            <button
              onClick={() => handleQuickSelect('no_trade')}
              style={{
                padding: '0.5rem 1rem',
                background: 'white',
                color: '#666',
                border: '2px solid #e0e0e0',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              No Trade-ins
            </button>
          </div>
        </div>

        {/* Lines with trade-in options */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '0.75rem',
          flex: 1,
          overflow: 'auto'
        }}>
          {devices.map((device, index) => (
            <div key={index} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1rem',
              border: selections[index] ? '2px solid #e20074' : '2px solid transparent'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem'
              }}>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: '#333'
                }}>
                  Line {index + 1}
                  <span style={{
                    fontSize: '0.75rem',
                    color: '#666',
                    marginLeft: '0.5rem',
                    fontWeight: 'normal'
                  }}>
                    {device.newPhone ? `(New: ${device.newPhone.replace(/_/g, ' ')})` : ''}
                  </span>
                </h3>
                {selections[index] && (
                  <span style={{
                    background: selections[index] === 'keep' ? '#22c55e' : '#e20074',
                    color: 'white',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {tradeInOptions.find(o => o.id === selections[index])?.name}
                  </span>
                )}
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.5rem'
              }}>
                {(isCompetitor ? 
                  [tradeInOptions[0], ...tradeInOptions.slice(1, 5)] : 
                  tradeInOptions.slice(1, 5)
                ).map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleTradeSelect(index, option.id)}
                    style={{
                      padding: '0.5rem',
                      background: selections[index] === option.id ? 
                        (option.id === 'keep' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(226, 0, 116, 0.1)') : 
                        'white',
                      border: selections[index] === option.id ? 
                        (option.id === 'keep' ? '2px solid #22c55e' : '2px solid #e20074') : 
                        '2px solid #e0e0e0',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      fontSize: '1rem',
                      marginBottom: '0.25rem'
                    }}>{option.icon}</div>
                    <div style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: '#333'
                    }}>{option.name}</div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: '#666',
                      marginTop: '0.125rem'
                    }}>{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue button */}
      <div style={{
        background: 'white',
        borderTop: '1px solid #e0e0e0',
        padding: '1rem',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <button 
          onClick={() => onContinue && onContinue()}
          disabled={!allSelected}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '0.875rem',
            background: allSelected ? '#e20074' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: allSelected ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s ease'
          }}
        >
          Continue →
        </button>
        <div style={{
          fontSize: '0.55rem',
          color: '#ccc',
          marginTop: '0.5rem'
        }}>
          v2.6.5
        </div>
      </div>
    </div>
  );
}

export default CompactTradeInSelector;