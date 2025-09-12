import { useState, useEffect } from 'react';
import { monthlyPrograms, programCategories, getActivePrograms } from '../data/monthlyPrograms';

function ProgramSelector({ selectedPrograms, onProgramChange, customerData }) {
  const [activeTab, setActiveTab] = useState('switching');
  const [programDetails, setProgramDetails] = useState({});

  useEffect(() => {
    // Load program details for benefit calculations
    const details = {};
    Object.keys(monthlyPrograms).forEach(programId => {
      const program = monthlyPrograms[programId];
      details[programId] = {
        ...program,
        estimatedSavings: calculateEstimatedSavings(program, customerData)
      };
    });
    setProgramDetails(details);
  }, [customerData]);

  const calculateEstimatedSavings = (program, data) => {
    if (!program || !data) return 0;
    
    const monthlyDiscount = (program.benefits.planDiscount || 0) * (data.lines || 1);
    const payoffAmount = Math.min(program.benefits.payoffAmount || 0, data.devicePayoff || 0);
    const tradeCredit = program.benefits.tradeinCredit || 0;
    const activationSavings = program.benefits.activationWaiver ? (data.lines || 1) * 10 : 0;
    
    // 24-month total savings
    const totalSavings = (monthlyDiscount * 24) + payoffAmount + tradeCredit + activationSavings;
    return totalSavings;
  };

  const handleProgramToggle = (programId) => {
    const newSelection = selectedPrograms.includes(programId)
      ? selectedPrograms.filter(id => id !== programId)
      : [...selectedPrograms, programId];
    
    onProgramChange(newSelection);
  };

  const getCategoryPrograms = (category) => {
    return programCategories[category]?.map(id => monthlyPrograms[id]).filter(Boolean) || [];
  };

  const isProgramSelected = (programId) => {
    return selectedPrograms.includes(programId);
  };

  const getCompatibilityStatus = (program) => {
    if (!customerData) return 'unknown';
    
    // Check carrier compatibility
    if (program.eligibleCarriers && customerData.carrier) {
      if (!program.eligibleCarriers.some(carrier => 
        customerData.carrier.toLowerCase().includes(carrier.toLowerCase())
      )) {
        return 'incompatible';
      }
    }
    
    // Check line count requirements
    if (program.id === 'business_advantage' && customerData.lines < 3) {
      return 'incompatible';
    }
    
    return 'compatible';
  };

  return (
    <div className="program-selector">
      <div className="program-header">
        <h3>📋 Select T-Mobile Programs</h3>
        <p>Choose which monthly programs to include in your quote calculations</p>
      </div>

      <div className="program-tabs">
        {Object.keys(programCategories).map(category => (
          <button
            key={category}
            className={`tab ${activeTab === category ? 'active' : ''}`}
            onClick={() => setActiveTab(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1).replace(/([A-Z])/g, ' $1')}
          </button>
        ))}
      </div>

      <div className="program-list">
        {getCategoryPrograms(activeTab).map(program => {
          const compatibility = getCompatibilityStatus(program);
          const isSelected = isProgramSelected(program.id);
          const details = programDetails[program.id] || program;
          
          return (
            <div 
              key={program.id} 
              className={`program-card ${isSelected ? 'selected' : ''} ${compatibility}`}
              onClick={() => handleProgramToggle(program.id)}
            >
              <div className="program-main">
                <div className="program-info">
                  <div className="program-title">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={() => handleProgramToggle(program.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <h4>{program.name}</h4>
                    {!program.activeProgram && (
                      <span className="inactive-badge">Inactive</span>
                    )}
                  </div>
                  <p className="program-description">{program.description}</p>
                  
                  {program.eligibility && (
                    <p className="eligibility">
                      <strong>Eligibility:</strong> {program.eligibility}
                    </p>
                  )}
                </div>
                
                <div className="program-benefits">
                  <div className="benefit-summary">
                    <div className="estimated-savings">
                      <span className="savings-amount">
                        ${details.estimatedSavings?.toLocaleString() || '0'}
                      </span>
                      <span className="savings-label">Est. 24mo Savings</span>
                    </div>
                  </div>
                  
                  <div className="benefit-details">
                    {program.benefits.payoffAmount > 0 && (
                      <div className="benefit-item">
                        💰 Up to ${program.benefits.payoffAmount} device payoff
                      </div>
                    )}
                    {program.benefits.tradeinCredit > 0 && (
                      <div className="benefit-item">
                        📱 ${program.benefits.tradeinCredit} trade-in credit
                      </div>
                    )}
                    {program.benefits.planDiscount > 0 && (
                      <div className="benefit-item">
                        📅 ${program.benefits.planDiscount}/mo per line discount
                      </div>
                    )}
                    {program.benefits.activationWaiver && (
                      <div className="benefit-item">
                        ✅ Activation fees waived
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {compatibility === 'incompatible' && (
                <div className="compatibility-warning">
                  ⚠️ Not compatible with current customer profile
                </div>
              )}
              
              {program.validUntil && (
                <div className="expiration-notice">
                  ⏰ Expires: {new Date(program.validUntil).toLocaleDateString()}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="program-summary">
        <h4>Selected Programs Summary</h4>
        <div className="selected-count">
          {selectedPrograms.length} programs selected
        </div>
        {selectedPrograms.length > 0 && (
          <div className="selected-programs">
            {selectedPrograms.map(programId => {
              const program = monthlyPrograms[programId];
              return program ? (
                <span key={programId} className="selected-program-tag">
                  {program.name}
                </span>
              ) : null;
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .program-selector {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin: 1rem 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .program-header {
          margin-bottom: 1.5rem;
        }

        .program-header h3 {
          margin: 0 0 0.5rem 0;
          color: var(--tmobile-magenta);
        }

        .program-header p {
          margin: 0;
          color: #666;
          font-size: 0.9rem;
        }

        .program-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #eee;
          padding-bottom: 0.5rem;
        }

        .tab {
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9rem;
          color: #666;
          transition: all 0.2s;
        }

        .tab.active {
          background: var(--tmobile-magenta);
          color: white;
        }

        .tab:hover:not(.active) {
          background: #f5f5f5;
        }

        .program-list {
          display: grid;
          gap: 1rem;
        }

        .program-card {
          border: 2px solid #eee;
          border-radius: 8px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }

        .program-card:hover {
          border-color: var(--tmobile-magenta);
          box-shadow: 0 2px 8px rgba(226, 0, 116, 0.1);
        }

        .program-card.selected {
          border-color: var(--tmobile-magenta);
          background: rgba(226, 0, 116, 0.02);
        }

        .program-card.incompatible {
          opacity: 0.6;
          border-color: #ddd;
        }

        .program-card.incompatible:hover {
          border-color: #999;
        }

        .program-main {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }

        .program-info {
          flex: 1;
        }

        .program-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .program-title h4 {
          margin: 0;
          color: var(--tmobile-magenta);
        }

        .inactive-badge {
          background: #ffa500;
          color: white;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: bold;
        }

        .program-description {
          margin: 0 0 0.5rem 0;
          color: #333;
          font-size: 0.9rem;
        }

        .eligibility {
          margin: 0;
          font-size: 0.8rem;
          color: #666;
        }

        .program-benefits {
          min-width: 200px;
        }

        .benefit-summary {
          text-align: right;
          margin-bottom: 0.5rem;
        }

        .estimated-savings {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .savings-amount {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--tmobile-magenta);
        }

        .savings-label {
          font-size: 0.7rem;
          color: #666;
          text-transform: uppercase;
        }

        .benefit-details {
          font-size: 0.8rem;
          color: #666;
        }

        .benefit-item {
          margin-bottom: 0.25rem;
        }

        .compatibility-warning {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: #fff3cd;
          color: #856404;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .expiration-notice {
          margin-top: 0.5rem;
          padding: 0.5rem;
          background: #f8d7da;
          color: #721c24;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .program-summary {
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #eee;
        }

        .program-summary h4 {
          margin: 0 0 0.5rem 0;
          color: var(--tmobile-magenta);
        }

        .selected-count {
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .selected-programs {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .selected-program-tag {
          background: var(--tmobile-magenta);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        @media (max-width: 768px) {
          .program-main {
            flex-direction: column;
          }
          
          .program-benefits {
            min-width: auto;
          }
          
          .benefit-summary {
            text-align: left;
          }
          
          .estimated-savings {
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
}

export default ProgramSelector;