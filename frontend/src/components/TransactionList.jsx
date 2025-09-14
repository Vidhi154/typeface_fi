import React, { useState } from 'react';
import api from '../api/api';

export default function TransactionList({ 
  transactions = [], 
  onDeleted, 
  isLoading = false,
  error = null,
  pagination = null 
}) {
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    setDeletingIds(prev => new Set([...prev, id]));
    setDeleteError(null);

    try {
      await api.delete(`/transactions/${id}`);
      onDeleted && onDeleted();
    } catch (error) {
      console.error('Delete failed:', error);
      setDeleteError('Failed to delete transaction. Please try again.');
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, 
  });
};


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTransactionIcon = (type) => {
    return type === 'income' ? '↗️' : '↙️';
  };

  const getTransactionColor = (type) => {
    return type === 'income' 
      ? 'text-green-600 bg-green-50 border-green-200' 
      : 'text-red-600 bg-red-50 border-red-200';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-lg mb-4 text-gray-800">Recent Transactions</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex justify-between items-center p-3 border border-gray-200 rounded-lg">
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-lg mb-4 text-gray-800">Recent Transactions</h3>
        <div className="text-center py-8">
          <div className="text-red-500 text-2xl mb-2">⚠️</div>
          <p className="text-red-600 font-medium">Failed to load transactions</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg text-gray-800">
          Recent Transactions
          {pagination?.total && (
            <span className="text-sm font-normal text-gray-500 ml-2">
              ({pagination.total} total)
            </span>
          )}
        </h3>
        
        {transactions.length > 0 && (
          <div className="text-sm text-gray-500">
            Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {deleteError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{deleteError}</p>
        </div>
      )}

      {transactions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-3">💳</div>
          <p className="text-lg font-medium mb-2">No transactions yet</p>
          <p className="text-sm">Start by adding your first income or expense transaction</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map(tx => {
            const isDeleting = deletingIds.has(tx._id);
            
            return (
              <div
                key={tx._id}
                className={`flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all duration-200 ${
                  isDeleting ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  {/* Transaction Type Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${getTransactionColor(tx.type)}`}>
                    {getTransactionIcon(tx.type)}
                  </div>
                  
                  {/* Transaction Details */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900 capitalize">
                        {tx.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.type}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                      <span>{formatDate(tx.date)}</span>
                      {tx.description && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-xs">{tx.description}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Amount */}
                  <div className="text-right">
                    <div className={`font-semibold ${
                      tx.type === 'income' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {tx.type === 'income' ? '+' : ''}{formatCurrency(tx.amount)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete(tx._id)}
                      disabled={isDeleting}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                      title="Delete transaction"
                    >
                      {isDeleting ? (
                        <div className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination info */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <span>
              {pagination.total} total transactions
            </span>
          </div>
        </div>
      )}
    </div>
  );
}