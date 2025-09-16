import React from 'react';

const CustomerTypeSelector = ({ onSelect, onNext }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome to T-Mobile!</h2>
          <p className="text-lg text-gray-600 mt-2">Are you a current T-Mobile customer?</p>
        </div>
        <button
          onClick={onNext}
          className="px-4 py-2 bg-tmobile-magenta text-white rounded-lg hover:bg-tmobile-dark-magenta transition-colors font-medium"
        >
          Next →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
        <button
          onClick={() => onSelect('existing')}
          className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-tmobile-magenta hover:shadow-lg transition-all group"
        >
          <div className="text-center">
            <div className="text-3xl mb-3">✅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Yes, I'm a Customer</h3>
            <p className="text-sm text-gray-600">I currently have T-Mobile service</p>
          </div>
        </button>

        <button
          onClick={() => onSelect('new')}
          className="p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-tmobile-magenta hover:shadow-lg transition-all group"
        >
          <div className="text-center">
            <div className="text-3xl mb-3">🆕</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No, I'm New</h3>
            <p className="text-sm text-gray-600">I want to switch to T-Mobile</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default CustomerTypeSelector;