import '../styles/floating-buttons.css';

function FloatingContinueButton({ 
  onContinue, 
  onBack, 
  onSkip,
  continueText = 'Continue',
  skipText = null,
  disabled = false,
  showBack = false,
  currentStep = null
}) {
  return (
    <div className="floating-continue-container">
      <div className="floating-continue-wrapper">
        {showBack && onBack ? (
          <div className="floating-buttons-group">
            <button 
              className="floating-back-btn"
              onClick={onBack}
            >
              ← Back
            </button>
            <button 
              className={`floating-continue-btn floating-continue-btn-with-back ${disabled ? 'disabled' : ''}`}
              onClick={onContinue}
              disabled={disabled}
            >
              {continueText} →
            </button>
          </div>
        ) : (
          <>
            <button 
              className={`floating-continue-btn ${disabled ? 'disabled' : ''}`}
              onClick={onContinue}
              disabled={disabled}
            >
              {continueText} →
            </button>
            {skipText && onSkip && (
              <button 
                className="floating-skip-btn"
                onClick={onSkip}
              >
                {skipText}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FloatingContinueButton;