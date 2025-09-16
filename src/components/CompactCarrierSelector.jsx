import { useState } from 'react';
import '../styles/compact-ui.css';

function CompactCarrierSelector({ onCarrierUpdate, initialCarrier, onContinue, onBack }) {
  const [selected, setSelected] = useState(initialCarrier || '');

  const carriers = [
    { id: 'Verizon', name: 'Verizon', icon: '✓', color: '#ee0000', bonus: '$800/line' },
    { id: 'AT&T', name: 'AT&T', icon: '📶', color: '#00a8e0', bonus: '$800/line' },
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
        {onBack && (
          <button
            onClick={onBack}
            style={{
              position: 'absolute',
              top: '0.5rem',
              left: '0.5rem',
              padding: '0.5rem',
              background: 'transparent',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer',
              color: '#333'
            }}
          >
            ← Back
          </button>
        )}
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
                {carrier.bonus && (
                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: '#00c853', 
                    fontWeight: '600',
                    backgroundColor: '#e8f5e9',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    marginTop: '4px'
                  }}>
                    Keep & Switch: {carrier.bonus}
                  </div>
                )}
                {carrier.note && (
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>
                    {carrier.note}
                  </div>
                )}
              </button>
            ))}
          </div>

          {selected && ['Verizon', 'AT&T'].includes(selected) && (
            <div className="carrier-tip-compact" style={{
              backgroundColor: '#e8f5e9',
              padding: '12px',
              borderRadius: '8px',
              marginTop: '1rem',
              border: '1px solid #4caf50'
            }}>
              ✅ <strong>Great news!</strong> You qualify for Keep & Switch - get $800 per line when you switch. No trade-in needed - keep your current phones!
            </div>
          )}
        </div>
      </div>

      {/* Auto-advance when selection made */}
      {selected && (
        <div style={{
          position: 'fixed',
          bottom: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#22c55e',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.9rem',
          fontWeight: 600,
          zIndex: 1000
        }}>
          ✓ Complete - Moving forward...
        </div>
      )}
    </div>
  );
}

export default CompactCarrierSelector;