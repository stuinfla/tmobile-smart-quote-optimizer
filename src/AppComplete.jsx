import { useState, useEffect, useRef } from 'react';
import './App.css';
import './App.enhanced.css';
import { DealOptimizer } from './utils/optimizer';
import ConversationFlowEnhanced from './components/ConversationFlowEnhanced';
import ResultsDisplayEnhanced from './components/ResultsDisplayEnhanced';
import QuoteGenerator from './components/QuoteGenerator';
import StoreSetup from './components/StoreSetup';
import RepSwitcher from './components/RepSwitcher';
import AdminPanelEnhanced from './components/AdminPanelEnhanced';
import { useLocalStorage } from './hooks/useLocalStorage';
import { StoreManager, RepManager, sampleRepData } from './data/storeData';
import adminStorage from './utils/adminStorage';
import versionInfo from './version.json';
import { isIOS, isPWA, hapticFeedback, createSwipeHandler, iosKeyboard } from './utils/iosFeatures';

function AppComplete() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [currentRep, setCurrentRep] = useState(null);
  const [storeInfo, setStoreInfo] = useState(null);
  const [showStoreSetup, setShowStoreSetup] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showCarrierModal, setShowCarrierModal] = useState(false);
  const [carrierModalData, setCarrierModalData] = useState(null);
  
  // Use localStorage to persist customer data
  const [customerData, setCustomerData] = useLocalStorage('tmobile-customer-data', {
    isExisting: false,
    newCustomer: true,
    carrier: '',
    lines: 0,
    devices: [],
    selectedPlan: 'EXPERIENCE_BEYOND',
    accessories: {
      watch: false,
      tablet: false,
      homeInternet: false
    }
  });
  
  const [currentStep, setCurrentStep] = useLocalStorage('tmobile-current-step', 'lines');
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [saved, setSaved] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    initializeApp();
    checkForUpdates();
    
    // iOS-specific optimizations
    if (isIOS()) {
      // Prevent zoom on input focus
      iosKeyboard.preventZoom();
      
      // Add iOS class for conditional styling
      document.body.classList.add('ios-device');
      
      // Check if running as PWA
      if (isPWA()) {
        document.body.classList.add('ios-pwa');
      }
    }
  }, []);

  const checkForUpdates = () => {
    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        registration.update();
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
              // Auto-update after 3 seconds
              setTimeout(() => {
                newWorker.postMessage('skipWaiting');
                window.location.reload();
              }, 3000);
            }
          });
        });
      });
    }
    
    // Check for updates every 5 minutes
    setInterval(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          registration.update();
        });
      }
    }, 5 * 60 * 1000);
  };

  const initializeApp = () => {
    // Always start ready to sell - use admin storage system
    try {
      let store = adminStorage.getCurrentStore();
      
      if (!store) {
        // Initialize with default store if none exists
        const defaultStore = {
          id: '7785',
          name: 'T-Mobile Store',
          address: '1821 S Federal Hwy',
          city: 'Delray Beach',
          state: 'FL',
          zip: '33483',
          phone: '561.330.6211',
          manager: 'Store Manager'
        };
        store = adminStorage.addStore(defaultStore);
        adminStorage.setCurrentStore(store.id);
      }
      
      // Convert store format for compatibility
      const storeInfo = {
        storeId: store.id,
        storeName: store.name,
        address: store.address,
        city: store.city,
        state: store.state,
        zip: store.zip,
        phone: store.phone,
        manager: store.manager
      };
      setStoreInfo(storeInfo);
      
      // Check for current rep
      let rep = adminStorage.getCurrentRep();
      
      if (!rep) {
        const allReps = adminStorage.getSalesReps();
        if (allReps.length === 0) {
          // Create default rep
          const defaultRep = {
            name: 'T-Mobile Expert',
            email: 'expert@t-mobile.com',
            phone: store.phone,
            role: 'Mobile Expert',
            storeId: store.id
          };
          rep = adminStorage.addSalesRep(defaultRep);
        } else {
          rep = allReps[0];
        }
        adminStorage.setCurrentRep(rep.id);
      }
      
      setCurrentRep(rep);
      setIsConfigured(true);
      
    } catch (error) {
      console.error('Error initializing app with admin storage:', error);
      // Fallback to old system if needed
      initializeAppLegacy();
    }
  };

  const initializeAppLegacy = () => {
    // Fallback initialization method
    let store = StoreManager.getStore();
    
    if (!store.storeId) {
      store = {
        storeId: '7785',
        storeName: 'T-Mobile Store',
        address: '1821 S Federal Hwy',
        city: 'Delray Beach',
        state: 'FL',
        zip: '33483',
        phone: '561.330.6211',
        manager: 'Store Manager'
      };
      setStoreInfo(store);
    } else {
      setStoreInfo(store);
    }
    
    let rep = RepManager.getCurrentRep();
    
    if (!rep) {
      const allReps = RepManager.getAllReps();
      if (allReps.length === 0) {
        rep = {
          id: 'default-rep',
          name: 'T-Mobile Expert',
          email: 'expert@t-mobile.com',
          phone: store.phone,
          role: 'Mobile Expert',
          storeId: store.storeId
        };
      } else {
        rep = allReps[0];
        RepManager.setCurrentRep(rep.id);
      }
    }
    
    setCurrentRep(rep);
    setIsConfigured(true);
  };

  const handleStoreSetupComplete = (storeData) => {
    setStoreInfo(storeData);
    setShowStoreSetup(false);
    
    // Add sample rep after store setup
    const rep = RepManager.addRep({
      ...sampleRepData,
      storeId: storeData.storeId
    });
    RepManager.setCurrentRep(rep.id);
    setCurrentRep(rep);
    setIsConfigured(true);
  };

  const handleRepChange = (rep) => {
    setCurrentRep(rep);
  };

  useEffect(() => {
    if (customerData.lines > 0) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }, [customerData]);

  const handleAnswer = (answer, nextStep = null) => {
    // Use iOS haptic feedback instead of vibrate
    hapticFeedback.light();
    
    if (answer === 'back' && nextStep) {
      setCurrentStep(nextStep);
      return;
    }
    
    if (answer === 'continue' && nextStep) {
      setCurrentStep(nextStep);
      return;
    }

    if (currentStep === 'accessories') {
      calculateResults(customerData);
    }
  };

  const calculateResults = (data) => {
    const optimizer = new DealOptimizer(data);
    const scenarios = optimizer.calculateAllScenarios();
    
    const keepAndSwitchScenario = scenarios.find(s => s.type === 'keep_and_switch');
    if (keepAndSwitchScenario && keepAndSwitchScenario === scenarios[0]) {
      const eligibleCarriers = ['Verizon', 'AT&T', 'UScellular', 'Xfinity', 'Spectrum'];
      setCarrierModalData({
        scenario: keepAndSwitchScenario,
        eligibleCarriers: eligibleCarriers,
        scenarios: scenarios,
        data: data
      });
      setShowCarrierModal(true);
      return; // Wait for user selection
    }
    
    setResults(scenarios);
    setShowResults(true);
    
    setTimeout(() => {
      localStorage.removeItem('tmobile-customer-data');
      localStorage.removeItem('tmobile-current-step');
    }, 1000);
  };

  const handleCarrierSelection = (selectedCarrier) => {
    const { eligibleCarriers, scenarios, data } = carrierModalData;
    
    if (selectedCarrier && eligibleCarriers.some(c => selectedCarrier.toLowerCase().includes(c.toLowerCase()))) {
      data.carrier = selectedCarrier;
    } else {
      scenarios.shift(); // Remove Keep & Switch scenario if not eligible
    }
    
    setShowCarrierModal(false);
    setCarrierModalData(null);
    
    // Continue with results calculation
    setResults(scenarios);
    setShowResults(true);
    
    setTimeout(() => {
      localStorage.removeItem('tmobile-customer-data');
      localStorage.removeItem('tmobile-current-step');
    }, 1000);
  };

  const resetFlow = () => {
    setCurrentStep('lines');
    setCustomerData({
      isExisting: false,
      newCustomer: true,
      carrier: '',
      lines: 0,
      devices: [],
      selectedPlan: 'EXPERIENCE_BEYOND',
      accessories: {
        watch: false,
        tablet: false,
        homeInternet: false
      }
    });
    setResults(null);
    setShowResults(false);
    localStorage.removeItem('tmobile-customer-data');
    localStorage.removeItem('tmobile-current-step');
  };

  // Remove the initial store setup screen - only show it when accessed through admin
  // App always starts ready to sell

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <img src="/logo.png" alt="T-Mobile" className="logo" />
            <h1 className="app-title">Sales Edge</h1>
          </div>
          <div className="header-actions">
            <button 
              className="new-client-btn"
              onClick={resetFlow}
              title="New Customer"
            >
              🆕 New
            </button>
            <RepSwitcher 
              currentRep={currentRep}
              onRepChange={handleRepChange}
            />
          </div>
        </div>
        <div className="pricing-validity">
          📅 Pricing Valid: September 2025
        </div>
      </header>

      <main className="main-container">
        {!showResults ? (
          <>
            {customerData.lines > 0 && currentStep !== 'lines' && (
              <div className="progress-banner">
                📝 Building quote for {customerData.lines} {customerData.lines === 1 ? 'line' : 'lines'}
                {customerData.devices[0]?.newPhone && ` with ${customerData.devices.filter(d => d.newPhone).length} new phone(s)`}
              </div>
            )}
            <ConversationFlowEnhanced
              currentStep={currentStep}
              customerData={customerData}
              onAnswer={handleAnswer}
              setCustomerData={setCustomerData}
            />
          </>
        ) : (
          <>
            <ResultsDisplayEnhanced 
              results={results}
              customerData={customerData}
            />
            <QuoteGenerator
              results={results}
              customerData={customerData}
              repInfo={{
                name: currentRep?.name,
                storeId: storeInfo?.storeId,
                email: currentRep?.email,
                phone: currentRep?.phone || storeInfo?.phone
              }}
            />
            
            <div className="action-buttons">
              <button className="btn btn-secondary" onClick={resetFlow}>
                New Quote
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  window.print();
                  if (navigator.share) {
                    navigator.share({
                      title: 'T-Mobile Quote',
                      text: `Your T-Mobile quote saves you $${results[0].totalSavings}!`,
                      url: window.location.href
                    });
                  }
                }}
              >
                Print/Share Quote
              </button>
            </div>
          </>
        )}
      </main>
      
      {/* Floating Admin Button */}
      <button 
        className="admin-fab"
        onClick={() => setShowAdminPanel(true)}
        title="Admin Settings"
      >
        ⚙️
      </button>
      
      <footer className="app-footer">
        <div className="version-info">
          v{versionInfo.version} • Released {versionInfo.releaseDate}
          {updateAvailable && <span className="update-notice"> • Update available!</span>}
        </div>
      </footer>
      
      {showAdminPanel && (
        <AdminPanelEnhanced 
          onClose={() => setShowAdminPanel(false)}
          onStoreSetup={() => setShowStoreSetup(true)}
        />
      )}
      
      {showStoreSetup && (
        <StoreSetup onComplete={handleStoreSetupComplete} />
      )}
      
      {showCarrierModal && carrierModalData && (
        <div className="modal-overlay">
          <div className="carrier-modal">
            <div className="modal-header">
              <h3>🎯 Keep & Switch Special Offer!</h3>
              <p>You could save ${carrierModalData.scenario.totalSavings} with Keep & Switch!</p>
            </div>
            
            <div className="modal-content">
              <p>Are you currently with one of these eligible carriers?</p>
              
              <div className="carrier-selection">
                <select 
                  onChange={(e) => {
                    if (e.target.value) {
                      handleCarrierSelection(e.target.value);
                    }
                  }}
                  defaultValue=""
                  className="carrier-dropdown"
                >
                  <option value="">Select your current carrier...</option>
                  {carrierModalData.eligibleCarriers.map(carrier => (
                    <option key={carrier} value={carrier}>{carrier}</option>
                  ))}
                </select>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => handleCarrierSelection(null)}
                >
                  Not Listed / Skip Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .store-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        
        .store-label {
          font-size: 0.75rem;
          opacity: 0.8;
          margin-top: 0.125rem;
        }
        
        .save-indicator {
          color: var(--tmobile-success);
          font-size: 0.875rem;
          margin-right: 1rem;
          animation: fadeIn 0.3s ease;
        }
        
        .logo {
          width: 40px;
          height: 40px;
          margin-right: 1rem;
        }
        
        .settings-btn,
        .admin-fab {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--tmobile-magenta);
          color: white;
          border: none;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.2s;
        }
        
        .new-client-btn {
          background: rgba(255,255,255,0.15);
          border: none;
          border-radius: 20px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 0.9rem;
          color: white;
          margin-right: 1rem;
          transition: all 0.2s;
        }
        
        .new-client-btn:hover {
          background: rgba(255,255,255,0.25);
        }
        
        .settings-btn:hover,
        .admin-btn:hover {
          background: rgba(255,255,255,0.25);
        }
        
        .rep-banner {
          background: linear-gradient(135deg, rgba(226, 0, 116, 0.1), rgba(226, 0, 116, 0.05));
          padding: 0.75rem 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .rep-label {
          font-size: 0.875rem;
          color: var(--tmobile-gray);
        }
        
        .rep-current {
          font-weight: 600;
          color: var(--tmobile-magenta);
        }
        
        .rep-role {
          font-size: 0.875rem;
          color: var(--tmobile-gray);
        }
        
        .progress-banner {
          padding: 0.5rem 1rem;
          background: rgba(226, 0, 116, 0.1);
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: var(--tmobile-magenta);
        }
        
        .app-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          border-top: 1px solid var(--tmobile-light-gray);
          padding: 0.5rem;
          text-align: center;
          z-index: 10;
        }
        
        .version-info {
          font-size: 0.75rem;
          color: var(--tmobile-gray);
        }
        
        .update-notice {
          color: var(--tmobile-magenta);
          font-weight: bold;
          animation: pulse 2s infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
        
        /* Carrier Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        
        .carrier-modal {
          background: white;
          border-radius: 12px;
          max-width: 500px;
          width: 100%;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          animation: modalSlideIn 0.3s ease-out;
        }
        
        .modal-header {
          padding: 1.5rem;
          background: linear-gradient(135deg, var(--tmobile-magenta), rgba(226, 0, 116, 0.8));
          color: white;
          border-radius: 12px 12px 0 0;
          text-align: center;
        }
        
        .modal-header h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
        }
        
        .modal-header p {
          margin: 0;
          opacity: 0.9;
        }
        
        .modal-content {
          padding: 1.5rem;
        }
        
        .modal-content p {
          margin: 0 0 1rem 0;
          text-align: center;
          color: #666;
        }
        
        .carrier-selection {
          margin: 1.5rem 0;
        }
        
        .carrier-dropdown {
          width: 100%;
          padding: 1rem;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          background: white;
          cursor: pointer;
          transition: border-color 0.2s;
        }
        
        .carrier-dropdown:hover,
        .carrier-dropdown:focus {
          border-color: var(--tmobile-magenta);
          outline: none;
        }
        
        .modal-actions {
          display: flex;
          justify-content: center;
          margin-top: 1.5rem;
        }
        
        .btn-secondary {
          background: #6c757d;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.2s;
        }
        
        .btn-secondary:hover {
          background: #5a6268;
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .header-content {
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          
          .store-info {
            flex: 1;
          }
          
          .app-title {
            font-size: 1rem;
          }
          
          .rep-banner {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default AppComplete;