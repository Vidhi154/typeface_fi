const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');

/**
 * Create transaction
 */
exports.createTransaction = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { type, amount, category, description, date } = req.body;
    const tx = new Transaction({
      user: req.user.id,
      type,
      amount,
      category,
      description,
      date: date ? new Date(date) : new Date()
    });
    await tx.save();
    res.status(201).json(tx);
  } catch (err) {
    next(err);
  }
};

/**
 * List transactions with filters, pagination, date range
 */
exports.listTransactions = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, startDate, endDate, type } = req.query;
    const query = { user: req.user.id };

    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [items, total] = await Promise.all([
      Transaction.find(query).sort({ date: -1 }).skip(skip).limit(parseInt(limit)),
      Transaction.countDocuments(query)
    ]);

    const pages = Math.ceil(total / limit);
    res.json({ items, total, page: parseInt(page), pages });
  } catch (err) {
    next(err);
  }
};

/**
 * Summary for charts: grouped by category or date
 */
exports.summaryByCategory = async (req, res, next) => {
  try {
    const pipeline = [
      { $match: { user: req.user.id } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ];
    const result = await Transaction.aggregate(pipeline);
    res.json(result.map(r => ({ category: r._id, total: r.total })));
  } catch (err) {
    next(err);
  }
};

exports.deleteTransaction = async (req, res, next) => {
  try {
    const tx = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};