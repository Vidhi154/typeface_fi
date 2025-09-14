// routes/receipts.js - MongoDB version
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Tesseract = require('tesseract.js');
const pdf2pic = require('pdf2pic');
const Receipt = require('../models/Receipt'); // Your MongoDB model
const Expense = require('../models/Expense'); // Your existing expense model
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/receipts/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDF files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Receipt data parser class
class ReceiptParser {
  static parseReceiptText(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Extract total amount
    const amountPattern = /(?:total|amount|sum)?\s*\$?(\d+[.,]\d{2})/i;
    const amounts = [];
    
    lines.forEach(line => {
      const match = line.match(amountPattern);
      if (match) {
        amounts.push(parseFloat(match[1].replace(',', '.')));
      }
    });
    
    // Extract date
    const datePattern = /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/;
    let extractedDate = null;
    
    lines.forEach(line => {
      const match = line.match(datePattern);
      if (match && !extractedDate) {
        const dateStr = match[0];
        extractedDate = new Date(dateStr);
        if (isNaN(extractedDate)) {
          extractedDate = null;
        }
      }
    });
    
    // Extract merchant name
    let merchantName = '';
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const line = lines[i];
      if (!/\d{3,}/.test(line) && line.length > 2 && line.length < 50) {
        merchantName = line;
        break;
      }
    }
    
    // Extract items
    const items = [];
    const itemPattern = /^(.+?)\s+\$?(\d+[.,]\d{2})$/;
    
    lines.forEach(line => {
      const match = line.match(itemPattern);
      if (match && !line.toLowerCase().includes('total')) {
        items.push({
          name: match[1].trim(),
          price: parseFloat(match[2].replace(',', '.'))
        });
      }
    });
    
    return {
      merchantName: merchantName || 'Unknown Merchant',
      amount: Math.max(...amounts) || 0,
      date: extractedDate || new Date(),
      items: items,
      rawText: text,
      confidence: this.calculateConfidence(merchantName, amounts, extractedDate)
    };
  }
  
  static calculateConfidence(merchant, amounts, date) {
    let score = 0;
    if (merchant && merchant !== 'Unknown Merchant') score += 30;
    if (amounts.length > 0) score += 40;
    if (date) score += 30;
    return score;
  }
}

// OCR processing functions
async function processReceiptImage(imagePath) {
  try {
    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
      logger: m => console.log(m)
    });
    return text;
  } catch (error) {
    throw new Error('OCR processing failed: ' + error.message);
  }
}

async function processPDF(pdfPath) {
  try {
    const convert = pdf2pic.fromPath(pdfPath, {
      density: 300,
      saveFilename: "page",
      savePath: path.dirname(pdfPath),
      format: "png",
      width: 2000,
      height: 2000
    });
    
    const result = await convert(1, { responseType: "image" });
    const text = await processReceiptImage(result.path);
    
    // Clean up temporary image
    await fs.unlink(result.path);
    
    return text;
  } catch (error) {
    throw new Error('PDF processing failed: ' + error.message);
  }
}

// POST /api/receipts/upload - Upload and process receipt
router.post('/upload', upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }
    
    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    
    let extractedText;
    
    // Process based on file type
    if (fileType.startsWith('image/')) {
      extractedText = await processReceiptImage(filePath);
    } else if (fileType === 'application/pdf') {
      extractedText = await processPDF(filePath);
    }
    
    // Parse the extracted text
    const parsedData = ReceiptParser.parseReceiptText(extractedText);
    
    // Save receipt record to MongoDB
    const receiptDoc = new Receipt({
      userId: req.user?._id, // Adjust based on your auth middleware
      originalFilename: req.file.originalname,
      filePath: filePath,
      fileType: fileType,
      fileSize: req.file.size,
      processingStatus: 'completed',
      extractedData: parsedData,
      confidenceScore: parsedData.confidence,
      uploadDate: new Date()
    });
    
    const savedReceipt = await receiptDoc.save();
    
    res.json({
      success: true,
      receiptId: savedReceipt._id,
      extractedData: parsedData,
      needsReview: parsedData.confidence < 70
    });
    
  } catch (error) {
    console.error('Receipt processing error:', error);
    
    // Clean up uploaded file on error
    if (req.file && req.file.path) {
      try {
        await fs.unlink(req.file.path);
      } catch (cleanupError) {
        console.error('Failed to cleanup file:', cleanupError);
      }
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to process receipt',
      details: error.message 
    });
  }
});

// POST /api/receipts/confirm - Create expense from confirmed receipt data
router.post('/confirm', async (req, res) => {
  try {
    const { receiptId, confirmedData } = req.body;
    
    // Validate confirmed data
    if (!confirmedData.amount || !confirmedData.merchantName) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required expense data' 
      });
    }
    
    // Find the receipt
    const receipt = await Receipt.findById(receiptId);
    if (!receipt) {
      return res.status(404).json({ 
        success: false,
        error: 'Receipt not found' 
      });
    }
    
    // Create expense using your existing Expense model
    const expenseDoc = new Expense({
      userId: req.user?._id, // Adjust based on your auth middleware
      amount: parseFloat(confirmedData.amount),
      description: confirmedData.merchantName,
      category: confirmedData.category || 'Other',
      date: new Date(confirmedData.date),
      type: 'expense',
      source: 'receipt_upload',
      receiptId: receiptId,
      // Add any other fields your Expense model requires
      notes: confirmedData.description || ''
    });
    
    const savedExpense = await expenseDoc.save();
    
    // Update receipt status
    receipt.linkedExpenseId = savedExpense._id;
    receipt.processingStatus = 'linked';
    await receipt.save();
    
    res.json({
      success: true,
      expenseId: savedExpense._id,
      message: 'Expense created successfully from receipt'
    });
    
  } catch (error) {
    console.error('Receipt confirmation error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to create expense from receipt',
      details: error.message 
    });
  }
});

// GET /api/receipts - List user's receipts
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const receipts = await Receipt.find({ 
      userId: req.user?._id 
    })
    .populate('linkedExpenseId')
    .sort({ uploadDate: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
    
    const total = await Receipt.countDocuments({ userId: req.user?._id });
    
    res.json({
      success: true,
      receipts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Receipts list error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch receipts' 
    });
  }
});

// GET /api/receipts/:id - Get specific receipt
router.get('/:id', async (req, res) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      userId: req.user?._id
    }).populate('linkedExpenseId');
    
    if (!receipt) {
      return res.status(404).json({ 
        success: false,
        error: 'Receipt not found' 
      });
    }
    
    res.json({
      success: true,
      receipt
    });
    
  } catch (error) {
    console.error('Receipt fetch error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch receipt details' 
    });
  }
});

// DELETE /api/receipts/:id - Delete receipt and associated file
router.delete('/:id', async (req, res) => {
  try {
    const receipt = await Receipt.findOne({
      _id: req.params.id,
      userId: req.user?._id
    });
    
    if (!receipt) {
      return res.status(404).json({ 
        success: false,
        error: 'Receipt not found' 
      });
    }
    
    // Delete file from filesystem
    try {
      await fs.unlink(receipt.filePath);
    } catch (fileError) {
      console.warn('Could not delete receipt file:', fileError.message);
    }
    
    // Delete from database
    await Receipt.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Receipt deleted successfully'
    });
    
  } catch (error) {
    console.error('Receipt deletion error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete receipt' 
    });
  }
});

module.exports = router;