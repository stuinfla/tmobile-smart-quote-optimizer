import { useState } from 'react';
import '../styles/compact-ui.css';

function CompactLinesSelector({ onLinesUpdate, initialLines, onContinue }) {
  const [selected, setSelected] = useState(initialLines || 1);

  const lineOptions = [
    { value: 1, label: 'Single', desc: 'Just for me' },
    { value: 2, label: 'Couple', desc: '2 lines', popular: true },
    { value: 3, label: 'Family', desc: '3 lines' },
    { value: 4, label: 'Family+', desc: '4+ lines' }
  ];

  const handleSelect = (lines) => {
    setSelected(lines);
    
    // Create device array
    const devices = Array(lines).fill().map(() => ({ 
      currentPhone: '', 
      newPhone: '', 
      storage: '', 
      insurance: false 
    }));
    
    // Update parent
    onLinesUpdate({
      lines,
      devices
    });

    // Auto-advance after 300ms
    setTimeout(() => {
      if (onContinue) {
        onContinue();
      }
    }, 300);
  };

  const handleCustomLines = (num) => {
    if (num >= 1 && num <= 10) {
      handleSelect(num);
    }
  };

  return (
    <div className="compact-qualification-container">
      {/* Compact header */}
      <div className="compact-header" style={{ position: 'relative' }}>
        <div className="progress-bar-compact">
          <div className="progress-fill-compact" style={{ width: '20%' }} />
        </div>
        <div style={{ fontSize: '0.75rem', color: '#666', textAlign: 'center', marginTop: '2px' }}>
          Step 2 of 10
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
          <h2 className="question-title-compact">How many phone lines?</h2>
          <p className="question-subtitle-compact">Select the number of lines you need</p>
          
          {/* Quick options */}
          <div className="options-grid-compact">
            {lineOptions.map(option => (
              <button
                key={option.value}
                className={`option-btn-compact ${selected === option.value ? 'selected' : ''} ${option.popular ? 'popular' : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                <div className="option-icon-compact">
                  {option.value === 1 && '👤'}
                  {option.value === 2 && '👥'}
                  {option.value === 3 && '👨‍👩‍👦'}
                  {option.value === 4 && '👨‍👩‍👦‍👦'}
                </div>
                <div className="option-title-compact">{option.label}</div>
                <div className="option-desc-compact">{option.desc}</div>
                {option.popular && (
                  <span className="option-badge-compact">Popular</span>
                )}
              </button>
            ))}
          </div>

          {/* Custom number selector */}
          <div className="custom-lines-compact">
            <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>
              Or select specific number:
            </p>
            <div className="lines-selector-compact">
              {[1, 2, 3, 4, 5, 6, 7].map(num => (
                <button
                  key={num}
                  className={`line-number-btn ${selected === num ? 'selected' : ''}`}
                  onClick={() => handleCustomLines(num)}
                >
                  {num}
                </button>
              ))}
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

export default CompactLinesSelector;