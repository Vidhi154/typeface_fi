const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middlewares/auth');
const Receipt = require('../models/Receipt');

const Tesseract = require('tesseract.js');
const pdf = require('pdf-parse');

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Receipts route is working ✅" });
});

// Extract text from image using Tesseract
const extractTextFromImage = async (filePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
    return text;
  } catch (err) {
    console.error('Tesseract error:', err);
    return '';
  }
};

// Extract text from PDF
const extractTextFromPDF = async (filePath) => {
  const buffer = fs.readFileSync(filePath);
  const data = await pdf(buffer);
  return data.text;
};

// Parse date and total from OCR text
const parseReceiptText = (text) => {
  const dateMatch = text.match(/\b\d{2}[\/\-]\d{2}[\/\-]\d{2,4}\b/);
  const totalMatch = text.match(/(?:Total|TOTAL|total|Amount|AMOUNT)[:\s₹$]*([\d,.]+)/i);

  return {
    date: dateMatch ? dateMatch[0] : null,
    total: totalMatch ? parseFloat(totalMatch[1].replace(/,/g, '')) : null,
    rawText: text
  };
};

// Upload receipt route
router.post('/upload', protect, upload.single('receipt'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path;
    let text;

    if (req.file.mimetype.includes('pdf')) {
      text = await extractTextFromPDF(filePath);
    } else {
      text = await extractTextFromImage(filePath);
    }

    const parsedData = parseReceiptText(text);

    const newReceipt = await Receipt.create({
      user: req.user.id,
      fileName: req.file.originalname,
      fileUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
      date: parsedData.date,
      amount: parsedData.total,
      rawText: parsedData.rawText
    });

    res.status(201).json({
      _id: newReceipt._id,
      fileName: newReceipt.fileName,
      fileUrl: newReceipt.fileUrl,
      date: parsedData.date,
      total: parsedData.total,
      rawText: parsedData.rawText
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload or parse receipt' });
  }
});

// Get all receipts
router.get('/', protect, async (req, res) => {
  try {
    const receipts = await Receipt.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(receipts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch receipts' });
  }
});

module.exports = router;
