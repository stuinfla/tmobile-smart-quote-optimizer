import { useState, useEffect } from 'react';
import { StoreManager } from '../data/storeData';
import { RepManager } from '../data/storeData';
import '../styles/admin-dashboard.css';

function AdminDashboard({ onClose, currentRep, onRepChange }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [storeInfo, setStoreInfo] = useState(StoreManager.getStore());
  const [reps, setReps] = useState(RepManager.getAllReps());
  const [editingRep, setEditingRep] = useState(null);
  const [showAddRep, setShowAddRep] = useState(false);
  const [newRep, setNewRep] = useState({ name: '', employeeId: '', email: '' });

  // Mock analytics data
  const analytics = {
    todayQuotes: 24,
    weekQuotes: 156,
    monthQuotes: 892,
    conversionRate: 68,
    avgDealSize: 2847,
    topPlan: 'Experience Beyond',
    topPhone: 'iPhone 17 Pro'
  };

  const handleAddRep = () => {
    if (newRep.name && newRep.employeeId) {
      const rep = RepManager.addRep({
        ...newRep,
        storeId: storeInfo?.storeId || '001'
      });
      setReps(RepManager.getAllReps());
      setNewRep({ name: '', employeeId: '', email: '' });
      setShowAddRep(false);
    }
  };

  const handleUpdateRep = (repId, updates) => {
    RepManager.updateRep(repId, updates);
    setReps(RepManager.getAllReps());
    setEditingRep(null);
  };

  const handleDeleteRep = (repId) => {
    if (confirm('Remove this sales representative?')) {
      RepManager.deleteRep(repId);
      setReps(RepManager.getAllReps());
    }
  };

  const handleUpdateStore = (updates) => {
    const updatedStore = { ...storeInfo, ...updates };
    StoreManager.saveStore(updatedStore);
    setStoreInfo(updatedStore);
  };

  return (
    <div className="admin-overlay">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-content">
            <div>
              <h1 className="admin-title">Store Manager Dashboard</h1>
              <p className="admin-subtitle">{storeInfo?.name || 'T-Mobile Store'} • {storeInfo?.storeId || '001'}</p>
            </div>
            <button className="admin-close" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-nav">
          <button 
            className={`admin-nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="nav-icon">📊</span>
            Overview
          </button>
          <button 
            className={`admin-nav-tab ${activeTab === 'team' ? 'active' : ''}`}
            onClick={() => setActiveTab('team')}
          >
            <span className="nav-icon">👥</span>
            Team
          </button>
          <button 
            className={`admin-nav-tab ${activeTab === 'store' ? 'active' : ''}`}
            onClick={() => setActiveTab('store')}
          >
            <span className="nav-icon">🏪</span>
            Store Settings
          </button>
          <button 
            className={`admin-nav-tab ${activeTab === 'performance' ? 'active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            <span className="nav-icon">📈</span>
            Performance
          </button>
        </div>

        {/* Content Area */}
        <div className="admin-content">
          {activeTab === 'overview' && (
            <div className="dashboard-grid">
              {/* Key Metrics */}
              <div className="metric-card primary">
                <div className="metric-icon">📱</div>
                <div className="metric-content">
                  <div className="metric-value">{analytics.todayQuotes}</div>
                  <div className="metric-label">Today's Quotes</div>
                  <div className="metric-change positive">+12% vs yesterday</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">📈</div>
                <div className="metric-content">
                  <div className="metric-value">{analytics.conversionRate}%</div>
                  <div className="metric-label">Conversion Rate</div>
                  <div className="metric-change positive">+5% this week</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">💰</div>
                <div className="metric-content">
                  <div className="metric-value">${analytics.avgDealSize}</div>
                  <div className="metric-label">Avg Deal Size</div>
                  <div className="metric-change">4 lines average</div>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-icon">🏆</div>
                <div className="metric-content">
                  <div className="metric-value">{analytics.weekQuotes}</div>
                  <div className="metric-label">Week's Quotes</div>
                  <div className="metric-change">On track for goal</div>
                </div>
              </div>

              {/* Top Products */}
              <div className="insight-card">
                <h3 className="card-title">Top Sellers</h3>
                <div className="insight-list">
                  <div className="insight-item">
                    <span className="insight-label">Most Popular Plan</span>
                    <span className="insight-value">{analytics.topPlan}</span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">Top Device</span>
                    <span className="insight-value">{analytics.topPhone}</span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">Protection Rate</span>
                    <span className="insight-value">73% attach rate</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="action-card">
                <h3 className="card-title">Quick Actions</h3>
                <div className="action-buttons">
                  <button className="action-btn" onClick={() => setActiveTab('team')}>
                    Add New Rep
                  </button>
                  <button className="action-btn secondary">
                    Export Reports
                  </button>
                  <button className="action-btn secondary">
                    View Analytics
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="team-section">
              <div className="section-header">
                <h2 className="section-title">Sales Team</h2>
                <button 
                  className="btn-primary"
                  onClick={() => setShowAddRep(true)}
                >
                  + Add Representative
                </button>
              </div>

              {/* Add Rep Form */}
              {showAddRep && (
                <div className="add-rep-form card">
                  <h3>New Team Member</h3>
                  <div className="form-grid">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newRep.name}
                      onChange={(e) => setNewRep({...newRep, name: e.target.value})}
                      className="admin-input"
                    />
                    <input
                      type="text"
                      placeholder="Employee ID"
                      value={newRep.employeeId}
                      onChange={(e) => setNewRep({...newRep, employeeId: e.target.value})}
                      className="admin-input"
                    />
                    <input
                      type="email"
                      placeholder="Email (optional)"
                      value={newRep.email}
                      onChange={(e) => setNewRep({...newRep, email: e.target.value})}
                      className="admin-input"
                    />
                  </div>
                  <div className="form-actions">
                    <button className="btn-secondary" onClick={() => setShowAddRep(false)}>
                      Cancel
                    </button>
                    <button className="btn-primary" onClick={handleAddRep}>
                      Add Team Member
                    </button>
                  </div>
                </div>
              )}

              {/* Reps List */}
              <div className="reps-grid">
                {reps.map(rep => (
                  <div key={rep.id} className="rep-card">
                    {editingRep === rep.id ? (
                      <div className="rep-edit">
                        <input
                          type="text"
                          value={rep.name}
                          onChange={(e) => handleUpdateRep(rep.id, { name: e.target.value })}
                          className="admin-input"
                        />
                        <input
                          type="text"
                          value={rep.employeeId}
                          onChange={(e) => handleUpdateRep(rep.id, { employeeId: e.target.value })}
                          className="admin-input"
                        />
                        <div className="rep-actions">
                          <button 
                            className="btn-small primary"
                            onClick={() => setEditingRep(null)}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="rep-info">
                          <div className="rep-avatar">
                            {rep.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="rep-name">{rep.name}</div>
                            <div className="rep-id">ID: {rep.employeeId}</div>
                            {rep.id === currentRep?.id && (
                              <span className="rep-badge">Active</span>
                            )}
                          </div>
                        </div>
                        <div className="rep-actions">
                          <button 
                            className="btn-icon"
                            onClick={() => onRepChange(rep)}
                            title="Set as active"
                          >
                            ✓
                          </button>
                          <button 
                            className="btn-icon"
                            onClick={() => setEditingRep(rep.id)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                          <button 
                            className="btn-icon danger"
                            onClick={() => handleDeleteRep(rep.id)}
                            title="Remove"
                          >
                            🗑
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'store' && (
            <div className="store-section">
              <h2 className="section-title">Store Configuration</h2>
              
              <div className="settings-grid">
                <div className="setting-card">
                  <label className="setting-label">Store Name</label>
                  <input
                    type="text"
                    value={storeInfo?.name || ''}
                    onChange={(e) => handleUpdateStore({ name: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div className="setting-card">
                  <label className="setting-label">Store ID</label>
                  <input
                    type="text"
                    value={storeInfo?.storeId || ''}
                    onChange={(e) => handleUpdateStore({ storeId: e.target.value })}
                    className="admin-input"
                  />
                </div>

                <div className="setting-card">
                  <label className="setting-label">Region</label>
                  <select 
                    value={storeInfo?.region || 'southeast'}
                    onChange={(e) => handleUpdateStore({ region: e.target.value })}
                    className="admin-input"
                  >
                    <option value="southeast">Southeast</option>
                    <option value="northeast">Northeast</option>
                    <option value="midwest">Midwest</option>
                    <option value="west">West</option>
                  </select>
                </div>

                <div className="setting-card">
                  <label className="setting-label">Manager</label>
                  <input
                    type="text"
                    value={storeInfo?.manager || ''}
                    onChange={(e) => handleUpdateStore({ manager: e.target.value })}
                    className="admin-input"
                    placeholder="Store Manager Name"
                  />
                </div>
              </div>

              <div className="settings-actions">
                <button className="btn-primary">
                  Save Store Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="performance-section">
              <h2 className="section-title">Performance Analytics</h2>
              
              <div className="chart-grid">
                <div className="chart-card">
                  <h3 className="card-title">Monthly Trends</h3>
                  <div className="chart-placeholder">
                    <div className="chart-bar" style={{height: '60%'}}>Jan</div>
                    <div className="chart-bar" style={{height: '75%'}}>Feb</div>
                    <div className="chart-bar" style={{height: '85%'}}>Mar</div>
                    <div className="chart-bar" style={{height: '90%'}}>Apr</div>
                    <div className="chart-bar" style={{height: '95%'}}>May</div>
                  </div>
                </div>

                <div className="leaderboard-card">
                  <h3 className="card-title">Top Performers</h3>
                  <div className="leaderboard">
                    <div className="leader-item">
                      <span className="rank">1</span>
                      <span className="name">Sarah Johnson</span>
                      <span className="score">142 quotes</span>
                    </div>
                    <div className="leader-item">
                      <span className="rank">2</span>
                      <span className="name">Mike Chen</span>
                      <span className="score">128 quotes</span>
                    </div>
                    <div className="leader-item">
                      <span className="rank">3</span>
                      <span className="name">Lisa Martinez</span>
                      <span className="score">115 quotes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="admin-footer">
          <div className="footer-info">
            <span>T-Mobile Sales Edge v2.6.2</span>
            <span className="separator">•</span>
            <span>© 2025 ISOVision.ai</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;