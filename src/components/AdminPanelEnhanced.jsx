import { useState, useRef, useEffect } from 'react';
import { phoneData, tradeInValues } from '../data/phoneData';
import { promotions } from '../data/promotions';
import { monthlyPrograms, programCategories, defaultActivePrograms } from '../data/monthlyPrograms';
import adminStorage from '../utils/adminStorage';

function AdminPanelEnhanced({ onClose, onStoreSetup }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('stores');
  const [promotionData, setPromotionData] = useState(promotions);
  const [phoneDataState, setPhoneDataState] = useState(phoneData);
  const [tradeInData, setTradeInData] = useState(tradeInValues);
  
  // Programs management
  const [activePrograms, setActivePrograms] = useState(defaultActivePrograms);
  const [programSettings, setProgramSettings] = useState({});
  
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
  const photoInputRef = useRef(null);

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

  // PDF Upload and Promotion Management Functions
  const handlePdfUpload = (file) => {
    if (!file || file.type !== 'application/pdf') {
      alert('Please select a valid PDF file');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      alert('File size too large. Please select a PDF under 50MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
      setScanProgress('PDF uploaded successfully. Click "Extract Promotions" to analyze.');
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = (file) => {
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPG, PNG, or HEIC)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit for images
      alert('Image size too large. Please select an image under 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
      setScanProgress('Image uploaded successfully. Click "Extract Promotions" to analyze.');
    };
    reader.readAsDataURL(file);
  };

  const processPdfPromotions = (pdfData) => {
    setScanProgress('Processing PDF for promotions...');
    
    // Simulate PDF processing - in production, you'd use a PDF parsing library or API
    setTimeout(() => {
      const extractedPromotions = {
        'keep_switch_2025': {
          name: 'Keep & Switch 2025',
          description: 'Get up to $650 when you switch to T-Mobile and keep your current phone',
          value: '650',
          expiry: '2025-03-31',
          eligibility: 'New customers switching from Verizon, AT&T, or other eligible carriers'
        },
        'trade_in_boost_2025': {
          name: 'Trade-In Boost Special',
          description: 'Get enhanced trade-in values up to $1000 for qualifying devices',
          value: '1000',
          expiry: '2025-02-28',
          eligibility: 'Qualifying iPhone 12 or newer, Galaxy S21 or newer'
        },
        'family_four_lines': {
          name: 'Family of 4 Special',
          description: 'Four lines of Experience More for $140/month with AutoPay',
          value: '240',
          expiry: '2025-06-30',
          eligibility: 'New customers, 4 lines required, AutoPay discount applied'
        }
      };

      setPromotionData({ ...promotionData, ...extractedPromotions });
      setScanProgress('PDF processed successfully! Found promotions have been added.');
      
      setTimeout(() => {
        setScanProgress('');
      }, 3000);
    }, 2000);
  };

  const addManualPromotion = () => {
    if (!newPromotion.name || !newPromotion.value) {
      alert('Please fill in promotion name and value');
      return;
    }

    const promotionId = newPromotion.name.toLowerCase().replace(/\s+/g, '_');
    const newPromo = {
      name: newPromotion.name,
      description: newPromotion.description,
      value: newPromotion.value,
      expiry: newPromotion.expiry,
      eligibility: newPromotion.eligibility
    };

    setPromotionData({ ...promotionData, [promotionId]: newPromo });
    setNewPromotion({ name: '', description: '', value: '', expiry: '', eligibility: '' });
    alert('Promotion added successfully!');
  };

  const deletePromotion = (promotionId) => {
    if (confirm('Are you sure you want to delete this promotion?')) {
      const updatedPromotions = { ...promotionData };
      delete updatedPromotions[promotionId];
      setPromotionData(updatedPromotions);
    }
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
              className="password-input"
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
            className={activeTab === 'programs' ? 'active' : ''}
            onClick={() => setActiveTab('programs')}
          >
            📋 Programs
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

              <div className="add-store-form admin-form">
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
              <div className="add-rep-form admin-form">
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

          {/* Promotions Management Tab */}
          {activeTab === 'promotions' && (
            <div className="promotions-management">
              <h4>💰 Promotions & Offers Management</h4>
              <p>Upload promotion PDFs and manage current offers for your store.</p>
              
              <>
                <div className="upload-section">
                <h5>📄 Upload Promotions</h5>
                
                <div className="upload-options">
                  <div className="upload-option">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handlePdfUpload(e.target.files[0])}
                      style={{ display: 'none' }}
                      ref={fileInputRef}
                    />
                    <div 
                      className="upload-dropzone"
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file && file.type === 'application/pdf') {
                          handlePdfUpload(file);
                        }
                      }}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <div className="upload-icon">📄</div>
                      <h3>Upload PDF</h3>
                      <p>Click to browse or drag PDF</p>
                      <div className="upload-formats">
                        PDF files up to 50MB
                      </div>
                    </div>
                  </div>
                  
                  <div className="upload-option">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(e) => handlePhotoUpload(e.target.files[0])}
                      style={{ display: 'none' }}
                      ref={photoInputRef}
                    />
                    <div 
                      className="upload-dropzone camera-zone"
                      onClick={() => photoInputRef.current?.click()}
                    >
                      <div className="upload-icon">📷</div>
                      <h3>Take Photo</h3>
                      <p>Camera capture or upload image</p>
                      <div className="upload-formats">
                        JPG, PNG, HEIC formats
                      </div>
                    </div>
                  </div>
                </div>
                
                {imagePreview && (
                  <div className="file-preview">
                    <h5>📖 File Preview</h5>
                    <div className="preview-container">
                      {imagePreview.startsWith('data:application/pdf') ? (
                        <embed src={imagePreview} type="application/pdf" width="100%" height="400px" />
                      ) : (
                        <img src={imagePreview} alt="Promotion preview" style={{maxWidth: '100%', maxHeight: '400px', objectFit: 'contain'}} />
                      )}
                    </div>
                    <div className="preview-actions">
                      <button onClick={() => processPdfPromotions(imagePreview)} className="btn-primary">
                        📊 Extract Promotions
                      </button>
                      <button onClick={() => setImagePreview(null)} className="btn-secondary">
                        🗑️ Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="current-promotions">
                <h5>🎯 Current Promotions</h5>
                <div className="promotions-grid">
                  {Object.entries(promotionData).map(([key, promotion]) => (
                    <div key={key} className="promotion-card">
                      <div className="promotion-header">
                        <h6>{promotion.name || key}</h6>
                        <div className="promotion-actions">
                          <button 
                            onClick={() => setEditingPromotion(key)}
                            className="btn-small btn-secondary"
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => deletePromotion(key)}
                            className="btn-small btn-danger"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="promotion-details">
                        <p className="promotion-description">
                          {promotion.description || 'No description available'}
                        </p>
                        <div className="promotion-value">
                          <strong>Value:</strong> ${promotion.value || 0}
                        </div>
                        {promotion.expiry && (
                          <div className="promotion-expiry">
                            <strong>Expires:</strong> {promotion.expiry}
                          </div>
                        )}
                        {promotion.eligibility && (
                          <div className="promotion-eligibility">
                            <strong>Eligibility:</strong> {promotion.eligibility}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {Object.keys(promotionData).length === 0 && (
                  <div className="no-promotions">
                    <p>No promotions currently loaded. Upload a PDF to get started!</p>
                  </div>
                )}
              </div>
              
              <div className="manual-promotion">
                <h5>➕ Add Manual Promotion</h5>
                <div className="promotion-form">
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Promotion Name"
                      value={newPromotion.name}
                      onChange={(e) => setNewPromotion({...newPromotion, name: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Value (e.g., 500)"
                      value={newPromotion.value}
                      onChange={(e) => setNewPromotion({...newPromotion, value: e.target.value})}
                    />
                  </div>
                  <textarea
                    placeholder="Promotion Description"
                    value={newPromotion.description}
                    onChange={(e) => setNewPromotion({...newPromotion, description: e.target.value})}
                    rows="3"
                  />
                  <div className="form-row">
                    <input
                      type="date"
                      placeholder="Expiry Date"
                      value={newPromotion.expiry}
                      onChange={(e) => setNewPromotion({...newPromotion, expiry: e.target.value})}
                    />
                    <input
                      type="text"
                      placeholder="Eligibility Requirements"
                      value={newPromotion.eligibility}
                      onChange={(e) => setNewPromotion({...newPromotion, eligibility: e.target.value})}
                    />
                  </div>
                  <button onClick={addManualPromotion} className="btn-primary">
                    💰 Add Promotion
                  </button>
                </div>
              </div>
              </>
            </div>
          )}

          {/* Programs Management Tab */}
          {activeTab === 'programs' && (
            <div className="programs-management">
              <h4>📋 T-Mobile Monthly Programs</h4>
              <p>Select which T-Mobile programs are available for your store. These will be offered as options during quote calculations.</p>
              
              <div className="programs-grid">
                {Object.entries(programCategories).map(([category, programIds]) => (
                  <div key={category} className="program-category">
                    <h5 className="category-title">
                      {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')} Programs
                    </h5>
                    
                    <div className="category-programs">
                      {programIds.map(programId => {
                        const program = monthlyPrograms[programId];
                        if (!program) return null;
                        
                        const isActive = activePrograms.includes(programId);
                        
                        return (
                          <div key={programId} className={`program-item ${isActive ? 'active' : ''}`}>
                            <div className="program-header">
                              <label className="program-toggle">
                                <input
                                  type="checkbox"
                                  checked={isActive}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setActivePrograms([...activePrograms, programId]);
                                    } else {
                                      setActivePrograms(activePrograms.filter(id => id !== programId));
                                    }
                                  }}
                                />
                                <span className="program-name">{program.name}</span>
                              </label>
                              
                              {!program.activeProgram && (
                                <span className="status-badge inactive">Inactive</span>
                              )}
                              {program.validUntil && (
                                <span className="status-badge expires">
                                  Expires: {new Date(program.validUntil).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            
                            <p className="program-description">{program.description}</p>
                            
                            <div className="program-benefits">
                              <div className="benefits-grid">
                                {program.benefits.payoffAmount > 0 && (
                                  <div className="benefit-item">
                                    <span className="benefit-icon">💰</span>
                                    <span className="benefit-text">Up to ${program.benefits.payoffAmount.toLocaleString()} device payoff</span>
                                  </div>
                                )}
                                {program.benefits.tradeinCredit > 0 && (
                                  <div className="benefit-item">
                                    <span className="benefit-icon">📱</span>
                                    <span className="benefit-text">${program.benefits.tradeinCredit} trade-in credit</span>
                                  </div>
                                )}
                                {program.benefits.planDiscount > 0 && (
                                  <div className="benefit-item">
                                    <span className="benefit-icon">📅</span>
                                    <span className="benefit-text">${program.benefits.planDiscount}/mo per line discount</span>
                                  </div>
                                )}
                                {program.benefits.activationWaiver && (
                                  <div className="benefit-item">
                                    <span className="benefit-icon">✅</span>
                                    <span className="benefit-text">Activation fees waived</span>
                                  </div>
                                )}
                              </div>
                              
                              {program.eligibility && (
                                <div className="eligibility-info">
                                  <strong>Eligibility:</strong> {program.eligibility}
                                </div>
                              )}
                              
                              {program.eligibleCarriers && (
                                <div className="eligible-carriers">
                                  <strong>Eligible Carriers:</strong> {program.eligibleCarriers.join(', ')}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="programs-summary">
                <div className="summary-stats">
                  <div className="stat-item">
                    <span className="stat-number">{activePrograms.length}</span>
                    <span className="stat-label">Active Programs</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{Object.keys(monthlyPrograms).length}</span>
                    <span className="stat-label">Total Available</span>
                  </div>
                </div>
                
                <div className="programs-actions">
                  <button 
                    onClick={() => setActivePrograms(Object.keys(monthlyPrograms))}
                    className="btn-secondary"
                  >
                    Enable All Programs
                  </button>
                  <button 
                    onClick={() => setActivePrograms(defaultActivePrograms)}
                    className="btn-secondary"
                  >
                    Reset to Defaults
                  </button>
                  <button 
                    onClick={() => setActivePrograms([])}
                    className="btn-secondary"
                  >
                    Disable All Programs
                  </button>
                </div>
              </div>
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

          /* Programs Management Styles */
          .programs-management {
            max-height: 70vh;
            overflow-y: auto;
          }

          .programs-grid {
            display: grid;
            gap: 2rem;
            margin: 1.5rem 0;
          }

          .program-category {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 1.5rem;
            background: #f9f9f9;
          }

          .category-title {
            margin: 0 0 1rem 0;
            color: var(--tmobile-magenta);
            font-size: 1.1rem;
            border-bottom: 2px solid var(--tmobile-magenta);
            padding-bottom: 0.5rem;
          }

          .category-programs {
            display: grid;
            gap: 1rem;
          }

          .program-item {
            background: white;
            border: 2px solid #eee;
            border-radius: 8px;
            padding: 1rem;
            transition: all 0.2s;
          }

          .program-item.active {
            border-color: var(--tmobile-magenta);
            background: rgba(226, 0, 116, 0.02);
          }

          .program-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
          }

          .program-toggle {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            font-weight: 600;
          }

          .program-name {
            color: var(--tmobile-magenta);
          }

          .status-badge {
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: bold;
            text-transform: uppercase;
          }

          .status-badge.inactive {
            background: #ffa500;
            color: white;
          }

          .status-badge.expires {
            background: #dc3545;
            color: white;
          }

          .program-description {
            margin: 0 0 1rem 0;
            color: #666;
            font-size: 0.9rem;
            line-height: 1.4;
          }

          .program-benefits {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 6px;
          }

          .benefits-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 0.5rem;
            margin-bottom: 0.5rem;
          }

          .benefit-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.8rem;
          }

          .benefit-icon {
            font-size: 1rem;
          }

          .benefit-text {
            color: #333;
          }

          .eligibility-info,
          .eligible-carriers {
            margin-top: 0.5rem;
            font-size: 0.8rem;
            color: #666;
            padding-top: 0.5rem;
            border-top: 1px solid #eee;
          }

          .programs-summary {
            margin-top: 2rem;
            padding: 1.5rem;
            background: linear-gradient(135deg, rgba(226, 0, 116, 0.1), rgba(226, 0, 116, 0.05));
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .summary-stats {
            display: flex;
            gap: 2rem;
          }

          .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .stat-number {
            font-size: 2rem;
            font-weight: bold;
            color: var(--tmobile-magenta);
          }

          .stat-label {
            font-size: 0.8rem;
            color: #666;
            text-transform: uppercase;
          }

          .programs-actions {
            display: flex;
            gap: 0.5rem;
          }

          @media (max-width: 768px) {
            .programs-summary {
              flex-direction: column;
              gap: 1rem;
            }

            .programs-actions {
              flex-wrap: wrap;
            }

            .benefits-grid {
              grid-template-columns: 1fr;
            }
          }

          /* Promotions Management Styles */
          .promotions-upload-section {
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          .upload-header {
            margin-bottom: 1rem;
          }

          .upload-header h4 {
            margin: 0 0 0.5rem 0;
            color: var(--tmobile-magenta);
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .upload-area {
            border: 2px dashed #ddd;
            border-radius: 8px;
            padding: 2rem;
            text-align: center;
            transition: all 0.3s ease;
            cursor: pointer;
          }

          .upload-area:hover,
          .upload-area.drag-over {
            border-color: var(--tmobile-magenta);
            background: rgba(226, 0, 116, 0.05);
          }

          .upload-icon {
            font-size: 3rem;
            color: #ccc;
            margin-bottom: 1rem;
          }

          .upload-text {
            color: #666;
            margin-bottom: 0.5rem;
          }

          .upload-subtext {
            font-size: 0.8rem;
            color: #999;
          }

          .file-input {
            display: none;
          }

          .pdf-preview {
            margin-top: 1rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
          }

          .pdf-preview h5 {
            margin: 0 0 1rem 0;
            color: var(--tmobile-magenta);
          }

          .pdf-embed {
            width: 100%;
            height: 400px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 1rem;
          }

          .pdf-actions {
            display: flex;
            gap: 0.5rem;
            justify-content: flex-end;
          }

          .extracted-promotions {
            background: white;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          .promotions-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }

          .promotions-header h4 {
            margin: 0;
            color: var(--tmobile-magenta);
          }

          .promotions-grid {
            display: grid;
            gap: 1rem;
            margin-bottom: 1rem;
          }

          .promotion-card {
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 1rem;
            background: #fafafa;
          }

          .promotion-card h5 {
            margin: 0 0 0.5rem 0;
            color: var(--tmobile-magenta);
            font-size: 1rem;
          }

          .promotion-card .description {
            color: #666;
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
          }

          .promotion-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.8rem;
            color: #888;
          }

          .promotion-actions {
            display: flex;
            gap: 0.5rem;
          }

          .manual-promotion-form {
            background: #f8f9fa;
            padding: 1rem;
            border-radius: 8px;
            margin-top: 1rem;
          }

          .form-group {
            margin-bottom: 1rem;
          }

          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #333;
          }

          .form-group input,
          .form-group textarea,
          .form-group select {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 0.9rem;
          }

          .form-group textarea {
            min-height: 80px;
            resize: vertical;
          }

          .form-actions {
            display: flex;
            gap: 0.5rem;
            justify-content: flex-end;
          }

          .btn-secondary {
            background: #6c757d;
            color: white;
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
          }

          .btn-secondary:hover {
            background: #5a6268;
          }

          .btn-danger {
            background: #dc3545;
            color: white;
            border: none;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.8rem;
          }

          .btn-danger:hover {
            background: #c82333;
          }

          /* Upload Options Layout */
          .upload-options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1.5rem;
          }

          .upload-option {
            display: flex;
            flex-direction: column;
          }

          .upload-dropzone.camera-zone {
            background: linear-gradient(135deg, rgba(0, 123, 255, 0.1), rgba(0, 123, 255, 0.05));
            border-color: #007bff;
          }

          .upload-dropzone.camera-zone:hover {
            border-color: #0056b3;
            background: linear-gradient(135deg, rgba(0, 123, 255, 0.2), rgba(0, 123, 255, 0.1));
          }

          .file-preview {
            margin-top: 1rem;
            padding: 1rem;
            background: #f8f9fa;
            border-radius: 8px;
          }

          .preview-container {
            background: white;
            border-radius: 6px;
            padding: 1rem;
            margin-bottom: 1rem;
            text-align: center;
          }

          .preview-actions {
            display: flex;
            gap: 0.5rem;
            justify-content: flex-end;
          }

          /* Larger Text Inputs for Better Usability */
          .admin-form input[type="text"],
          .admin-form input[type="email"],
          .admin-form input[type="tel"],
          .admin-form input[type="password"],
          .admin-form textarea,
          .admin-form select,
          .form-group input,
          .form-group textarea,
          .form-group select,
          .promotion-form input,
          .promotion-form textarea {
            min-height: 44px !important;
            padding: 12px 16px !important;
            font-size: 16px !important;
            line-height: 1.4 !important;
            border-radius: 8px !important;
            border: 2px solid #ddd !important;
            box-sizing: border-box !important;
          }

          .admin-form textarea,
          .form-group textarea,
          .promotion-form textarea {
            min-height: 100px !important;
            resize: vertical !important;
          }

          .admin-form input:focus,
          .admin-form textarea:focus,
          .admin-form select:focus,
          .form-group input:focus,
          .form-group textarea:focus,
          .form-group select:focus,
          .promotion-form input:focus,
          .promotion-form textarea:focus {
            border-color: var(--tmobile-magenta) !important;
            outline: none !important;
            box-shadow: 0 0 0 3px rgba(226, 0, 116, 0.1) !important;
          }

          /* Password Input Styling */
          .password-input {
            min-height: 50px !important;
            font-size: 18px !important;
            padding: 15px 20px !important;
            text-align: center !important;
            font-weight: bold !important;
            letter-spacing: 2px !important;
          }

          @media (max-width: 768px) {
            .upload-options {
              grid-template-columns: 1fr;
              gap: 1rem;
            }
            
            .admin-form input[type="text"],
            .admin-form input[type="email"],
            .admin-form input[type="tel"],
            .admin-form input[type="password"],
            .form-group input,
            .promotion-form input {
              min-height: 48px !important;
              font-size: 16px !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}

export default AdminPanelEnhanced;