// Store and Rep Management System

export const defaultStoreData = {
  storeId: '',
  storeName: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  manager: ''
};

export const defaultRepData = {
  id: '',
  name: '',
  email: '',
  phone: '',
  role: 'Mobile Expert',
  storeId: '',
  photoUrl: '',
  isActive: true
};

// Store data management
export const StoreManager = {
  getStore: () => {
    const stored = localStorage.getItem('tmobile-store-info');
    return stored ? JSON.parse(stored) : defaultStoreData;
  },
  
  setStore: (storeData) => {
    localStorage.setItem('tmobile-store-info', JSON.stringify(storeData));
    return storeData;
  },
  
  isConfigured: () => {
    const store = StoreManager.getStore();
    return store.storeId && store.address && store.phone;
  }
};

// Rep data management
export const RepManager = {
  getAllReps: () => {
    const stored = localStorage.getItem('tmobile-reps');
    return stored ? JSON.parse(stored) : [];
  },
  
  addRep: (repData) => {
    const reps = RepManager.getAllReps();
    const newRep = {
      ...defaultRepData,
      ...repData,
      id: repData.id || `rep-${Date.now()}`
    };
    reps.push(newRep);
    localStorage.setItem('tmobile-reps', JSON.stringify(reps));
    return newRep;
  },
  
  updateRep: (repId, updates) => {
    const reps = RepManager.getAllReps();
    const index = reps.findIndex(r => r.id === repId);
    if (index !== -1) {
      reps[index] = { ...reps[index], ...updates };
      localStorage.setItem('tmobile-reps', JSON.stringify(reps));
      return reps[index];
    }
    return null;
  },
  
  deleteRep: (repId) => {
    const reps = RepManager.getAllReps();
    const filtered = reps.filter(r => r.id !== repId);
    localStorage.setItem('tmobile-reps', JSON.stringify(filtered));
    return true;
  },
  
  getCurrentRep: () => {
    const currentRepId = localStorage.getItem('tmobile-current-rep');
    if (currentRepId) {
      const reps = RepManager.getAllReps();
      return reps.find(r => r.id === currentRepId) || null;
    }
    return null;
  },
  
  setCurrentRep: (repId) => {
    localStorage.setItem('tmobile-current-rep', repId);
    return RepManager.getCurrentRep();
  }
};

// Sample data for Cheyenne Bahadur
export const sampleRepData = {
  name: 'Cheyenne Bahadur',
  email: 'Cheyenne.Bahadur3@T-Mobile.com',
  phone: '561.330.6211',
  role: 'Mobile Expert',
  storeId: '7785'
};

export const sampleStoreData = {
  storeId: '7785',
  storeName: 'T-Mobile Delray Beach',
  address: '1821 S Federal Hwy Ste 202',
  city: 'Delray Beach',
  state: 'FL',
  zip: '33483',
  phone: '561.330.6211',
  manager: 'Store Manager'
};