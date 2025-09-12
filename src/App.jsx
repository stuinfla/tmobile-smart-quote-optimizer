import { useState, useEffect } from 'react';
import './App.css';
import { DealOptimizer } from './utils/optimizer';
import ConversationFlow from './components/ConversationFlow';
import ResultsDisplay from './components/ResultsDisplay';
import QuoteGenerator from './components/QuoteGenerator';

function App() {
  const [currentStep, setCurrentStep] = useState('lines');
  const [customerData, setCustomerData] = useState({
    isExisting: false,
    newCustomer: true,
    carrier: '', // We'll only ask this if Keep & Switch is the best deal
    lines: 0,
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

  const handleAnswer = (answer, nextStep = null) => {
    // Handle navigation
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
      // If Keep & Switch is best, we might want to ask about carrier eligibility
      // For now, we'll assume they're eligible
      data.carrier = 'Verizon'; // Default to eligible carrier
    }
    
    setResults(scenarios);
    setShowResults(true);
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
            
            <div className="action-buttons">
              <button className="btn btn-secondary" onClick={resetFlow}>
                New Quote
              </button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                Print Quote
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;