import { useState } from 'react';
import '../styles/compact-ui.css';

function CompactLinesSelector({ onLinesUpdate, initialLines, onContinue, onBack }) {
  const [selected, setSelected] = useState(initialLines || null);

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

    // Update parent state only - let flow controller handle advancement
  };

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
      {/* Header with progress */}
      <div style={{
        background: 'white',
        padding: '1rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.5rem'
        }}>
          {/* Back button */}
          {onBack && (
            <button
              onClick={onBack}
              style={{
                padding: '0.5rem',
                background: 'transparent',
                border: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
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
            Step 2 of 10
          </div>
        </div>
        <div style={{
          height: '3px',
          background: '#e0e0e0',
          borderRadius: '3px'
        }}>
          <div style={{
            height: '100%',
            background: '#e20074',
            width: '20%',
            borderRadius: '3px',
            transition: 'width 0.3s'
          }} />
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        padding: '1.5rem',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            textAlign: 'center',
            color: '#333'
          }}>
            How many phone lines?
          </h2>
          <p style={{
            fontSize: '0.9rem',
            color: '#666',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            Select the number of lines you need
          </p>
          
          {/* Big buttons for 1-7 lines */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
            marginBottom: '1rem'
          }}>
            {[1, 2, 3, 4, 5, 6, 7].map(num => (
              <button
                key={num}
                onClick={() => handleSelect(num)}
                style={{
                  aspectRatio: '1',
                  background: selected === num ? '#e20074' : 'white',
                  border: selected === num ? '3px solid #e20074' : '2px solid #e0e0e0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.75rem',
                  position: 'relative'
                }}
              >
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: selected === num ? 'white' : '#333'
                }}>
                  {num}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: selected === num ? 'white' : '#666',
                  marginTop: '0.25rem'
                }}>
                  {num === 1 && 'Just me'}
                  {num === 2 && 'Couple'}
                  {num === 3 && 'Family'}
                  {num === 4 && 'Family+'}
                  {num >= 5 && 'lines'}
                </div>
                {num === 2 && (
                  <span style={{
                    position: 'absolute',
                    top: '-0.5rem',
                    right: '-0.5rem',
                    background: '#22c55e',
                    color: 'white',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '12px',
                    fontSize: '0.65rem',
                    fontWeight: 'bold'
                  }}>
                    Popular
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* More lines option */}
          <div style={{
            textAlign: 'center',
            marginTop: '1rem'
          }}>
            <button
              onClick={() => handleSelect(8)}
              style={{
                padding: '0.75rem 1.5rem',
                background: selected === 8 ? '#e20074' : 'white',
                color: selected === 8 ? 'white' : '#e20074',
                border: '2px solid #e20074',
                borderRadius: '25px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Need more than 7 lines?
            </button>
          </div>
        </div>

        {/* Continue button when selection made */}
        {selected && (
          <div style={{
            marginTop: '1rem',
            textAlign: 'center'
          }}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onContinue) onContinue();
              }}
              style={{
                background: '#e20074',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(226, 0, 116, 0.3)',
                transition: 'all 0.2s ease'
              }}
            >
              Continue with {selected} {selected === 1 ? 'line' : 'lines'} →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompactLinesSelector;