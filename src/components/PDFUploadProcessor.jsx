import { useState, useRef } from 'react';
import PDFProcessor from '../utils/pdfProcessor';
import PricingUpdater from '../utils/pricingUpdater';

function PDFUploadProcessor({ onDataExtracted }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [updateSummary, setUpdateSummary] = useState(null);
  const fileInputRef = useRef(null);
  
  const processor = new PDFProcessor();
  const pricingUpdater = new PricingUpdater();

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return;
    }
    
    await processFile(file);
  };

  const processFile = async (file) => {
    setIsProcessing(true);
    setError(null);
    setResults(null);
    setUpdateSummary(null);
    
    try {
      console.log('🔄 Starting PDF processing...');
      const result = await processor.processPDF(file, {
        includeRawText: false
      });
      
      if (result.success) {
        setResults(result);
        
        // Validate the extracted data
        const validationErrors = processor.validateData(result.extractedData);
        if (validationErrors.length > 0) {
          console.warn('⚠️ Validation warnings:', validationErrors);
        }
        
        // Generate pricing update summary
        console.log('🔄 Analyzing pricing updates...');
        const updateSummary = await pricingUpdater.processExtractedData(result.extractedData);
        const validation = pricingUpdater.validateUpdates(updateSummary);
        
        setUpdateSummary({
          ...updateSummary,
          validation
        });
        
        // Notify parent component
        if (onDataExtracted) {
          onDataExtracted({
            ...result,
            updateSummary: {
              ...updateSummary,
              validation
            }
          });
        }
        
        console.log('✅ PDF processing and pricing analysis completed successfully');
      } else {
        setError(result.error || 'Failed to process PDF');
      }
    } catch (err) {
      console.error('❌ PDF processing error:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      processFile(pdfFile);
    } else {
      setError('Please drop a PDF file');
    }
  };

  const formatJSON = (obj) => {
    return JSON.stringify(obj, null, 2);
  };

  return (
    <div className="pdf-upload-processor">
      <div className="upload-section">
        <h3>📄 T-Mobile PDF Processor</h3>
        <p className="description">
          Upload T-Mobile rate sheets, promotional flyers, or device pricing documents to automatically extract structured pricing data.
        </p>
        
        <div 
          className={`upload-area ${isProcessing ? 'processing' : ''}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          
          {isProcessing ? (
            <div className="processing-indicator">
              <div className="spinner"></div>
              <p>Processing PDF with AI...</p>
              <small>This may take 30-60 seconds</small>
            </div>
          ) : (
            <div className="upload-prompt">
              <div className="upload-icon">📤</div>
              <p><strong>Click to upload</strong> or drag and drop</p>
              <small>PDF files up to 10MB</small>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="error-message">
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {results && (
        <div className="results-section">
          <h4>✅ Processing Results</h4>
          <div className="result-summary">
            <p><strong>File:</strong> {results.filename}</p>
            <p><strong>Text Extracted:</strong> {results.textLength.toLocaleString()} characters</p>
            <p><strong>Status:</strong> <span className="success">Success</span></p>
          </div>

          {results.extractedData && (
            <div className="extracted-data">
              <h5>📋 Extracted Data:</h5>
              
              {results.extractedData.documentType && (
                <p><strong>Document Type:</strong> {results.extractedData.documentType}</p>
              )}
              
              {results.extractedData.effectiveDate && (
                <p><strong>Effective Date:</strong> {results.extractedData.effectiveDate}</p>
              )}

              {results.extractedData.plans && results.extractedData.plans.length > 0 && (
                <div className="data-section">
                  <h6>📱 Plans Found ({results.extractedData.plans.length}):</h6>
                  <ul>
                    {results.extractedData.plans.map((plan, index) => (
                      <li key={index}>
                        <strong>{plan.name}</strong> - ${plan.finalPrice || plan.basePrice}/mo
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {results.extractedData.devices && results.extractedData.devices.length > 0 && (
                <div className="data-section">
                  <h6>📱 Devices Found ({results.extractedData.devices.length}):</h6>
                  <ul>
                    {results.extractedData.devices.map((device, index) => (
                      <li key={index}>
                        <strong>{device.name}</strong> {device.storage && `(${device.storage})`} - ${device.retailPrice}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {results.extractedData.promotions && results.extractedData.promotions.length > 0 && (
                <div className="data-section">
                  <h6>🎯 Promotions Found ({results.extractedData.promotions.length}):</h6>
                  <ul>
                    {results.extractedData.promotions.map((promo, index) => (
                      <li key={index}>
                        <strong>{promo.name}</strong> - ${promo.value} ({promo.description})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <details className="json-details">
                <summary>🔍 View Raw JSON Data</summary>
                <pre className="json-output">
                  {formatJSON(results.extractedData)}
                </pre>
              </details>
            </div>
          )}

          {/* Pricing Update Summary */}
          {updateSummary && (
            <div className="update-summary-section">
              <h4>🔧 Pricing Update Analysis</h4>
              
              <div className="update-overview">
                <div className="update-stats">
                  <div className="stat-item">
                    <span className="stat-number">{updateSummary.plansFound}</span>
                    <span className="stat-label">Plans</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{updateSummary.devicesFound}</span>
                    <span className="stat-label">Devices</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{updateSummary.promotionsFound}</span>
                    <span className="stat-label">Promotions</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">{updateSummary.proposedUpdates.length}</span>
                    <span className="stat-label">Updates</span>
                  </div>
                </div>
                
                {updateSummary.effectiveDate && (
                  <p><strong>Effective Date:</strong> {updateSummary.effectiveDate}</p>
                )}
                
                {updateSummary.documentType && (
                  <p><strong>Document Type:</strong> {updateSummary.documentType}</p>
                )}
              </div>

              {/* Validation Results */}
              {updateSummary.validation && (
                <div className="validation-results">
                  <h5>⚠️ Validation Results</h5>
                  
                  {updateSummary.validation.warnings.length > 0 && (
                    <div className="warnings">
                      <h6>Warnings:</h6>
                      <ul>
                        {updateSummary.validation.warnings.map((warning, index) => (
                          <li key={index} className="warning-item">{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {updateSummary.validation.recommendations.length > 0 && (
                    <div className="recommendations">
                      <h6>Recommendations:</h6>
                      <ul>
                        {updateSummary.validation.recommendations.map((rec, index) => (
                          <li key={index} className="recommendation-item">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Proposed Updates */}
              {updateSummary.proposedUpdates.length > 0 && (
                <div className="proposed-updates">
                  <h5>📝 Proposed Updates</h5>
                  
                  {updateSummary.proposedUpdates.map((update, index) => (
                    <div key={index} className="update-item">
                      <div className="update-header">
                        <span className="update-type">{update.type.replace('_', ' ').toUpperCase()}</span>
                        <span className="update-target">
                          {update.planName || update.deviceName || update.promotionName || `Tier ${update.tier}`}
                        </span>
                      </div>
                      
                      <div className="update-changes">
                        {update.changes.map((change, changeIndex) => (
                          <div key={changeIndex} className="change-item">
                            <span className="change-description">{change.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="update-actions">
                <button className="btn-primary" onClick={() => alert('Update functionality coming soon!')}>
                  🚀 Apply Updates
                </button>
                <button className="btn-secondary" onClick={() => setUpdateSummary(null)}>
                  ❌ Dismiss Analysis
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .pdf-upload-processor {
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          margin: 1rem 0;
        }
        
        .upload-section h3 {
          color: var(--tmobile-magenta);
          margin: 0 0 0.5rem 0;
        }
        
        .description {
          color: #666;
          margin-bottom: 1.5rem;
          line-height: 1.4;
        }
        
        .upload-area {
          border: 2px dashed #ccc;
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #fafafa;
        }
        
        .upload-area:hover {
          border-color: var(--tmobile-magenta);
          background: #f8f8f8;
        }
        
        .upload-area.processing {
          border-color: var(--tmobile-magenta);
          background: #fff;
          cursor: not-allowed;
        }
        
        .upload-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        
        .processing-indicator {
          color: var(--tmobile-magenta);
        }
        
        .spinner {
          width: 30px;
          height: 30px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid var(--tmobile-magenta);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-message {
          background: #fee;
          color: #c33;
          padding: 1rem;
          border-radius: 6px;
          margin-top: 1rem;
          border-left: 4px solid #c33;
        }
        
        .results-section {
          background: #f0f8f0;
          padding: 1.5rem;
          border-radius: 8px;
          margin-top: 1rem;
          border-left: 4px solid #4CAF50;
        }
        
        .result-summary {
          margin-bottom: 1rem;
        }
        
        .success {
          color: #4CAF50;
          font-weight: bold;
        }
        
        .extracted-data h5, .extracted-data h6 {
          color: var(--tmobile-magenta);
          margin: 1rem 0 0.5rem 0;
        }
        
        .data-section {
          margin: 1rem 0;
          padding: 1rem;
          background: white;
          border-radius: 6px;
          border: 1px solid #ddd;
        }
        
        .data-section ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        
        .data-section li {
          margin: 0.25rem 0;
        }
        
        .json-details {
          margin-top: 1rem;
        }
        
        .json-details summary {
          cursor: pointer;
          font-weight: bold;
          color: var(--tmobile-magenta);
          padding: 0.5rem;
          background: white;
          border-radius: 4px;
        }
        
        .json-output {
          background: #f5f5f5;
          padding: 1rem;
          border-radius: 6px;
          overflow-x: auto;
          font-size: 0.85rem;
          line-height: 1.4;
          margin-top: 0.5rem;
        }
        
        /* Update Summary Styles */
        .update-summary-section {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          margin-top: 1rem;
          border-left: 4px solid var(--tmobile-magenta);
        }
        
        .update-summary-section h4 {
          color: var(--tmobile-magenta);
          margin: 0 0 1rem 0;
        }
        
        .update-stats {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.75rem;
          background: white;
          border-radius: 6px;
          border: 1px solid #ddd;
          min-width: 80px;
        }
        
        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: var(--tmobile-magenta);
        }
        
        .stat-label {
          font-size: 0.85rem;
          color: #666;
        }
        
        .validation-results {
          background: white;
          padding: 1rem;
          border-radius: 6px;
          margin: 1rem 0;
          border: 1px solid #ddd;
        }
        
        .validation-results h5 {
          color: #ff9800;
          margin: 0 0 0.5rem 0;
        }
        
        .warnings ul, .recommendations ul {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        
        .warning-item {
          color: #ff9800;
          margin: 0.25rem 0;
        }
        
        .recommendation-item {
          color: #2196F3;
          margin: 0.25rem 0;
        }
        
        .proposed-updates {
          background: white;
          padding: 1rem;
          border-radius: 6px;
          margin: 1rem 0;
          border: 1px solid #ddd;
        }
        
        .proposed-updates h5 {
          color: var(--tmobile-magenta);
          margin: 0 0 1rem 0;
        }
        
        .update-item {
          border: 1px solid #eee;
          border-radius: 4px;
          margin: 0.5rem 0;
          padding: 0.75rem;
          background: #fafafa;
        }
        
        .update-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .update-type {
          background: var(--tmobile-magenta);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: bold;
        }
        
        .update-target {
          font-weight: bold;
          color: #333;
        }
        
        .update-changes {
          margin-top: 0.5rem;
        }
        
        .change-item {
          padding: 0.25rem 0;
          color: #666;
          font-size: 0.9rem;
        }
        
        .update-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
          flex-wrap: wrap;
        }
        
        .btn-primary, .btn-secondary {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.2s ease;
        }
        
        .btn-primary {
          background: var(--tmobile-magenta);
          color: white;
        }
        
        .btn-primary:hover {
          background: #c20066;
          transform: translateY(-1px);
        }
        
        .btn-secondary {
          background: #6c757d;
          color: white;
        }
        
        .btn-secondary:hover {
          background: #5a6268;
        }
      `}</style>
    </div>
  );
}

export default PDFUploadProcessor;