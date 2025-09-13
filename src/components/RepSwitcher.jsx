import { useState, useEffect } from 'react';
import { RepManager } from '../data/storeData';
import BusinessCardScanner from './BusinessCardScanner';
import '../styles/RepSwitcher.css';

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
      <div className="rep-modal-overlay" onClick={() => setShowScanner(false)}>
        <div className="rep-modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="rep-close-btn" onClick={() => setShowScanner(false)}>×</button>
          <BusinessCardScanner onComplete={handleAddRep} />
        </div>
      </div>
    );
  }

  if (showEditor) {
    return (
      <div className="rep-modal-overlay" onClick={() => setShowEditor(false)}>
        <div className="rep-modal-content edit-rep-modal" onClick={(e) => e.stopPropagation()}>
          <div className="rep-modal-header">
            <h2>Edit Sales Rep</h2>
            <button className="rep-close-btn" onClick={() => setShowEditor(false)}>×</button>
          </div>

          <div className="edit-form">
            <div className="form-group">
              <label>Name *</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                placeholder="Full Name"
                autoComplete="name"
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
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                placeholder="(555) 123-4567"
                autoComplete="tel"
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

          <div className="rep-modal-actions">
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
    <div className="rep-switcher-wrapper">
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
        <div className="rep-modal-overlay" onClick={() => setShowSwitcher(false)}>
          <div className="rep-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="rep-modal-header">
              <h2>Switch Sales Rep</h2>
              <button className="rep-close-btn" onClick={() => setShowSwitcher(false)}>×</button>
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
                        onClick={(e) => e.stopPropagation()}
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
    </div>
  );
}

export default RepSwitcher;