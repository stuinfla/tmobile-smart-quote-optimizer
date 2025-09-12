import { useEffect, useState } from 'react';

function QuoteGenerator({ results, customerData, repInfo }) {
  const [quoteNumber, setQuoteNumber] = useState('');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    // Generate quote number
    const date = new Date();
    const quoteNum = `TM${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    setQuoteNumber(quoteNum);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const bestDeal = results?.[0];
  if (!bestDeal) return null;

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="quote-generator" style={{marginTop: '2rem'}}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '80px'
      }}>
        <div style={{
          borderBottom: '2px solid var(--tmobile-magenta)',
          paddingBottom: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div>
              <h3 style={{color: 'var(--tmobile-magenta)', marginBottom: '0.25rem'}}>
                Customer Quote
              </h3>
              <p style={{fontSize: '0.875rem', color: 'var(--tmobile-gray)'}}>
                Quote #{quoteNumber}
              </p>
            </div>
            <div style={{textAlign: 'right'}}>
              <p style={{fontSize: '0.875rem', color: 'var(--tmobile-gray)'}}>
                {currentDate}
              </p>
              <p style={{fontSize: '0.875rem', color: 'var(--tmobile-gray)'}}>
                Rep: {repInfo.name || 'T-Mobile Representative'}
              </p>
            </div>
          </div>
        </div>

        <div style={{marginBottom: '1.5rem'}}>
          <h4 style={{marginBottom: '0.75rem', color: 'var(--tmobile-black)'}}>
            Customer Information
          </h4>
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
            <div className="input-group">
              <input
                type="text"
                className="input-field"
                placeholder="Customer Name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              />
            </div>
            <div className="input-group">
              <input
                type="tel"
                className="input-field"
                placeholder="Phone Number"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                className="input-field"
                placeholder="Email Address"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div style={{
          background: 'var(--tmobile-light-gray)',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <h4 style={{marginBottom: '0.75rem', color: 'var(--tmobile-black)'}}>
            Recommended Package: {bestDeal.name}
          </h4>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div>
              <p style={{fontSize: '0.875rem', color: 'var(--tmobile-gray)', marginBottom: '0.25rem'}}>
                Monthly Payment
              </p>
              <p style={{fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--tmobile-magenta)'}}>
                {formatCurrency(bestDeal.monthlyTotal)}
              </p>
            </div>
            <div>
              <p style={{fontSize: '0.875rem', color: 'var(--tmobile-gray)', marginBottom: '0.25rem'}}>
                Due Today
              </p>
              <p style={{fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--tmobile-black)'}}>
                {formatCurrency(bestDeal.upfrontCost)}
              </p>
            </div>
          </div>

          <div style={{
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(0,0,0,0.1)'
          }}>
            <p style={{fontSize: '0.875rem', color: 'var(--tmobile-gray)', marginBottom: '0.25rem'}}>
              Total Savings Over 24 Months
            </p>
            <p style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--tmobile-success)'}}>
              {formatCurrency(bestDeal.totalSavings)}
            </p>
          </div>
        </div>

        <div style={{marginBottom: '1.5rem'}}>
          <h4 style={{marginBottom: '0.75rem', color: 'var(--tmobile-black)'}}>
            Package Includes
          </h4>
          <ul style={{listStyle: 'none', padding: 0}}>
            <li style={{marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <span style={{color: 'var(--tmobile-success)'}}>✓</span>
              {customerData.lines} {customerData.lines === 1 ? 'line' : 'lines'} on {customerData.selectedPlan.replace(/_/g, ' ')} plan
            </li>
            {customerData.devices.map((device, idx) => (
              <li key={idx} style={{marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <span style={{color: 'var(--tmobile-success)'}}>✓</span>
                Line {idx + 1}: {device.newPhone?.replace(/_/g, ' ')} {device.storage}
              </li>
            ))}
            {bestDeal.promotionsApplied?.map((promo, idx) => (
              <li key={idx} style={{marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <span style={{color: 'var(--tmobile-success)'}}>✓</span>
                {promo}
              </li>
            ))}
          </ul>
        </div>

        <div style={{
          background: 'rgba(226, 0, 116, 0.1)',
          borderRadius: '10px',
          padding: '1rem',
          marginBottom: '1rem'
        }}>
          <h4 style={{marginBottom: '0.5rem', color: 'var(--tmobile-magenta)'}}>
            Next Steps
          </h4>
          <ol style={{marginLeft: '1.5rem', fontSize: '0.9rem'}}>
            <li>Review quote details with customer</li>
            <li>Verify customer eligibility for promotions</li>
            <li>Process trade-ins if applicable</li>
            <li>Activate new lines and services</li>
            <li>Schedule follow-up for accessory installation</li>
          </ol>
        </div>

        <div style={{
          textAlign: 'center',
          paddingTop: '1rem',
          borderTop: '1px solid var(--tmobile-light-gray)',
          fontSize: '0.75rem',
          color: 'var(--tmobile-gray)'
        }}>
          <p>This quote is valid for 30 days. Prices and promotions subject to change.</p>
          <p>T-Mobile Store {repInfo.storeId || '####'} | {repInfo.name || 'Representative'}</p>
        </div>
      </div>
    </div>
  );
}

export default QuoteGenerator;