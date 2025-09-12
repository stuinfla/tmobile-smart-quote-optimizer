import { useState, useEffect } from 'react';
import './App.css';
import './App.enhanced.css';
import { DealOptimizer } from './utils/optimizer';
import ConversationFlowEnhanced from './components/ConversationFlowEnhanced';
import ResultsDisplay from './components/ResultsDisplay';
import QuoteGenerator from './components/QuoteGenerator';
import { useLocalStorage } from './hooks/useLocalStorage';

function AppEnhanced() {
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
  const [repInfo, setRepInfo] = useLocalStorage('repInfo', {
    name: '',
    storeId: ''
  });

  // Auto-save indicator
  const [saved, setSaved] = useState(false);
  
  useEffect(() => {
    if (customerData.lines > 0) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }, [customerData]);

  const handleAnswer = (answer, nextStep = null) => {
    // Handle navigation with haptic feedback
    if (navigator.vibrate) navigator.vibrate(10);
    
    if (answer === 'back' && nextStep) {
      setCurrentStep(nextStep);
      return;
    }
    
    if (answer === 'continue' && nextStep) {
      setCurrentStep(nextStep);
      return;
    }

    // Handle final calculation
    if (currentStep === 'accessories') {
      calculateResults(customerData);
    }
  };

  const calculateResults = (data) => {
    const optimizer = new DealOptimizer(data);
    const scenarios = optimizer.calculateAllScenarios();
    
    // Check if Keep & Switch is the best deal
    const keepAndSwitchScenario = scenarios.find(s => s.type === 'keep_and_switch');
    if (keepAndSwitchScenario && keepAndSwitchScenario === scenarios[0]) {
      // Show carrier eligibility check
      const eligibleCarriers = ['Verizon', 'AT&T', 'UScellular', 'Xfinity', 'Spectrum'];
      const carrier = prompt(
        `Keep & Switch could save you ${keepAndSwitchScenario.totalSavings}!\n\n` +
        `Are you with one of these carriers?\n${eligibleCarriers.join(', ')}\n\n` +
        `Enter your carrier or Cancel if not eligible:`
      );
      
      if (carrier && eligibleCarriers.some(c => carrier.toLowerCase().includes(c.toLowerCase()))) {
        data.carrier = carrier;
      } else {
        // Recalculate without Keep & Switch
        scenarios.shift(); // Remove Keep & Switch from options
      }
    }
    
    setResults(scenarios);
    setShowResults(true);
    
    // Clear saved data after calculation
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

  const saveRepInfo = (info) => {
    setRepInfo(info);
  };

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
            <h1 className="app-title">Smart Quote Optimizer</h1>
          </div>
          <div className="header-actions">
            {saved && (
              <span style={{
                color: 'var(--tmobile-success)',
                fontSize: '0.875rem',
                marginRight: '1rem',
                animation: 'fadeIn 0.3s ease'
              }}>
                ✓ Auto-saved
              </span>
            )}
            <div 
              className="rep-info" 
              style={{cursor: 'pointer'}}
              onClick={() => {
                const name = prompt('Enter your name:', repInfo.name);
                const storeId = prompt('Enter store ID:', repInfo.storeId);
                if (name && storeId) {
                  saveRepInfo({ name, storeId });
                }
              }}
            >
              <span>👤</span>
              <span>{repInfo.name || 'Set Rep Info'}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="main-container">
        {!showResults ? (
          <>
            {customerData.lines > 0 && currentStep !== 'lines' && (
              <div style={{
                padding: '0.5rem 1rem',
                background: 'rgba(226, 0, 116, 0.1)',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.875rem',
                color: 'var(--tmobile-magenta)'
              }}>
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
            <ResultsDisplay 
              results={results}
              customerData={customerData}
            />
            <QuoteGenerator
              results={results}
              customerData={customerData}
              repInfo={repInfo}
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
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default AppEnhanced;