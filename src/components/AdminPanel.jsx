import { useState, useRef } from 'react';
import { phoneData, tradeInValues } from '../data/phoneData';
import { promotions } from '../data/promotions';

function AdminPanel({ onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('promotions');
  const [promotionData, setPromotionData] = useState(promotions);
  const [phoneDataState, setPhoneDataState] = useState(phoneData);
  const [tradeInData, setTradeInData] = useState(tradeInValues);
  const [newPromotion, setNewPromotion] = useState({ name: '', description: '', value: '' });
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const ADMIN_PASSWORD = 'YF2015'; // In production, this should be hashed and stored securely

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
        // In production, use OCR to extract text from image
        processPromotionImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processPromotionImage = (imageData) => {
    // Simulate OCR processing
    // In production, you'd use an OCR API like Tesseract.js or Google Vision
    setTimeout(() => {
      alert('Promotion image processed. Review the extracted data below.');
      setNewPromotion({
        name: 'New Promotion (from image)',
        description: 'Extracted promotion details will appear here',
        value: '500'
      });
    }, 1500);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (data.promotions) {
            setPromotionData(data.promotions);
            localStorage.setItem('tmobile-promotions', JSON.stringify(data.promotions));
            alert('Promotions updated successfully');
          }
        } catch (error) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSavePromotion = () => {
    if (newPromotion.name && newPromotion.description) {
      const updatedPromotions = {
        ...promotionData,
        custom: [
          ...(promotionData.custom || []),
          {
            id: `custom_${Date.now()}`,
            ...newPromotion,
            active: true,
            dateAdded: new Date().toISOString()
          }
        ]
      };
      setPromotionData(updatedPromotions);
      localStorage.setItem('tmobile-promotions', JSON.stringify(updatedPromotions));
      setNewPromotion({ name: '', description: '', value: '' });
      setImagePreview(null);
      alert('Promotion added successfully');
    }
  };

  const handleUpdatePhonePrice = (brand, model, variant, newPrice) => {
    const updatedPhoneData = { ...phoneDataState };
    if (updatedPhoneData.phones[brand][model].variants[variant]) {
      updatedPhoneData.phones[brand][model].variants[variant] = parseFloat(newPrice);
      setPhoneDataState(updatedPhoneData);
      localStorage.setItem('tmobile-phone-prices', JSON.stringify(updatedPhoneData));
    }
  };

  const handleUpdateTradeIn = (phone, newValue) => {
    const updatedTradeIn = {
      ...tradeInData,
      [phone]: parseInt(newValue)
    };
    setTradeInData(updatedTradeIn);
    localStorage.setItem('tmobile-tradein-values', JSON.stringify(updatedTradeIn));
  };

  const exportData = () => {
    const exportObj = {
      promotions: promotionData,
      phoneData: phoneDataState,
      tradeInValues: tradeInData,
      exportDate: new Date().toISOString()
    };
    const dataStr = JSON.stringify(exportObj, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `tmobile-data-${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <div className="login-card">
          <h2>Admin Access</h2>
          <p>Enter admin password to continue</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Enter password"
            autoFocus
          />
          <div className="login-actions">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleLogin}>Login</button>
          </div>
        </div>

        <style jsx>{`
          .admin-login {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .login-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            max-width: 400px;
            width: 90%;
          }

          .login-card h2 {
            color: var(--tmobile-magenta);
            margin-bottom: 0.5rem;
          }

          .login-card p {
            color: var(--tmobile-gray);
            margin-bottom: 1.5rem;
          }

          .login-card input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid var(--tmobile-light-gray);
            border-radius: 8px;
            font-size: 1rem;
            margin-bottom: 1.5rem;
          }

          .login-card input:focus {
            outline: none;
            border-color: var(--tmobile-magenta);
          }

          .login-actions {
            display: flex;
            gap: 1rem;
            justify-content: space-between;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Panel</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab ${activeTab === 'promotions' ? 'active' : ''}`}
          onClick={() => setActiveTab('promotions')}
        >
          Promotions
        </button>
        <button 
          className={`tab ${activeTab === 'phones' ? 'active' : ''}`}
          onClick={() => setActiveTab('phones')}
        >
          Phone Prices
        </button>
        <button 
          className={`tab ${activeTab === 'tradein' ? 'active' : ''}`}
          onClick={() => setActiveTab('tradein')}
        >
          Trade-In Values
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'promotions' && (
          <div className="promotions-section">
            <h3>Manage Promotions</h3>
            
            <div className="upload-section">
              <h4>Add New Promotion</h4>
              
              <div className="capture-options">
                <button 
                  className="capture-btn"
                  onClick={() => cameraInputRef.current.click()}
                >
                  📸 Capture Promotion
                </button>
                <button 
                  className="capture-btn"
                  onClick={() => fileInputRef.current.click()}
                >
                  📄 Upload JSON
                </button>
              </div>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageCapture}
                style={{ display: 'none' }}
              />
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />

              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Captured promotion" />
                </div>
              )}

              <div className="promotion-form">
                <input
                  type="text"
                  placeholder="Promotion Name"
                  value={newPromotion.name}
                  onChange={(e) => setNewPromotion({...newPromotion, name: e.target.value})}
                />
                <textarea
                  placeholder="Promotion Description"
                  value={newPromotion.description}
                  onChange={(e) => setNewPromotion({...newPromotion, description: e.target.value})}
                  rows="3"
                />
                <input
                  type="text"
                  placeholder="Value (e.g., $500 or 50%)"
                  value={newPromotion.value}
                  onChange={(e) => setNewPromotion({...newPromotion, value: e.target.value})}
                />
                <button 
                  className="btn btn-primary"
                  onClick={handleSavePromotion}
                >
                  Save Promotion
                </button>
              </div>
            </div>

            <div className="current-promotions">
              <h4>Current Promotions</h4>
              <div className="promotion-list">
                {Object.entries(promotionData).map(([category, promos]) => (
                  <div key={category} className="promotion-category">
                    <h5>{category.replace(/_/g, ' ').toUpperCase()}</h5>
                    {Array.isArray(promos) ? (
                      promos.map((promo, idx) => (
                        <div key={idx} className="promotion-item">
                          <span>{promo.name || promo.description || promo}</span>
                        </div>
                      ))
                    ) : (
                      <div className="promotion-item">
                        <span>{JSON.stringify(promos)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'phones' && (
          <div className="phones-section">
            <h3>Update Phone Prices</h3>
            <div className="phone-list">
              {Object.entries(phoneDataState.phones).map(([brand, models]) => (
                <div key={brand} className="brand-section">
                  <h4>{brand.toUpperCase()}</h4>
                  {Object.entries(models).map(([modelKey, model]) => (
                    <div key={modelKey} className="model-section">
                      <h5>{model.name}</h5>
                      <div className="variant-list">
                        {Object.entries(model.variants).map(([variant, price]) => (
                          <div key={variant} className="variant-item">
                            <span>{variant}</span>
                            <input
                              type="number"
                              value={price}
                              onChange={(e) => handleUpdatePhonePrice(brand, modelKey, variant, e.target.value)}
                              step="0.01"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tradein' && (
          <div className="tradein-section">
            <h3>Update Trade-In Values</h3>
            <div className="tradein-list">
              {Object.entries(tradeInData).map(([phone, value]) => (
                <div key={phone} className="tradein-item">
                  <span>{phone.replace(/_/g, ' ')}</span>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleUpdateTradeIn(phone, e.target.value)}
                    step="50"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="admin-footer">
        <button className="btn btn-secondary" onClick={exportData}>
          Export All Data
        </button>
      </div>

      <style jsx>{`
        .admin-panel {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: var(--tmobile-magenta);
          color: white;
        }

        .admin-header h2 {
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 2rem;
          cursor: pointer;
        }

        .admin-tabs {
          display: flex;
          background: #f5f5f5;
          border-bottom: 2px solid var(--tmobile-light-gray);
        }

        .tab {
          flex: 1;
          padding: 1rem;
          background: none;
          border: none;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab.active {
          background: white;
          color: var(--tmobile-magenta);
          border-bottom: 3px solid var(--tmobile-magenta);
        }

        .admin-content {
          flex: 1;
          overflow-y: auto;
          padding: 1.5rem;
        }

        .upload-section {
          background: #f9f9f9;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }

        .capture-options {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .capture-btn {
          flex: 1;
          padding: 1rem;
          background: white;
          border: 2px solid var(--tmobile-magenta);
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .capture-btn:hover {
          background: var(--tmobile-magenta);
          color: white;
        }

        .image-preview {
          margin: 1rem 0;
          border-radius: 8px;
          overflow: hidden;
        }

        .image-preview img {
          width: 100%;
          max-height: 300px;
          object-fit: contain;
        }

        .promotion-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .promotion-form input,
        .promotion-form textarea {
          padding: 0.75rem;
          border: 2px solid var(--tmobile-light-gray);
          border-radius: 8px;
          font-size: 1rem;
        }

        .promotion-form input:focus,
        .promotion-form textarea:focus {
          outline: none;
          border-color: var(--tmobile-magenta);
        }

        .current-promotions {
          margin-top: 2rem;
        }

        .promotion-category {
          margin-bottom: 1.5rem;
        }

        .promotion-category h5 {
          color: var(--tmobile-magenta);
          margin-bottom: 0.5rem;
        }

        .promotion-item {
          padding: 0.5rem;
          background: #f9f9f9;
          margin-bottom: 0.25rem;
          border-radius: 4px;
        }

        .phone-list,
        .tradein-list {
          max-height: 500px;
          overflow-y: auto;
        }

        .brand-section {
          margin-bottom: 2rem;
        }

        .brand-section h4 {
          color: var(--tmobile-magenta);
          margin-bottom: 1rem;
        }

        .model-section {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .model-section h5 {
          margin-bottom: 0.75rem;
        }

        .variant-item,
        .tradein-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          margin-bottom: 0.5rem;
          background: white;
          border-radius: 4px;
        }

        .variant-item input,
        .tradein-item input {
          width: 100px;
          padding: 0.5rem;
          border: 1px solid var(--tmobile-light-gray);
          border-radius: 4px;
          text-align: right;
        }

        .admin-footer {
          padding: 1rem 1.5rem;
          background: #f5f5f5;
          border-top: 1px solid var(--tmobile-light-gray);
        }

        @media (max-width: 768px) {
          .admin-content {
            padding: 1rem;
          }

          .capture-options {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminPanel;