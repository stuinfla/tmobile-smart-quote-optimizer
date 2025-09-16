import React, { useState, useEffect } from 'react';
import '../styles/customer-qualification.css';

const CustomerQualification = ({ onQualificationUpdate, initialQualification = 'standard' }) => {
  const [selectedQualification, setSelectedQualification] = useState(initialQualification);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [showVerificationInfo, setShowVerificationInfo] = useState(false);

  const qualifications = {
    standard: {
      label: 'Standard Customer',
      description: 'Regular pricing',
      icon: '👤',
      requiresVerification: false,
      discount: '0%'
    },
    military: {
      label: 'Military',
      description: 'Active duty, veterans, and reserves',
      icon: '🎖️',
      requiresVerification: true,
      discount: '~15% off',
      verificationMethods: ['ID.me', 'SheerID', 'In-store with military ID']
    },
    firstResponder: {
      label: 'First Responder',
      description: 'Police, Fire, EMT, Dispatchers',
      icon: '🚑',
      requiresVerification: true,
      discount: '~15% off',
      verificationMethods: ['ID.me', 'SheerID', 'In-store with professional ID']
    },
    seniorPlus55: {
      label: '55+ Senior',
      description: 'Ages 55 and older (max 2 lines)',
      icon: '👴',
      requiresVerification: true,
      discount: '~15% off',
      verificationMethods: ['Age verification in-store', 'Online age verification'],
      limitations: 'Only available for 1-2 lines'
    },
    business: {
      label: 'Business Account',
      description: 'Business plans with enhanced features',
      icon: '💼',
      requiresVerification: true,
      discount: 'Special pricing',
      verificationMethods: ['Business Tax ID', 'Business License']
    }
  };

  useEffect(() => {
    if (onQualificationUpdate) {
      onQualificationUpdate({
        type: selectedQualification,
        verified: verificationStatus === 'verified' || !qualifications[selectedQualification].requiresVerification,
        details: qualifications[selectedQualification]
      });
    }
  }, [selectedQualification, verificationStatus]);

  const handleQualificationSelect = (type) => {
    setSelectedQualification(type);
    if (qualifications[type].requiresVerification) {
      setVerificationStatus('pending');
      setShowVerificationInfo(true);
    } else {
      setVerificationStatus('not_required');
      setShowVerificationInfo(false);
    }
  };

  const handleVerification = () => {
    // In production, this would trigger actual verification
    setVerificationStatus('verified');
    setShowVerificationInfo(false);
  };

  return (
    <div className="customer-qualification">
      <div className="qualification-header">
        <h3>Customer Qualification</h3>
        <p className="qualification-subtitle">
          Select if you qualify for special discounts
        </p>
      </div>

      <div className="qualification-options">
        {Object.entries(qualifications).map(([type, details]) => (
          <button
            key={type}
            className={`qualification-card ${selectedQualification === type ? 'selected' : ''}`}
            onClick={() => handleQualificationSelect(type)}
          >
            <div className="qualification-icon">{details.icon}</div>
            <div className="qualification-content">
              <div className="qualification-label">{details.label}</div>
              <div className="qualification-description">{details.description}</div>
              {details.discount && (
                <div className="qualification-discount">{details.discount}</div>
              )}
              {details.limitations && (
                <div className="qualification-limitation">{details.limitations}</div>
              )}
            </div>
            {selectedQualification === type && (
              <div className="qualification-check">✓</div>
            )}
          </button>
        ))}
      </div>

      {showVerificationInfo && qualifications[selectedQualification].requiresVerification && (
        <div className="verification-panel">
          <h4>Verification Required</h4>
          <p>To receive the {qualifications[selectedQualification].label} discount, verification is required.</p>
          
          <div className="verification-methods">
            <p>Verification methods:</p>
            <ul>
              {qualifications[selectedQualification].verificationMethods.map((method, index) => (
                <li key={index}>{method}</li>
              ))}
            </ul>
          </div>

          <div className="verification-actions">
            <button 
              className="btn-verify"
              onClick={handleVerification}
            >
              Verify Later in Store
            </button>
            <button 
              className="btn-continue"
              onClick={() => setShowVerificationInfo(false)}
            >
              Continue with Estimate
            </button>
          </div>

          {verificationStatus === 'verified' && (
            <div className="verification-success">
              ✓ Verification noted - discount will be applied
            </div>
          )}
        </div>
      )}

      <div className="qualification-note">
        <p>
          <strong>Note:</strong> Discounts shown are estimates. Final pricing will be confirmed after verification.
          {selectedQualification === 'seniorPlus55' && (
            <span> 55+ plans are limited to 2 lines maximum.</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default CustomerQualification;