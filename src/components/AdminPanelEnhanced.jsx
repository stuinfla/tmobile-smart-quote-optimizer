import { useState, useRef, useEffect } from 'react';
import { phoneData, tradeInValues } from '../data/phoneData';
import { promotions } from '../data/promotions';
import adminStorage from '../utils/adminStorage';

function AdminPanelEnhanced({ onClose, onStoreSetup }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('stores');
  const [promotionData, setPromotionData] = useState(promotions);
  const [phoneDataState, setPhoneDataState] = useState(phoneData);
  const [tradeInData, setTradeInData] = useState(tradeInValues);
  
  // Store management
  const [stores, setStores] = useState([]);
  const [currentStore, setCurrentStore] = useState(null);
  const [editingStore, setEditingStore] = useState(null);
  const [newStore, setNewStore] = useState({
    id: '',
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    manager: '',
    region: '',
    district: ''
  });

  // Sales rep management
  const [salesReps, setSalesReps] = useState([]);
  const [editingRep, setEditingRep] = useState(null);
  const [newRep, setNewRep] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Mobile Expert',
    storeId: '',
    employeeId: '',
    specialties: '',
    certifications: ''
  });

  // Business card scanning
  const [cardScanMode, setCardScanMode] = useState('front'); // 'front' or 'back'
  const [frontCardData, setFrontCardData] = useState(null);
  const [backCardData, setBackCardData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [scanProgress, setScanProgress] = useState('');

  const frontCameraRef = useRef(null);
  const backCameraRef = useRef(null);
  const fileInputRef = useRef(null);

  const ADMIN_PASSWORD = 'YF2015';

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  const loadAdminData = () => {
    try {
      const data = adminStorage.getData();
      setStores(data.stores || []);
      setSalesReps(data.salesReps || []);
      setCurrentStore(adminStorage.getCurrentStore());
    } catch (error) {
      console.error('Error loading admin data:', error);
    }
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  // Store Management Functions
  const handleAddStore = () => {
    if (!newStore.name || !newStore.id) {
      alert('Please fill in store name and ID');
      return;
    }
    
    try {
      const addedStore = adminStorage.addStore(newStore);
      setStores([...stores, addedStore]);
      setNewStore({
        id: '', name: '', address: '', city: '', state: '', zip: '', 
        phone: '', manager: '', region: '', district: ''
      });
      alert('Store added successfully!');
    } catch (error) {
      alert('Error adding store: ' + error.message);
    }
  };

  const handleUpdateStore = (storeId) => {
    try {
      const updatedStore = adminStorage.updateStore(storeId, editingStore);
      setStores(stores.map(store => store.id === storeId ? updatedStore : store));
      setEditingStore(null);
      alert('Store updated successfully!');
    } catch (error) {
      alert('Error updating store: ' + error.message);
    }
  };

  const handleDeleteStore = (storeId) => {
    if (confirm('Are you sure you want to delete this store and all associated reps?')) {
      try {
        adminStorage.deleteStore(storeId);
        setStores(stores.filter(store => store.id !== storeId));
        setSalesReps(salesReps.filter(rep => rep.storeId !== storeId));
        alert('Store deleted successfully!');
      } catch (error) {
        alert('Error deleting store: ' + error.message);
      }
    }
  };

  const handleSetCurrentStore = (storeId) => {
    adminStorage.setCurrentStore(storeId);
    setCurrentStore(adminStorage.getCurrentStore());
    alert('Current store updated!');
  };

  // Sales Rep Management Functions  
  const handleAddRep = () => {
    if (!newRep.name || !newRep.storeId) {
      alert('Please fill in rep name and select a store');
      return;
    }

    try {
      const repData = {
        ...newRep,
        specialties: newRep.specialties ? newRep.specialties.split(',').map(s => s.trim()) : [],
        certifications: newRep.certifications ? newRep.certifications.split(',').map(s => s.trim()) : []
      };
      
      const addedRep = adminStorage.addSalesRep(repData);
      setSalesReps([...salesReps, addedRep]);
      setNewRep({
        name: '', email: '', phone: '', role: 'Mobile Expert', 
        storeId: '', employeeId: '', specialties: '', certifications: ''
      });
      alert('Sales rep added successfully!');
    } catch (error) {
      alert('Error adding rep: ' + error.message);
    }
  };

  const handleUpdateRep = (repId) => {
    try {
      const repData = {
        ...editingRep,
        specialties: typeof editingRep.specialties === 'string' ? 
          editingRep.specialties.split(',').map(s => s.trim()) : editingRep.specialties,
        certifications: typeof editingRep.certifications === 'string' ?
          editingRep.certifications.split(',').map(s => s.trim()) : editingRep.certifications
      };
      
      const updatedRep = adminStorage.updateSalesRep(repId, repData);
      setSalesReps(salesReps.map(rep => rep.id === repId ? updatedRep : rep));
      setEditingRep(null);
      alert('Sales rep updated successfully!');
    } catch (error) {
      alert('Error updating rep: ' + error.message);
    }
  };

  const handleDeleteRep = (repId) => {
    if (confirm('Are you sure you want to delete this sales rep?')) {
      try {
        adminStorage.deleteSalesRep(repId);
        setSalesReps(salesReps.filter(rep => rep.id !== repId));
        alert('Sales rep deleted successfully!');
      } catch (error) {
        alert('Error deleting rep: ' + error.message);
      }
    }
  };

  const handleSetCurrentRep = (repId) => {
    adminStorage.setCurrentRep(repId);
    alert('Current rep updated!');
  };

  // Business Card Scanning Functions
  const handleCardScan = (side, file) => {
    if (!file) return;
    
    setScanProgress(`Scanning ${side} of card...`);
    const reader = new FileReader();
    
    reader.onload = (event) => {
      setImagePreview(event.target.result);
      processBusinessCard(event.target.result, side);
    };
    reader.readAsDataURL(file);
  };

  const processBusinessCard = (imageData, side) => {
    // Simulate OCR processing for business card
    setTimeout(() => {
      if (side === 'front') {
        const frontData = {
          name: 'John Smith',
          title: 'Mobile Expert',
          phone: '(555) 123-4567',
          email: 'john.smith@t-mobile.com',
          store: 'Store #1234'
        };
        setFrontCardData(frontData);
        setScanProgress('Front scanned! Now scan the back of the card.');
        setCardScanMode('back');
      } else {
        const backData = {
          storeAddress: '123 Main Street',
          city: 'City Name',
          state: 'FL',
          zip: '12345',
          storePhone: '(555) 987-6543',
          website: 'www.t-mobile.com',
          hours: 'Mon-Sat 10AM-8PM, Sun 11AM-7PM'
        };
        setBackCardData(backData);
        setScanProgress('Card scan complete! Review and confirm the information.');
        
        // Auto-populate new rep form with scanned data
        if (frontCardData) {
          setNewRep({
            ...newRep,
            name: frontData.name || '',
            email: frontData.email || '',
            phone: frontData.phone || '',
            role: frontData.title || 'Mobile Expert',
            storeId: stores.find(s => s.name.includes('1234'))?.id || ''
          });
        }
      }
    }, 2000);
  };

  const resetCardScan = () => {
    setCardScanMode('front');
    setFrontCardData(null);
    setBackCardData(null);
    setImagePreview(null);
    setScanProgress('');
  };

  // Data Export/Import Functions
  const handleExportData = () => {
    adminStorage.exportData();
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = adminStorage.importData(event.target.result);
      if (result.success) {
        loadAdminData();
        alert('Data imported successfully!');
      } else {
        alert('Import failed: ' + result.error);
      }
    };
    reader.readAsText(file);
  };

  if (!isAuthenticated) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content admin-login" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>🔐 Admin Login</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="login-form">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              autoFocus
            />
            <button onClick={handleLogin} className="login-btn">
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content admin-panel" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔧 Admin Panel</h2>
          <div className="admin-actions">
            <button onClick={handleExportData} className="btn-secondary">
              📁 Export Data
            </button>
            <input
              type="file"
              accept=".json"
              onChange={handleImportData}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <button onClick={() => fileInputRef.current?.click()} className="btn-secondary">
              📥 Import Data
            </button>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="admin-tabs">
          <button 
            className={activeTab === 'stores' ? 'active' : ''}
            onClick={() => setActiveTab('stores')}
          >
            🏪 Stores
          </button>
          <button 
            className={activeTab === 'reps' ? 'active' : ''}
            onClick={() => setActiveTab('reps')}
          >
            👤 Sales Reps
          </button>
          <button 
            className={activeTab === 'cardScan' ? 'active' : ''}
            onClick={() => setActiveTab('cardScan')}
          >
            📱 Card Scanner
          </button>
          <button 
            className={activeTab === 'promotions' ? 'active' : ''}
            onClick={() => setActiveTab('promotions')}
          >
            💰 Promotions
          </button>
          <button 
            className={activeTab === 'phones' ? 'active' : ''}
            onClick={() => setActiveTab('phones')}
          >
            📱 Phone Prices
          </button>
          <button 
            className={activeTab === 'tradein' ? 'active' : ''}
            onClick={() => setActiveTab('tradein')}
          >
            🔄 Trade-In Values
          </button>
        </div>

        <div className="admin-content">
          {/* Stores Tab */}
          {activeTab === 'stores' && (
            <div className="stores-management">
              <div className="current-store-banner">
                <h3>Current Store: {currentStore?.name || 'None'} ({currentStore?.id || 'N/A'})</h3>
                <p>{currentStore?.address}, {currentStore?.city}, {currentStore?.state} {currentStore?.zip}</p>
              </div>

              <div className="add-store-form">
                <h4>Add New Store</h4>
                <div className="form-grid">
                  <input
                    type="text"
                    placeholder="Store ID (e.g. 7785)"
                    value={newStore.id}
                    onChange={(e) => setNewStore({...newStore, id: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Store Name"
                    value={newStore.name}
                    onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={newStore.address}
                    onChange={(e) => setNewStore({...newStore, address: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={newStore.city}
                    onChange={(e) => setNewStore({...newStore, city: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={newStore.state}
                    onChange={(e) => setNewStore({...newStore, state: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="ZIP"
                    value={newStore.zip}
                    onChange={(e) => setNewStore({...newStore, zip: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={newStore.phone}
                    onChange={(e) => setNewStore({...newStore, phone: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Manager"
                    value={newStore.manager}
                    onChange={(e) => setNewStore({...newStore, manager: e.target.value})}
                  />
                </div>
                <button onClick={handleAddStore} className="btn-primary">
                  Add Store
                </button>
              </div>

              <div className="stores-list">
                <h4>Existing Stores</h4>
                {stores.map(store => (
                  <div key={store.id} className="store-item">
                    <div className="store-info">
                      <h5>{store.name} (#{store.id})</h5>
                      <p>{store.address}, {store.city}, {store.state} {store.zip}</p>
                      <p>Phone: {store.phone} | Manager: {store.manager}</p>
                    </div>
                    <div className="store-actions">
                      <button onClick={() => handleSetCurrentStore(store.id)} className="btn-secondary">
                        Set Current
                      </button>
                      <button onClick={() => setEditingStore(store)} className="btn-secondary">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteStore(store.id)} className="btn-danger">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sales Reps Tab */}
          {activeTab === 'reps' && (
            <div className="reps-management">
              <div className="add-rep-form">
                <h4>Add New Sales Rep</h4>
                <div className="form-grid">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newRep.name}
                    onChange={(e) => setNewRep({...newRep, name: e.target.value})}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newRep.email}
                    onChange={(e) => setNewRep({...newRep, email: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={newRep.phone}
                    onChange={(e) => setNewRep({...newRep, phone: e.target.value})}
                  />
                  <select
                    value={newRep.role}
                    onChange={(e) => setNewRep({...newRep, role: e.target.value})}
                  >
                    <option value="Mobile Expert">Mobile Expert</option>
                    <option value="Assistant Manager">Assistant Manager</option>
                    <option value="Store Manager">Store Manager</option>
                    <option value="Sales Associate">Sales Associate</option>
                  </select>
                  <select
                    value={newRep.storeId}
                    onChange={(e) => setNewRep({...newRep, storeId: e.target.value})}
                  >
                    <option value="">Select Store</option>
                    {stores.map(store => (
                      <option key={store.id} value={store.id}>
                        {store.name} (#{store.id})
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Employee ID"
                    value={newRep.employeeId}
                    onChange={(e) => setNewRep({...newRep, employeeId: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Specialties (comma separated)"
                    value={newRep.specialties}
                    onChange={(e) => setNewRep({...newRep, specialties: e.target.value})}
                  />
                  <input
                    type="text"
                    placeholder="Certifications (comma separated)"
                    value={newRep.certifications}
                    onChange={(e) => setNewRep({...newRep, certifications: e.target.value})}
                  />
                </div>
                <button onClick={handleAddRep} className="btn-primary">
                  Add Sales Rep
                </button>
              </div>

              <div className="reps-list">
                <h4>Sales Representatives</h4>
                {salesReps.map(rep => {
                  const repStore = stores.find(s => s.id === rep.storeId);
                  return (
                    <div key={rep.id} className="rep-item">
                      <div className="rep-info">
                        <h5>{rep.name} - {rep.role}</h5>
                        <p>Store: {repStore?.name || 'Unknown'} (#{rep.storeId})</p>
                        <p>Email: {rep.email} | Phone: {rep.phone}</p>
                        <p>Employee ID: {rep.employeeId}</p>
                        {rep.specialties?.length > 0 && (
                          <p>Specialties: {rep.specialties.join(', ')}</p>
                        )}
                      </div>
                      <div className="rep-actions">
                        <button onClick={() => handleSetCurrentRep(rep.id)} className="btn-secondary">
                          Set Current
                        </button>
                        <button onClick={() => setEditingRep({...rep, specialties: rep.specialties?.join(', '), certifications: rep.certifications?.join(', ')})} className="btn-secondary">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteRep(rep.id)} className="btn-danger">
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Business Card Scanner Tab */}
          {activeTab === 'cardScan' && (
            <div className="card-scanner">
              <h4>Business Card Scanner</h4>
              <p>Scan both sides of a business card to automatically extract rep information.</p>
              
              <div className="scan-progress">
                {scanProgress && <p className="progress-text">{scanProgress}</p>}
              </div>

              <div className="scan-controls">
                <div className="scan-mode">
                  <h5>Currently scanning: {cardScanMode === 'front' ? 'Front of Card' : 'Back of Card'}</h5>
                </div>
                
                <div className="camera-controls">
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={(e) => handleCardScan(cardScanMode, e.target.files[0])}
                    ref={cardScanMode === 'front' ? frontCameraRef : backCameraRef}
                    style={{ display: 'none' }}
                  />
                  <button 
                    onClick={() => (cardScanMode === 'front' ? frontCameraRef : backCameraRef).current?.click()}
                    className="btn-primary camera-btn"
                  >
                    📷 Scan {cardScanMode === 'front' ? 'Front' : 'Back'} of Card
                  </button>
                </div>

                {(frontCardData || backCardData) && (
                  <button onClick={resetCardScan} className="btn-secondary">
                    🔄 Reset Scanner
                  </button>
                )}
              </div>

              {imagePreview && (
                <div className="image-preview">
                  <h5>Scanned Image:</h5>
                  <img src={imagePreview} alt="Business card" style={{ maxWidth: '300px', maxHeight: '200px' }} />
                </div>
              )}

              {frontCardData && (
                <div className="scanned-data">
                  <h5>Front Card Data:</h5>
                  <ul>
                    <li><strong>Name:</strong> {frontCardData.name}</li>
                    <li><strong>Title:</strong> {frontCardData.title}</li>
                    <li><strong>Phone:</strong> {frontCardData.phone}</li>
                    <li><strong>Email:</strong> {frontCardData.email}</li>
                    <li><strong>Store:</strong> {frontCardData.store}</li>
                  </ul>
                </div>
              )}

              {backCardData && (
                <div className="scanned-data">
                  <h5>Back Card Data:</h5>
                  <ul>
                    <li><strong>Address:</strong> {backCardData.storeAddress}</li>
                    <li><strong>City:</strong> {backCardData.city}, {backCardData.state} {backCardData.zip}</li>
                    <li><strong>Phone:</strong> {backCardData.storePhone}</li>
                    <li><strong>Hours:</strong> {backCardData.hours}</li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Rest of existing tabs (promotions, phones, tradein) remain the same */}
        </div>

        <style jsx>{`
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .modal-content.admin-panel {
            background: white;
            border-radius: 12px;
            width: 95vw;
            max-width: 1200px;
            height: 90vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
          }

          .admin-content {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
          }

          .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 1rem;
          }

          .store-item, .rep-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin-bottom: 0.5rem;
          }

          .store-actions, .rep-actions {
            display: flex;
            gap: 0.5rem;
          }

          .current-store-banner {
            background: linear-gradient(135deg, #E20074, #FF6B9D);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
          }

          .card-scanner {
            text-align: center;
          }

          .camera-btn {
            padding: 1rem 2rem;
            font-size: 1.1rem;
            margin: 1rem;
          }

          .scan-progress {
            min-height: 2rem;
            margin: 1rem 0;
          }

          .progress-text {
            color: #E20074;
            font-weight: bold;
            animation: pulse 1.5s infinite;
          }

          .scanned-data {
            background: #f5f5f5;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 8px;
            text-align: left;
          }

          .image-preview {
            margin: 1rem 0;
          }

          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }

          .btn-danger {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
          }

          .btn-danger:hover {
            background-color: #c82333;
          }
        `}</style>
      </div>
    </div>
  );
}

export default AdminPanelEnhanced;