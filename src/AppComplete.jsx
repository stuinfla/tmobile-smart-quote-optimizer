import { useState, useEffect } from 'react';
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

function AppComplete() {
  const [isConfigured, setIsConfigured] = useState(false);
  const [currentRep, setCurrentRep] = useState(null);
  const [storeInfo, setStoreInfo] = useState(null);
  const [showStoreSetup, setShowStoreSetup] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  // Use localStorage to persist customer data
  const [customerData, setCustomerData] = useLocalStorage('tmobile-customer-data', {
    isExisting: false,
    newCustomer: true,
    carrier: '',
    lines: 0,
    devices: [],
    selectedPlan: 'GO5G_Next',
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
    if (navigator.vibrate) navigator.vibrate(10);
    
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
      const carrier = prompt(
        `Keep & Switch could save you $${keepAndSwitchScenario.totalSavings}!\n\n` +
        `Are you with one of these carriers?\n${eligibleCarriers.join(', ')}\n\n` +
        `Enter your carrier or Cancel if not eligible:`
      );
      
      if (carrier && eligibleCarriers.some(c => carrier.toLowerCase().includes(c.toLowerCase()))) {
        data.carrier = carrier;
      } else {
        scenarios.shift();
      }
    }
    
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
      selectedPlan: 'GO5G_Next',
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
            <svg className="logo" viewBox="0 0 100 40" fill="currentColor">
              <text x="0" y="30" fontFamily="Arial Black" fontSize="24" fontWeight="bold">T</text>
              <rect x="25" y="10" width="4" height="20" />
              <rect x="20" y="15" width="14" height="4" />
            </svg>
            <div className="store-info">
              <h1 className="app-title">T-Mobile Sales Edge</h1>
              <span className="store-label">Store {storeInfo?.storeId} • {storeInfo?.city}</span>
            </div>
          </div>
          <div className="header-actions">
            {saved && (
              <span className="save-indicator">
                ✓ Auto-saved
              </span>
            )}
            <RepSwitcher 
              currentRep={currentRep}
              onRepChange={handleRepChange}
            />
            <button 
              className="admin-btn"
              onClick={() => setShowAdminPanel(true)}
              title="Admin Panel"
            >
              🔐 Admin
            </button>
          </div>
        </div>
      </header>

      <main className="main-container">
        {currentRep && (
          <div className="rep-banner">
            <span className="rep-label">Logged in as:</span>
            <span className="rep-current">{currentRep.name}</span>
            <span className="rep-role">• {currentRep.role}</span>
          </div>
        )}
        
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
        
        .settings-btn,
        .admin-btn {
          background: rgba(255,255,255,0.15);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.2rem;
          transition: all 0.2s;
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