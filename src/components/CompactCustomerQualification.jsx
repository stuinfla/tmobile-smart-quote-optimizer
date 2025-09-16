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

    // Auto-advance after 300ms
    setTimeout(() => {
      if (onContinue) {
        onContinue();
      }
    }, 300);
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
    <div className="compact-qualification-container">
      {/* Compact header */}
      <div className="compact-header">
        <div className="progress-bar-compact">
          <div className="progress-fill-compact" style={{ width: '10%' }} />
        </div>
        <div style={{ fontSize: '0.75rem', color: '#666', textAlign: 'center', marginTop: '2px' }}>
          Step 1 of 10
        </div>
      </div>

      {/* Main content - no scroll */}
      <div className="compact-content">
        <div className="question-card-compact">
          <h2 className="question-title-compact">Customer Qualification</h2>
          <p className="question-subtitle-compact">Select for special discounts</p>
          
          <div className="qualification-grid-compact">
            {qualifications.map(qual => (
              <button
                key={qual.id}
                className={`qualification-btn-compact ${selected === qual.id ? 'selected' : ''} ${qual.default ? 'default-option' : ''}`}
                onClick={() => handleSelect(qual.id)}
              >
                <span className="qual-icon-compact">{qual.icon}</span>
                <div className="qual-content-compact">
                  <div className="qual-title-compact">{qual.title}</div>
                  <div className="qual-desc-compact">{qual.desc}</div>
                </div>
                {qual.badge && (
                  <span className="qual-badge-compact">{qual.badge}</span>
                )}
              </button>
            ))}
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

export default CompactCustomerQualification;