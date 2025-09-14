// models/Receipt.js - MongoDB Receipt Schema
const mongoose = require('mongoose');

const receiptItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  }
});

const receiptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  originalFilename: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true,
    enum: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
  },
  fileSize: {
    type: Number,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now,
    index: true
  },
  processingStatus: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'linked'],
    default: 'pending',
    index: true
  },
  extractedData: {
    merchantName: String,
    amount: Number,
    date: Date,
    items: [receiptItemSchema],
    rawText: String,
    confidence: Number
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  linkedExpenseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense',
    default: null
  },
  processingErrors: [{
    error: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
receiptSchema.index({ userId: 1, uploadDate: -1 });
receiptSchema.index({ processingStatus: 1 });
receiptSchema.index({ 'extractedData.merchantName': 1 });

module.exports = mongoose.model('Receipt', receiptSchema);

// ========================================

// models/Expense.js - Update your existing Expense model
// Add these fields to your existing Expense schema:

/*
// Add these fields to your existing Expense schema:
const expenseSchema = new mongoose.Schema({
  // ... your existing fields ...
  
  // Add these new fields for receipt integration:
  source: {
    type: String,
    enum: ['manual', 'receipt_upload', 'bank_import', 'api'],
    default: 'manual'
  },
  receiptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Receipt',
    default: null
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// If you don't have these indexes, add them:
expenseSchema.index({ userId: 1, date: -1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ source: 1 });
*/