import { useState, useEffect } from 'react';
import { RepManager } from '../data/storeData';
import BusinessCardScanner from './BusinessCardScanner';

function RepSwitcher({ currentRep, onRepChange }) {
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingRep, setEditingRep] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    storeId: ''
  });
  const [reps, setReps] = useState([]);
  const [selectedRepId, setSelectedRepId] = useState(currentRep?.id || '');

  useEffect(() => {
    loadReps();
  }, []);

  const loadReps = () => {
    const allReps = RepManager.getAllReps();
    setReps(allReps);
    if (currentRep) {
      setSelectedRepId(currentRep.id);
    }
  };

  const handleSwitch = () => {
    if (selectedRepId) {
      const rep = RepManager.setCurrentRep(selectedRepId);
      if (onRepChange) {
        onRepChange(rep);
      }
      setShowSwitcher(false);
    }
  };

  const handleAddRep = (newRep) => {
    loadReps();
    setSelectedRepId(newRep.id);
    handleSwitch();
    setShowScanner(false);
  };

  const handleEditRep = (rep) => {
    setEditingRep(rep);
    setEditForm({
      name: rep.name,
      email: rep.email || '',
      phone: rep.phone || '',
      role: rep.role || 'Mobile Expert',
      storeId: rep.storeId || ''
    });
    setShowEditor(true);
    setShowSwitcher(false);
  };

  const handleSaveEdit = () => {
    if (editForm.name.trim()) {
      const updatedRep = {
        ...editingRep,
        ...editForm,
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        role: editForm.role.trim() || 'Mobile Expert',
        storeId: editForm.storeId.trim()
      };
      
      RepManager.updateRep(editingRep.id, updatedRep);
      
      // If we're editing the current rep, update it
      if (currentRep && currentRep.id === editingRep.id && onRepChange) {
        onRepChange(updatedRep);
      }
      
      loadReps();
      setShowEditor(false);
      setEditingRep(null);
    }
  };

  const handleDeleteRep = (repId) => {
    if (confirm('Are you sure you want to remove this rep?')) {
      RepManager.deleteRep(repId);
      loadReps();
      if (repId === selectedRepId) {
        setSelectedRepId('');
      }
    }
  };

  if (showScanner) {
    return (
      <div className="modal-overlay" onClick={() => setShowScanner(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={() => setShowScanner(false)}>×</button>
          <BusinessCardScanner onComplete={handleAddRep} />
        </div>
      </div>
    );
  }

  if (showEditor) {
    return (
      <div className="modal-overlay" onClick={() => setShowEditor(false)}>
        <div className="modal-content edit-rep-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Edit Sales Rep</h2>
            <button className="close-btn" onClick={() => setShowEditor(false)}>×</button>
          </div>

          <div className="edit-form">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                placeholder="Full Name"
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                value={editForm.role}
                onChange={(e) => setEditForm({...editForm, role: e.target.value})}
              >
                <option value="Mobile Expert">Mobile Expert</option>
                <option value="Sales Representative">Sales Representative</option>
                <option value="Assistant Manager">Assistant Manager</option>
                <option value="Manager">Manager</option>
                <option value="Store Manager">Store Manager</option>
              </select>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                placeholder="email@example.com"
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="form-group">
              <label>Store ID</label>
              <input
                type="text"
                value={editForm.storeId}
                onChange={(e) => setEditForm({...editForm, storeId: e.target.value})}
                placeholder="Store Number"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button 
              className="btn btn-secondary"
              onClick={() => setShowEditor(false)}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleSaveEdit}
              disabled={!editForm.name.trim()}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="current-rep-container">
        <div 
          className="current-rep-display"
          onClick={() => setShowSwitcher(true)}
        >
          <span className="rep-icon">👤</span>
          <div className="rep-info">
            <span className="rep-name">{currentRep?.name || 'Select Rep'}</span>
            {currentRep?.role && (
              <span className="rep-role">{currentRep.role}</span>
            )}
          </div>
          <span className="switch-icon">🔄</span>
        </div>
        {currentRep && (
          <button
            className="quick-edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleEditRep(currentRep);
            }}
            title="Edit Current Rep"
          >
            ✏️
          </button>
        )}
      </div>

      {showSwitcher && (
        <div className="modal-overlay" onClick={() => setShowSwitcher(false)}>
          <div className="modal-content rep-switcher-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Switch Sales Rep</h2>
              <button className="close-btn" onClick={() => setShowSwitcher(false)}>×</button>
            </div>

            <div className="reps-list">
              {reps.length === 0 ? (
                <div className="no-reps">
                  <p>No sales reps added yet</p>
                </div>
              ) : (
                reps.map(rep => (
                  <div 
                    key={rep.id}
                    className={`rep-item ${selectedRepId === rep.id ? 'selected' : ''}`}
                    onClick={() => setSelectedRepId(rep.id)}
                  >
                    <div className="rep-select">
                      <input
                        type="radio"
                        checked={selectedRepId === rep.id}
                        onChange={() => setSelectedRepId(rep.id)}
                      />
                    </div>
                    <div className="rep-details">
                      <div className="rep-name">{rep.name}</div>
                      <div className="rep-meta">
                        {rep.role} • Store {rep.storeId}
                      </div>
                      {rep.email && (
                        <div className="rep-contact">{rep.email}</div>
                      )}
                      {rep.phone && (
                        <div className="rep-contact">{rep.phone}</div>
                      )}
                    </div>
                    <div className="rep-actions">
                      <button
                        className="edit-rep"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditRep(rep);
                        }}
                        title="Edit Rep Details"
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-rep"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRep(rep.id);
                        }}
                        title="Delete Rep"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="switcher-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setShowSwitcher(false);
                  setShowScanner(true);
                }}
              >
                + Add New Rep
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSwitch}
                disabled={!selectedRepId}
              >
                Switch to Selected
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .current-rep-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .current-rep-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.15);
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .current-rep-display:hover {
          background: rgba(255,255,255,0.25);
        }

        .quick-edit-btn {
          background: rgba(255,255,255,0.15);
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.2s;
        }

        .quick-edit-btn:hover {
          background: rgba(255,255,255,0.25);
          transform: scale(1.1);
        }

        .rep-icon {
          font-size: 1.2rem;
        }

        .rep-info {
          display: flex;
          flex-direction: column;
        }

        .rep-name {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .rep-role {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        .switch-icon {
          margin-left: 0.5rem;
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 500px;
          width: 100%;
          max-height: 80vh;
          overflow: auto;
        }

        .rep-switcher-modal {
          padding: 0;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--tmobile-light-gray);
        }

        .modal-header h2 {
          margin: 0;
          color: var(--tmobile-magenta);
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--tmobile-gray);
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reps-list {
          padding: 1rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .no-reps {
          text-align: center;
          padding: 2rem;
          color: var(--tmobile-gray);
        }

        .rep-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 2px solid var(--tmobile-light-gray);
          border-radius: 8px;
          margin-bottom: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .rep-item:hover {
          border-color: var(--tmobile-magenta);
          background: rgba(226, 0, 116, 0.02);
        }

        .rep-item.selected {
          border-color: var(--tmobile-magenta);
          background: rgba(226, 0, 116, 0.05);
        }

        .rep-select input {
          margin: 0;
        }

        .rep-details {
          flex: 1;
        }

        .rep-details .rep-name {
          font-weight: 600;
          color: var(--tmobile-black);
          margin-bottom: 0.25rem;
        }

        .rep-meta {
          font-size: 0.875rem;
          color: var(--tmobile-gray);
          margin-bottom: 0.25rem;
        }

        .rep-contact {
          font-size: 0.8rem;
          color: var(--tmobile-gray);
        }

        .rep-actions {
          display: flex;
          gap: 0.5rem;
        }

        .edit-rep,
        .delete-rep {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          opacity: 0.5;
          transition: opacity 0.2s;
          padding: 0.25rem;
          border-radius: 4px;
        }

        .edit-rep:hover {
          opacity: 1;
          background: rgba(226, 0, 116, 0.1);
        }

        .delete-rep:hover {
          opacity: 1;
          background: rgba(220, 53, 69, 0.1);
        }

        .edit-form {
          padding: 1.5rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--tmobile-black);
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid var(--tmobile-light-gray);
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: var(--tmobile-magenta);
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid var(--tmobile-light-gray);
          justify-content: flex-end;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-primary {
          background: var(--tmobile-magenta);
          color: white;
        }

        .btn-primary:hover {
          background: var(--tmobile-magenta-dark);
        }

        .btn-primary:disabled {
          background: var(--tmobile-gray);
          cursor: not-allowed;
        }

        .btn-secondary {
          background: var(--tmobile-light-gray);
          color: var(--tmobile-black);
        }

        .btn-secondary:hover {
          background: var(--tmobile-gray);
        }

        .switcher-actions {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid var(--tmobile-light-gray);
          justify-content: space-between;
        }

        @media (max-width: 600px) {
          .modal-content {
            max-height: 90vh;
          }
        }
      `}</style>
    </>
  );
}

export default RepSwitcher;