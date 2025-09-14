// import React, { useState } from 'react';
// import api from '../api/api';

// export default function TransactionForm({ onCreated }) {
//   const [form, setForm] = useState({ type: 'expense', amount: '', category: '', description: '', date: '' });
//   const [error, setError] = useState(null);

//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post('/transactions', { ...form, amount: parseFloat(form.amount) });
//       setForm({ type: 'expense', amount: '', category: '', description: '', date: '' });
//       onCreated && onCreated();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed');
//     }
//   };

//   return (
//     <div className="p-4 border rounded mb-4">
//       <h3 className="font-semibold mb-2">Add Transaction</h3>
//       {error && <div className="text-red-600">{error}</div>}
//       <form onSubmit={submit} className="space-y-2">
//         <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="p-2 border rounded w-full">
//           <option value="expense">Expense</option>
//           <option value="income">Income</option>
//         </select>
//         <input value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="Amount" className="w-full p-2 border rounded" />
//         <input value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="Category" className="w-full p-2 border rounded" />
//         <input value={form.date} onChange={e => setForm({...form, date: e.target.value})} type="date" className="w-full p-2 border rounded" />
//         <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description" className="w-full p-2 border rounded" />
//         <button className="px-4 py-2 bg-green-600 text-white rounded">Add</button>
//       </form>
//     </div>
//   );
// }
import React, { useState } from 'react';
import api from '../api/api';

export default function TransactionForm({ onCreated }) {
  const [form, setForm] = useState({ 
    type: 'expense', 
    amount: '', 
    category: '', 
    description: '', 
    date: new Date().toISOString().split('T')[0] // Default to today
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Predefined categories for better UX
  const categories = {
    expense: [
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Entertainment',
      'Bills & Utilities',
      'Healthcare',
      'Education',
      'Travel',
      'Insurance',
      'Other'
    ],
    income: [
      'Salary',
      'Freelance',
      'Business',
      'Investment',
      'Gift',
      'Bonus',
      'Other'
    ]
  };

  const validateForm = () => {
    if (!form.amount || form.amount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return false;
    }
    if (form.amount > 10000000) {
      setError('Amount cannot exceed ₹1,00,00,000');
      return false;
    }
    if (!form.category.trim()) {
      setError('Please select or enter a category');
      return false;
    }
    if (!form.date) {
      setError('Please select a date');
      return false;
    }
    
    const selectedDate = new Date(form.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); 
    if (selectedDate > today) {
      setError('Date cannot be in the future');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        category: form.category.trim()
      };

      await api.post('/transactions', payload);
      
      // Reset form
      setForm({ 
        type: 'expense', 
        amount: '', 
        category: '', 
        description: '', 
        date: new Date().toISOString().split('T')[0]
      });
      
      setSuccessMessage(`${form.type === 'income' ? 'Income' : 'Expense'} added successfully!`);
      
      
      if (onCreated) onCreated();

      
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (err) {
      console.error('Transaction creation error:', err);
      setError(err.response?.data?.message || 'Failed to add transaction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
   
    if (error) setError(null);
    if (successMessage) setSuccessMessage(null);
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^\d.]/g, ''); 
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) { 
      handleInputChange('amount', value);
    }
  };

  return (
    <div className="space-y-4">
      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-600 text-sm font-medium">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Transaction Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleInputChange('type', 'expense')}
              className={`p-4 border-2 rounded-lg text-sm font-medium transition-colors ${
                form.type === 'expense'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">↙️</span>
                <span>Expense</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleInputChange('type', 'income')}
              className={`p-4 border-2 rounded-lg text-sm font-medium transition-colors ${
                form.type === 'income'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-lg">↗️</span>
                <span>Income</span>
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-sm">₹</span>
              </div>
              <input
                id="amount"
                type="text"
                value={form.amount}
                onChange={handleAmountChange}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="0.00"
                disabled={isLoading}
                required
              />
            </div>
            {form.amount && (
              <p className="text-xs text-gray-500 mt-1">
                Amount: ₹{formatCurrency(form.amount)}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              id="date"
              type="date"
              value={form.date}
              onChange={e => handleInputChange('date', e.target.value)}
              max={new Date().toISOString().split('T')[0]} // Prevent future dates
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {/* Category dropdown/input */}
            <input
              id="category"
              type="text"
              value={form.category}
              onChange={e => handleInputChange('category', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter or select a category"
              disabled={isLoading}
              list="category-suggestions"
              required
            />
            
            {/* Datalist for suggestions */}
            <datalist id="category-suggestions">
              {categories[form.type].map(category => (
                <option key={category} value={category} />
              ))}
            </datalist>

            {/* Quick category buttons */}
            <div className="flex flex-wrap gap-2">
              {categories[form.type].slice(0, 5).map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleInputChange('category', category)}
                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  disabled={isLoading}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description <span className="text-gray-400">(Optional)</span>
          </label>
          <textarea
            id="description"
            value={form.description}
            onChange={e => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
            placeholder="Add a note about this transaction (optional)"
            disabled={isLoading}
            maxLength={500}
          />
          {form.description && (
            <p className="text-xs text-gray-500 mt-1">
              {form.description.length}/500 characters
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !form.amount || !form.category || !form.date}
          className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors ${
            form.type === 'income'
              ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Adding {form.type}...
            </>
          ) : (
            <>
              <span className="mr-2">
                {form.type === 'income' ? '↗️' : '↙️'}
              </span>
              Add {form.type === 'income' ? 'Income' : 'Expense'}
            </>
          )}
        </button>
      </form>

     
    </div>
  );
}