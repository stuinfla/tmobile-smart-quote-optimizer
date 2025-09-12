import { useState, useEffect } from 'react';
import { StoreManager, sampleStoreData } from '../data/storeData';

function StoreSetup({ onComplete }) {
  const [storeData, setStoreData] = useState({
    storeId: '',
    storeName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    manager: ''
  });

  useEffect(() => {
    // Load existing store data if available
    const existing = StoreManager.getStore();
    if (existing.storeId) {
      setStoreData(existing);
    }
  }, []);

  const handleChange = (field, value) => {
    setStoreData({
      ...storeData,
      [field]: value
    });
  };

  const handleSave = () => {
    StoreManager.setStore(storeData);
    if (onComplete) {
      onComplete(storeData);
    }
  };

  const loadSampleData = () => {
    setStoreData(sampleStoreData);
  };

  const isValid = storeData.storeId && storeData.address && storeData.phone;

  return (
    <div className="store-setup">
      <div className="setup-header">
        <svg className="logo" viewBox="0 0 100 40" fill="currentColor">
          <text x="0" y="30" fontFamily="Arial Black" fontSize="24" fontWeight="bold">T</text>
          <rect x="25" y="10" width="4" height="20" />
          <rect x="20" y="15" width="14" height="4" />
        </svg>
        <h1>Store Setup</h1>
        <p>Configure your T-Mobile store information</p>
      </div>

      <div className="setup-form">
        <div className="form-row">
          <div className="form-group">
            <label>Store ID *</label>
            <input
              type="text"
              value={storeData.storeId}
              onChange={(e) => handleChange('storeId', e.target.value)}
              placeholder="e.g., 7785"
            />
          </div>
          
          <div className="form-group">
            <label>Store Name</label>
            <input
              type="text"
              value={storeData.storeName}
              onChange={(e) => handleChange('storeName', e.target.value)}
              placeholder="T-Mobile Delray Beach"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Street Address *</label>
          <input
            type="text"
            value={storeData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="1821 S Federal Hwy Ste 202"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={storeData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="Delray Beach"
            />
          </div>
          
          <div className="form-group" style={{maxWidth: '100px'}}>
            <label>State</label>
            <input
              type="text"
              value={storeData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              placeholder="FL"
              maxLength="2"
            />
          </div>
          
          <div className="form-group" style={{maxWidth: '120px'}}>
            <label>ZIP</label>
            <input
              type="text"
              value={storeData.zip}
              onChange={(e) => handleChange('zip', e.target.value)}
              placeholder="33483"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Store Phone *</label>
            <input
              type="tel"
              value={storeData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="561.330.6211"
            />
          </div>
          
          <div className="form-group">
            <label>Manager Name</label>
            <input
              type="text"
              value={storeData.manager}
              onChange={(e) => handleChange('manager', e.target.value)}
              placeholder="Store Manager"
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            className="btn btn-secondary"
            onClick={loadSampleData}
          >
            Load Sample Data
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleSave}
            disabled={!isValid}
          >
            Save Store Info
          </button>
        </div>
      </div>

      <style jsx>{`
        .store-setup {
          max-width: 600px;
          margin: 2rem auto;
          padding: 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: var(--shadow-lg);
        }

        .setup-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .setup-header .logo {
          width: 60px;
          height: 40px;
          color: var(--tmobile-magenta);
          margin-bottom: 1rem;
        }

        .setup-header h1 {
          color: var(--tmobile-magenta);
          margin-bottom: 0.5rem;
        }

        .setup-header p {
          color: var(--tmobile-gray);
          font-size: 0.9rem;
        }

        .setup-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: flex;
          gap: 1rem;
        }

        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-size: 0.875rem;
          color: var(--tmobile-gray);
          margin-bottom: 0.25rem;
          font-weight: 500;
        }

        .form-group input {
          padding: 0.75rem;
          border: 2px solid var(--tmobile-light-gray);
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: var(--tmobile-magenta);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: space-between;
          margin-top: 1rem;
        }

        @media (max-width: 600px) {
          .form-row {
            flex-direction: column;
          }
          
          .store-setup {
            margin: 1rem;
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export default StoreSetup;