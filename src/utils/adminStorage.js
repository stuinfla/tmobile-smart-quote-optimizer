// Admin data persistent storage utility
import adminData from '../data/adminData.json';

class AdminStorage {
  constructor() {
    this.storageKey = 'tmobile-admin-data';
    this.backupKey = 'tmobile-admin-backup';
    this.initializeStorage();
  }

  initializeStorage() {
    // Load from localStorage or use default data
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      this.saveData(adminData);
    }
  }

  // Get all admin data
  getData() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : adminData;
  }

  // Save all admin data
  saveData(data) {
    // Create backup before saving
    const current = localStorage.getItem(this.storageKey);
    if (current) {
      localStorage.setItem(this.backupKey, current);
    }
    
    // Update timestamp
    data.settings.lastBackup = new Date().toISOString();
    
    // Save to localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(data, null, 2));
    return true;
  }

  // Store management
  getStores() {
    return this.getData().stores || [];
  }

  getStore(storeId) {
    const stores = this.getStores();
    return stores.find(store => store.id === storeId);
  }

  addStore(storeData) {
    const data = this.getData();
    const newStore = {
      id: storeData.id || `store-${Date.now()}`,
      name: storeData.name,
      address: storeData.address,
      city: storeData.city,
      state: storeData.state,
      zip: storeData.zip,
      phone: storeData.phone,
      manager: storeData.manager,
      region: storeData.region || '',
      district: storeData.district || '',
      hours: storeData.hours || this.getDefaultHours()
    };
    
    data.stores.push(newStore);
    this.saveData(data);
    return newStore;
  }

  updateStore(storeId, updates) {
    const data = this.getData();
    const storeIndex = data.stores.findIndex(store => store.id === storeId);
    
    if (storeIndex !== -1) {
      data.stores[storeIndex] = { ...data.stores[storeIndex], ...updates };
      this.saveData(data);
      return data.stores[storeIndex];
    }
    return null;
  }

  deleteStore(storeId) {
    const data = this.getData();
    data.stores = data.stores.filter(store => store.id !== storeId);
    
    // Remove reps from deleted store
    data.salesReps = data.salesReps.filter(rep => rep.storeId !== storeId);
    
    this.saveData(data);
    return true;
  }

  // Sales rep management
  getSalesReps(storeId = null) {
    const reps = this.getData().salesReps || [];
    return storeId ? reps.filter(rep => rep.storeId === storeId) : reps;
  }

  getSalesRep(repId) {
    const reps = this.getSalesReps();
    return reps.find(rep => rep.id === repId);
  }

  addSalesRep(repData) {
    const data = this.getData();
    const newRep = {
      id: repData.id || `rep-${Date.now()}`,
      name: repData.name,
      email: repData.email,
      phone: repData.phone,
      role: repData.role || 'Mobile Expert',
      storeId: repData.storeId,
      employeeId: repData.employeeId || '',
      hireDate: repData.hireDate || new Date().toISOString().split('T')[0],
      specialties: repData.specialties || [],
      certifications: repData.certifications || [],
      active: repData.active !== false
    };
    
    data.salesReps.push(newRep);
    this.saveData(data);
    return newRep;
  }

  updateSalesRep(repId, updates) {
    const data = this.getData();
    const repIndex = data.salesReps.findIndex(rep => rep.id === repId);
    
    if (repIndex !== -1) {
      data.salesReps[repIndex] = { ...data.salesReps[repIndex], ...updates };
      this.saveData(data);
      return data.salesReps[repIndex];
    }
    return null;
  }

  deleteSalesRep(repId) {
    const data = this.getData();
    data.salesReps = data.salesReps.filter(rep => rep.id !== repId);
    this.saveData(data);
    return true;
  }

  // Current selections
  getCurrentStore() {
    const data = this.getData();
    const storeId = data.settings.defaultStoreId;
    return this.getStore(storeId);
  }

  setCurrentStore(storeId) {
    const data = this.getData();
    data.settings.defaultStoreId = storeId;
    this.saveData(data);
  }

  getCurrentRep() {
    const data = this.getData();
    const repId = data.settings.currentRepId;
    return this.getSalesRep(repId);
  }

  setCurrentRep(repId) {
    const data = this.getData();
    data.settings.currentRepId = repId;
    this.saveData(data);
  }

  // Utility functions
  getDefaultHours() {
    return {
      monday: "10:00 AM - 8:00 PM",
      tuesday: "10:00 AM - 8:00 PM",
      wednesday: "10:00 AM - 8:00 PM", 
      thursday: "10:00 AM - 8:00 PM",
      friday: "10:00 AM - 9:00 PM",
      saturday: "10:00 AM - 9:00 PM",
      sunday: "11:00 AM - 7:00 PM"
    };
  }

  // Import/Export functions
  exportData() {
    const data = this.getData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tmobile-admin-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importData(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      this.saveData(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Backup and restore
  createBackup() {
    const data = this.getData();
    localStorage.setItem(this.backupKey, JSON.stringify(data, null, 2));
    return true;
  }

  restoreBackup() {
    const backup = localStorage.getItem(this.backupKey);
    if (backup) {
      localStorage.setItem(this.storageKey, backup);
      return true;
    }
    return false;
  }

  clearAllData() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.backupKey);
    this.initializeStorage();
  }
}

// Create singleton instance
export const adminStorage = new AdminStorage();
export default adminStorage;