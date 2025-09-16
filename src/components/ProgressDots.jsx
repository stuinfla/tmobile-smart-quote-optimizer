import React from 'react';

const steps = [
  { id: 'customerType', name: 'Customer Type' },
  { id: 'lines', name: 'Lines' },
  { id: 'carrier', name: 'Carrier' },
  { id: 'currentPhones', name: 'Trade-in' },
  { id: 'newPhones', name: 'New Phones' },
  { id: 'plan', name: 'Plan' },
  { id: 'insurance', name: 'Insurance' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'summary', name: 'Summary' }
];

function ProgressDots({ currentStep, onStepClick }) {
  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'white',
      padding: '0.75rem 1rem',
      borderTop: '1px solid #e0e0e0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '0.5rem',
      zIndex: 1000
    }}>
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isClickable = index <= currentIndex;

        return (
          <button
            key={step.id}
            onClick={() => isClickable && onStepClick && onStepClick(step.id)}
            disabled={!isClickable}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              border: 'none',
              background: isCompleted ? '#22c55e' : 
                         isCurrent ? '#e20074' : '#e0e0e0',
              cursor: isClickable ? 'pointer' : 'default',
              transition: 'all 0.2s',
              transform: isCurrent ? 'scale(1.2)' : 'scale(1)'
            }}
            title={step.name}
          />
        );
      })}
      
      {/* Current step name */}
      <div style={{
        marginLeft: '0.5rem',
        fontSize: '0.75rem',
        color: '#666',
        fontWeight: 500
      }}>
        {steps[currentIndex]?.name || currentStep}
      </div>
    </div>
  );
}

export default ProgressDots;