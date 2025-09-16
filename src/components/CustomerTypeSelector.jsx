import React from 'react';
import './CustomerTypeSelector.css';

const CustomerTypeSelector = ({ onSelect }) => {
  return (
    <div className="customer-type-container">
      <div className="customer-type-header">
        <h2 className="welcome-title">Welcome to T-Mobile!</h2>
        <p className="welcome-subtitle">Are you a current T-Mobile customer?</p>
      </div>
      
      <div className="customer-type-buttons">
        <button
          onClick={() => onSelect('existing')}
          className="customer-type-button existing-customer"
        >
          <div className="button-icon">✅</div>
          <div className="button-text">
            <div className="button-title">Yes, I'm a Customer</div>
            <div className="button-subtitle">I currently have T-Mobile service</div>
          </div>
        </button>
        
        <button
          onClick={() => onSelect('new')}
          className="customer-type-button new-customer"
        >
          <div className="button-icon">🆕</div>
          <div className="button-text">
            <div className="button-title">No, I'm New</div>
            <div className="button-subtitle">I want to switch to T-Mobile</div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default CustomerTypeSelector;