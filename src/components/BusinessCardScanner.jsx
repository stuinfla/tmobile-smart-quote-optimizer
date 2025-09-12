import { useState, useRef } from 'react';
import { RepManager } from '../data/storeData';

function BusinessCardScanner({ onComplete }) {
  const [scanning, setScanning] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Parse business card text using patterns
  const extractInfoFromText = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    
    const data = {
      name: '',
      email: '',
      phone: '',
      role: 'Mobile Expert',
      storeId: ''
    };

    // Extract patterns
    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
    const phonePattern = /(\d{3}[.\-\s]?\d{3}[.\-\s]?\d{4})/;
    const storePattern = /Store\s*(\d+)/i;
    
    // Look for email
    const emailMatch = text.match(emailPattern);
    if (emailMatch) {
      data.email = emailMatch[1];
    }
    
    // Look for phone
    const phoneMatch = text.match(phonePattern);
    if (phoneMatch) {
      data.phone = phoneMatch[1].replace(/[^\d.]/g, '');
    }
    
    // Look for store number
    const storeMatch = text.match(storePattern);
    if (storeMatch) {
      data.storeId = storeMatch[1];
    }
    
    // Try to find name (usually one of the first lines that's not T-Mobile)
    for (const line of lines) {
      if (!line.includes('Mobile') && !line.includes('Store') && 
          !line.includes('@') && !line.match(/\d{3}/) &&
          line.length > 5 && line.length < 50) {
        // Check if it looks like a name (contains letters and possibly spaces)
        if (/^[A-Za-z\s]+$/.test(line.trim())) {
          data.name = line.trim();
          break;
        }
      }
    }
    
    // Look for role/title
    const rolePatterns = ['Mobile Expert', 'Manager', 'Assistant Manager', 'Sales Associate'];
    for (const pattern of rolePatterns) {
      if (text.includes(pattern)) {
        data.role = pattern;
        break;
      }
    }
    
    return data;
  };

  // Simulate OCR with Canvas text extraction (in production, use real OCR API)
  const processImage = async (file) => {
    setScanning(true);
    
    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
    
    // Simulate OCR processing
    setTimeout(() => {
      // In production, you'd use an OCR API like Tesseract.js or Google Vision API
      // For demo, we'll use sample data
      const simulatedOCRText = `
        CHEY BAHADUR
        Mobile Expert
        T-Mobile
        Delray Beach
        Store 7785
        Phone: 561.330.6211
        Email: Cheyenne.Bahadur3@T-Mobile.com
        1821 S Federal Hwy Ste 202
        Delray Beach, FL 33483
      `;
      
      const extracted = extractInfoFromText(simulatedOCRText);
      setExtractedData(extracted);
      setScanning(false);
    }, 2000);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  };

  const handleCapture = () => {
    fileInputRef.current.click();
  };

  const handleSave = () => {
    if (extractedData) {
      const newRep = RepManager.addRep(extractedData);
      RepManager.setCurrentRep(newRep.id);
      if (onComplete) {
        onComplete(newRep);
      }
    }
  };

  const handleEdit = (field, value) => {
    setExtractedData({
      ...extractedData,
      [field]: value
    });
  };

  return (
    <div className="card-scanner">
      <h2>Add Sales Rep</h2>
      
      {!imagePreview && (
        <div className="scanner-start">
          <div className="scan-options">
            <button 
              className="scan-btn camera"
              onClick={handleCapture}
            >
              <div className="scan-icon">📸</div>
              <span>Scan Business Card</span>
            </button>
            
            <button 
              className="scan-btn manual"
              onClick={() => setExtractedData({
                name: '',
                email: '',
                phone: '',
                role: 'Mobile Expert',
                storeId: ''
              })}
            >
              <div className="scan-icon">✏️</div>
              <span>Enter Manually</span>
            </button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      )}
      
      {scanning && (
        <div className="scanning-indicator">
          <div className="spinner"></div>
          <p>Scanning business card...</p>
        </div>
      )}
      
      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Business card" />
        </div>
      )}
      
      {extractedData && !scanning && (
        <div className="extracted-data">
          <h3>Review Information</h3>
          <div className="data-fields">
            <div className="field-group">
              <label>Name</label>
              <input
                type="text"
                value={extractedData.name}
                onChange={(e) => handleEdit('name', e.target.value)}
                placeholder="Rep Name"
              />
            </div>
            
            <div className="field-group">
              <label>Email</label>
              <input
                type="email"
                value={extractedData.email}
                onChange={(e) => handleEdit('email', e.target.value)}
                placeholder="email@t-mobile.com"
              />
            </div>
            
            <div className="field-group">
              <label>Phone</label>
              <input
                type="tel"
                value={extractedData.phone}
                onChange={(e) => handleEdit('phone', e.target.value)}
                placeholder="555.555.5555"
              />
            </div>
            
            <div className="field-group">
              <label>Role</label>
              <select
                value={extractedData.role}
                onChange={(e) => handleEdit('role', e.target.value)}
              >
                <option>Mobile Expert</option>
                <option>Senior Mobile Expert</option>
                <option>Assistant Manager</option>
                <option>Store Manager</option>
              </select>
            </div>
            
            <div className="field-group">
              <label>Store ID</label>
              <input
                type="text"
                value={extractedData.storeId}
                onChange={(e) => handleEdit('storeId', e.target.value)}
                placeholder="Store Number"
              />
            </div>
          </div>
          
          <div className="scanner-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => {
                setExtractedData(null);
                setImagePreview(null);
              }}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!extractedData.name}
            >
              Save Rep
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .card-scanner {
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .card-scanner h2 {
          color: var(--tmobile-magenta);
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .scan-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .scan-btn {
          padding: 2rem 1rem;
          border: 2px solid var(--tmobile-light-gray);
          border-radius: 12px;
          background: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          transition: all 0.2s;
          cursor: pointer;
        }
        
        .scan-btn:hover {
          border-color: var(--tmobile-magenta);
          background: rgba(226, 0, 116, 0.05);
        }
        
        .scan-icon {
          font-size: 3rem;
        }
        
        .scanning-indicator {
          text-align: center;
          padding: 3rem;
        }
        
        .image-preview {
          margin: 1rem 0;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .image-preview img {
          width: 100%;
          height: auto;
        }
        
        .extracted-data h3 {
          color: var(--tmobile-black);
          margin-bottom: 1rem;
        }
        
        .data-fields {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        
        .field-group label {
          display: block;
          font-size: 0.875rem;
          color: var(--tmobile-gray);
          margin-bottom: 0.25rem;
        }
        
        .field-group input,
        .field-group select {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid var(--tmobile-light-gray);
          border-radius: 8px;
          font-size: 1rem;
        }
        
        .field-group input:focus,
        .field-group select:focus {
          outline: none;
          border-color: var(--tmobile-magenta);
        }
        
        .scanner-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }
      `}</style>
    </div>
  );
}

export default BusinessCardScanner;