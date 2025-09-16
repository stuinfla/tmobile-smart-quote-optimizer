import { useState } from 'react';
import '../styles/compact-ui.css';

function CompactCarrierSelector({ onCarrierUpdate, initialCarrier, onContinue }) {
  const [selected, setSelected] = useState(initialCarrier || '');

  const carriers = [
    { id: 'att', name: 'AT&T', icon: '📶', color: '#00a8e0' },
    { id: 'verizon', name: 'Verizon', icon: '✓', color: '#ee0000' },
    { id: 'tmobile', name: 'T-Mobile', icon: '📱', color: '#e20074', note: 'Upgrading' },
    { id: 'other', name: 'Other Carrier', icon: '📡', color: '#666' }
  ];

  const handleSelect = (carrierId) => {
    setSelected(carrierId);
    
    // Update parent with carrier and smart defaults
    const isCompetitor = carrierId !== 'tmobile';
    onCarrierUpdate({
      carrier: carrierId,
      isCompetitor,
      // If coming from competitor, default to Keep & Switch for better savings
      defaultTradeIn: isCompetitor ? 'keep' : 'trade'
    });
    
    // Auto-advance after 300ms
    setTimeout(() => {
      if (onContinue) {
        onContinue();
      }
    }, 300);
  };

  return (
    <div className="compact-qualification-container">
      {/* Compact header */}
      <div className="compact-header" style={{ position: 'relative' }}>
        <div className="progress-bar-compact">
          <div className="progress-fill-compact" style={{ width: '30%' }} />
        </div>
        <div style={{ fontSize: '0.75rem', color: '#666', textAlign: 'center', marginTop: '2px' }}>
          Step 3 of 9
        </div>
        <button
          onClick={() => onContinue && onContinue()}
          disabled={!selected}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: selected ? '#e20074' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: selected ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s'
          }}
        >
          Next →
        </button>
      </div>

      {/* Main content - no scroll */}
      <div className="compact-content">
        <div className="question-card-compact">
          <h2 className="question-title-compact">Current Carrier</h2>
          <p className="question-subtitle-compact">Where are you switching from?</p>
          
          <div className="carrier-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '0.75rem',
            marginTop: '1rem'
          }}>
            {carriers.map(carrier => (
              <button
                key={carrier.id}
                onClick={() => handleSelect(carrier.id)}
                style={{
                  padding: '1rem',
                  border: `2px solid ${selected === carrier.id ? carrier.color : '#e0e0e0'}`,
                  borderRadius: '12px',
                  background: selected === carrier.id ? `${carrier.color}10` : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
                className="carrier-button"
              >
                <div style={{ fontSize: '1.5rem' }}>{carrier.icon}</div>
                <div style={{ 
                  fontWeight: selected === carrier.id ? '600' : '500',
                  color: selected === carrier.id ? carrier.color : '#333',
                  fontSize: '0.95rem'
                }}>
                  {carrier.name}
                </div>
                {carrier.note && (
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>
                    {carrier.note}
                  </div>
                )}
              </button>
            ))}
          </div>

          {selected && selected !== 'tmobile' && (
            <div className="carrier-tip-compact">
              💡 <strong>Pro Tip:</strong> Keep & Switch usually saves more than trading in!
            </div>
          )}
        </div>
      </div>

      {/* Fixed continue button */}
      <div className="continue-area-compact">
        <button 
          className="continue-btn-compact"
          onClick={() => onContinue && onContinue()}
          disabled={!selected}
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

export default CompactCarrierSelector;