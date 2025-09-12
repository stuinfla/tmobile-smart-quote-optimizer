import { useState, useEffect } from 'react';
import './App.css';
import { DealOptimizer } from './utils/optimizer';
import ConversationFlow from './components/ConversationFlow';
import ResultsDisplay from './components/ResultsDisplay';
import QuoteGenerator from './components/QuoteGenerator';

function App() {
  const [currentStep, setCurrentStep] = useState('customerType');
  const [customerData, setCustomerData] = useState({
    isExisting: false,
    newCustomer: true,
    carrier: '',
    lines: 1,
    devices: [],
    selectedPlan: 'GO5G_Next',
    accessories: {
      watch: false,
      tablet: false,
      homeInternet: false
    }
  });
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [repInfo, setRepInfo] = useState({
    name: '',
    storeId: ''
  });

  useEffect(() => {
    // Load rep info from localStorage
    const savedRep = localStorage.getItem('repInfo');
    if (savedRep) {
      setRepInfo(JSON.parse(savedRep));
    }
  }, []);

  const handleAnswer = (answer) => {
    const newData = { ...customerData };
    
    switch(currentStep) {
      case 'customerType':
        newData.isExisting = answer === 'existing';
        newData.newCustomer = answer === 'new';
        setCurrentStep('carrier');
        break;
      
      case 'carrier':
        newData.carrier = answer;
        setCurrentStep('lines');
        break;
      
      case 'lines':
        newData.lines = answer;
        newData.devices = Array(answer).fill().map(() => ({
          currentPhone: '',
          newPhone: '',
          storage: ''
        }));
        setCurrentStep('currentPhones');
        break;
      
      case 'currentPhones':
        // Handle in device selector component
        setCurrentStep('newPhones');
        break;
      
      case 'newPhones':
        // Handle in device selector component
        setCurrentStep('plan');
        break;
      
      case 'plan':
        newData.selectedPlan = answer;
        setCurrentStep('accessories');
        break;
      
      case 'accessories':
        newData.accessories = answer;
        calculateResults(newData);
        break;
    }
    
    setCustomerData(newData);
  };

  const calculateResults = (data) => {
    const optimizer = new DealOptimizer(data);
    const scenarios = optimizer.calculateAllScenarios();
    setResults(scenarios);
    setShowResults(true);
  };

  const resetFlow = () => {
    setCurrentStep('customerType');
    setCustomerData({
      isExisting: false,
      newCustomer: true,
      carrier: '',
      lines: 1,
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
  };

  const saveRepInfo = (info) => {
    setRepInfo(info);
    localStorage.setItem('repInfo', JSON.stringify(info));
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
            <div className="rep-info">
              <span>👤</span>
              <span>{repInfo.name || 'Set Rep Info'}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="main-container">
        {!showResults ? (
          <ConversationFlow
            currentStep={currentStep}
            customerData={customerData}
            onAnswer={handleAnswer}
            setCustomerData={setCustomerData}
          />
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
          </>
        )}

        <div className="action-buttons">
          {showResults ? (
            <>
              <button className="btn btn-secondary" onClick={resetFlow}>
                New Quote
              </button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                Print Quote
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => {
              if (currentStep === 'customerType' && !repInfo.name) {
                const name = prompt('Enter your name:');
                const storeId = prompt('Enter store ID:');
                if (name && storeId) {
                  saveRepInfo({ name, storeId });
                }
              }
            }}>
              {currentStep === 'customerType' && !repInfo.name ? 'Set Rep Info' : 'Continue'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;