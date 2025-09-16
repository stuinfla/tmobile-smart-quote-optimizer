import { useState } from 'react';
import '../styles/compact-ui.css';

function CompactFinancingSelector({ onFinancingUpdate, initialTerm, onContinue }) {
  const [selected, setSelected] = useState(initialTerm || 24);

  const handleSelect = (term) => {
    setSelected(term);
    onFinancingUpdate(term);
    
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
          <div className="progress-fill-compact" style={{ width: '40%' }} />
        </div>
        <div style={{ fontSize: '0.75rem', color: '#666', textAlign: 'center', marginTop: '2px' }}>
          Step 4 of 10
        </div>
      </div>

      {/* Main content - no scroll */}
      <div className="compact-content">
        <div className="question-card-compact">
          <h2 className="question-title-compact">Device Financing</h2>
          <p className="question-subtitle-compact">Choose your payment term</p>
          
          <div className="financing-options-compact">
            <button
              className={`financing-btn-compact ${selected === 24 ? 'selected' : ''}`}
              onClick={() => handleSelect(24)}
            >
              <div className="financing-icon-compact">24</div>
              <div className="financing-content-compact">
                <div className="financing-title-compact">24 Months</div>
                <div className="financing-desc-compact">Standard financing</div>
                <div className="financing-benefit-compact">Lower total cost</div>
              </div>
              <span className="financing-badge-compact">Popular</span>
            </button>

            <button
              className={`financing-btn-compact ${selected === 36 ? 'selected' : ''}`}
              onClick={() => handleSelect(36)}
            >
              <div className="financing-icon-compact">36</div>
              <div className="financing-content-compact">
                <div className="financing-title-compact">36 Months</div>
                <div className="financing-desc-compact">Extended term</div>
                <div className="financing-benefit-compact">Lower monthly payment</div>
              </div>
            </button>
          </div>

          <div className="financing-info-compact">
            <div className="info-item-compact">
              <span className="info-icon">ℹ️</span>
              <span className="info-text">0% APR on all device financing</span>
            </div>
            <div className="info-item-compact">
              <span className="info-icon">✓</span>
              <span className="info-text">No down payment required for qualified customers</span>
            </div>
          </div>
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

export default CompactFinancingSelector;