import React, { useState, useEffect } from 'react';
import './CustomerTypeSelector.css';

const CustomerTypeSelector = ({ onSelect }) => {
  const [customerStatus, setCustomerStatus] = useState(null);
  const [discountCategory, setDiscountCategory] = useState(null);

  const handleCustomerStatusChange = (status) => {
    setCustomerStatus(status);
    // Clear discount category when changing customer status
    setDiscountCategory(null);
  };

  const handleComplete = (e) => {
    // Prevent any default behavior
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (customerStatus && discountCategory) {
      if (typeof onSelect === 'function') {
        // Use setTimeout to ensure Safari handles this properly
        setTimeout(() => {
          onSelect({
            type: customerStatus,
            category: discountCategory
          });
        }, 0);
      }
    }
  };

  // Auto-advance when both selections are made
  useEffect(() => {
    if (customerStatus && discountCategory) {
      setTimeout(() => {
        handleComplete();
      }, 800); // Brief delay to show completion
    }
  }, [customerStatus, discountCategory]);

  const discountCategories = [
    { id: 'consumer', label: 'Standard Consumer', icon: '👤' },
    { id: 'senior', label: '55+ Senior', icon: '👴', discount: '15% off' },
    { id: 'military', label: 'Military/Veteran', icon: '🎖️', discount: '40% off lines 2-6' },
    { id: 'firstresponder', label: 'First Responder', icon: '🚑', discount: '40% off lines 2-6' },
    { id: 'teacher', label: 'Teacher/Education', icon: '📚', discount: 'Special pricing' },
    { id: 'business', label: 'Business', icon: '💼', discount: 'Business rates' }
  ];

  return (
    <div className="customer-type-container">
      <div className="customer-type-header">
        <h2 className="welcome-title">Welcome to T-Mobile!</h2>
        <p className="welcome-subtitle">Let's get you the best deal</p>
      </div>
      
      {/* Customer Status Section */}
      <div className="section-group">
        <h3 className="section-label">Are you a current T-Mobile customer?</h3>
        <div className="customer-type-buttons">
          <button
            onClick={() => handleCustomerStatusChange('existing')}
            className={`customer-type-button ${customerStatus === 'existing' ? 'selected' : ''}`}
            type="button"
          >
            <div className="button-icon">✅</div>
            <div className="button-text">
              <div className="button-title">Yes, I'm a Customer</div>
              <div className="button-subtitle">I currently have T-Mobile service</div>
            </div>
          </button>
          
          <button
            onClick={() => handleCustomerStatusChange('new')}
            className={`customer-type-button ${customerStatus === 'new' ? 'selected' : ''}`}
            type="button"
          >
            <div className="button-icon">🆕</div>
            <div className="button-text">
              <div className="button-title">No, I'm New</div>
              <div className="button-subtitle">I want to switch to T-Mobile</div>
            </div>
          </button>
        </div>
      </div>

      {/* Discount Category Section */}
      {customerStatus && (
        <div className="section-group discount-section">
          <h3 className="section-label">Which category applies to you?</h3>
          <div className="discount-grid">
            {discountCategories.map((cat, index) => (
              <button
                key={cat.id}
                onClick={() => {
                  console.log('Clicking category:', cat.id);
                  setDiscountCategory(cat.id);
                }}
                className={`discount-button ${discountCategory === cat.id ? 'selected' : ''}`}
                type="button"
                style={{ zIndex: 10 - index }} // Prevent overlap issues
              >
                <span className="discount-icon">{cat.icon}</span>
                <span className="discount-label">{cat.label}</span>
                {cat.discount && (
                  <span className="discount-amount">{cat.discount}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Auto-advance when complete */}
      {customerStatus && discountCategory && (
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
};

export default CustomerTypeSelector;