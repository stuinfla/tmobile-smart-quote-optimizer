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
      <div className="compact-header">
        <div className="progress-bar-compact">
          <div className="progress-fill-compact" style={{ width: '30%' }} />
        </div>
        <div style={{ fontSize: '0.75rem', color: '#666', textAlign: 'center', marginTop: '2px' }}>
          Step 3 of 9
        </div>
      </div>

      {/* Main content - no scroll */}
      <div className="compact-content">
        <div className="question-card-compact">
          <h2 className="question-title-compact">Current Carrier</h2>
          <p className="question-subtitle-compact">Where are you switching from?</p>
          
          <div className="carrier-grid-compact">
            {carriers.map(carrier => (
              <button
                key={carrier.id}
                className={`carrier-btn-compact ${selected === carrier.id ? 'selected' : ''}`}
                onClick={() => handleSelect(carrier.id)}
                style={{ borderColor: selected === carrier.id ? carrier.color : '#e0e0e0' }}
              >
                <span className="carrier-icon-compact" style={{ color: carrier.color }}>
                  {carrier.icon}
                </span>
                <div className="carrier-content-compact">
                  <div className="carrier-name-compact">{carrier.name}</div>
                  {carrier.note && (
                    <div className="carrier-note-compact">{carrier.note}</div>
                  )}
                </div>
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
          v2.6.1
        </div>
      </div>
    </div>
  );
}

export default CompactCarrierSelector;