const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const auth = require('../middlewares/auth');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/', auth.protect, [
  body('type').isIn(['income','expense']).withMessage('Type income|expense'),
  body('amount').isNumeric().withMessage('Amount must be a number'),
  body('category').notEmpty()
], transactionController.createTransaction);

router.get('/', auth.protect, transactionController.listTransactions);

router.get('/summary/category', auth.protect, transactionController.summaryByCategory);

router.delete('/:id', auth.protect, transactionController.deleteTransaction);

/**
 * Receipt upload endpoint (bonus): accepts PDF/image, attempts to parse
 */
const parseReceipt = require('../utils/parseReceipt');
router.post('/uploadReceipt', auth.protect, upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    const parsed = await parseReceipt(req.file.path);
    // parsed should contain extracted transactions or text - client can use to create transactions
    res.json({ parsed });
  } catch (err) {
    next(err);
  }
});

module.exports = router;