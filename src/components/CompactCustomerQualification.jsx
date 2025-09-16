import { useState, useEffect } from 'react';
import '../styles/compact-ui.css';

function CompactCustomerQualification({ onQualificationUpdate, initialQualification, onContinue }) {
  const [selected, setSelected] = useState(initialQualification || 'standard');

  const qualifications = [
    {
      id: 'standard',
      icon: '👤',
      title: 'Standard',
      desc: 'Regular pricing',
      badge: null,
      default: true
    },
    {
      id: 'military',
      icon: '🎖️',
      title: 'Military',
      desc: 'Active/Veteran',
      badge: '~15% off'
    },
    {
      id: 'firstResponder',
      icon: '🚑',
      title: 'First Responder',
      desc: 'Police/Fire/EMT',
      badge: '~15% off'
    },
    {
      id: 'senior',
      icon: '👴',
      title: '55+ Senior',
      desc: 'Max 2 lines',
      badge: '~15% off'
    },
    {
      id: 'business',
      icon: '💼',
      title: 'Business',
      desc: 'Enhanced features',
      badge: 'Special'
    }
  ];

  const handleSelect = (qualId) => {
    setSelected(qualId);
    
    const qualification = qualifications.find(q => q.id === qualId);
    
    // Update parent with qualification details
    onQualificationUpdate({
      type: qualId,
      name: qualification.title,
      discount: qualification.badge,
      description: qualification.desc
    });

    // Update state only - let flow controller handle advancement
  };

  useEffect(() => {
    // Set initial qualification
    if (initialQualification) {
      const qual = qualifications.find(q => q.id === initialQualification);
      if (qual) {
        onQualificationUpdate({
          type: initialQualification,
          name: qual.title,
          discount: qual.badge,
          description: qual.desc
        });
      }
    }
  }, []);

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
      {/* Compact header */}
      <div style={{
        background: 'white',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        padding: '0.5rem',
        zIndex: 1000,
        position: 'relative'
      }}>
        <div style={{
          height: '3px',
          background: '#e0e0e0',
          marginBottom: '0.5rem'
        }}>
          <div style={{
            height: '100%',
            background: '#e20074',
            width: '10%',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{ fontSize: '0.75rem', color: '#666', textAlign: 'center', marginTop: '2px' }}>
          Step 1 of 10
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

      {/* Main content - properly sized */}
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
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: 600,
            marginBottom: '0.5rem',
            color: '#333'
          }}>Customer Qualification</h2>
          <p style={{
            fontSize: '0.85rem',
            color: '#666',
            marginBottom: '1rem'
          }}>Select for special discounts</p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '0.4rem',
            flex: 1
          }}>
            {qualifications.map(qual => (
              <button
                key={qual.id}
                onClick={() => handleSelect(qual.id)}
                style={{
                  background: selected === qual.id ? 'rgba(226, 0, 116, 0.05)' : 'white',
                  border: `2px solid ${selected === qual.id ? '#e20074' : '#e0e0e0'}`,
                  borderRadius: '8px',
                  padding: '0.45rem 0.7rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.7rem',
                  position: 'relative',
                  minHeight: '50px'
                }}
              >
                <span style={{
                  fontSize: '1.25rem',
                  width: '30px',
                  textAlign: 'center'
                }}>{qual.icon}</span>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#333',
                    marginBottom: '0.125rem'
                  }}>{qual.title}</div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: '#666'
                  }}>{qual.desc}</div>
                </div>
                {qual.badge && (
                  <span style={{
                    background: '#e20074',
                    color: 'white',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '10px',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  }}>{qual.badge}</span>
                )}
                {selected === qual.id && (
                  <span style={{
                    position: 'absolute',
                    right: '0.75rem',
                    width: '20px',
                    height: '20px',
                    background: '#e20074',
                    color: 'white',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Auto-advance indicator */}
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

export default CompactCustomerQualification;