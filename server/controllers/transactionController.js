const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const { ALL_CATEGORIES, INCOME_CATEGORIES, EXPENSE_CATEGORIES } = require('../utils/categories');

const buildDateRange = (from, to) => {
  if (!from && !to) return null;
  const range = {};
  if (from) {
    const fromDate = new Date(from);
    if (!Number.isNaN(fromDate.getTime())) {
      range.$gte = fromDate;
    }
  }
  if (to) {
    const toDate = new Date(to);
    if (!Number.isNaN(toDate.getTime())) {
      range.$lte = toDate;
    }
  }
  return Object.keys(range).length ? range : null;
};

const list = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
    const skip = (page - 1) * limit;

    const filter = { userId: req.user.id };
    const { type, category, from, to, search } = req.query;

    if (type === 'income' || type === 'expense') {
      filter.type = type;
    }

    if (category && ALL_CATEGORIES.includes(category)) {
      filter.category = category;
    }

    const dateRange = buildDateRange(from, to);
    if (dateRange) {
      filter.date = dateRange;
    }

    if (typeof search === 'string' && search.trim().length > 0) {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [{ note: regex }, { category: regex }];
    }

    const [items, total] = await Promise.all([
      Transaction.find(filter).sort({ date: -1, createdAt: -1 }).skip(skip).limit(limit),
      Transaction.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid transaction id' });
    }

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    return res.json({ success: true, data: transaction });
  } catch (err) {
    return next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { type, amount, category, note, date } = req.body;

    const transaction = await Transaction.create({
      userId: req.user.id,
      type,
      amount,
      category,
      note,
      date: date || undefined,
    });

    return res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    return next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid transaction id' });
    }

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const updates = req.body;
    Object.keys(updates).forEach((field) => {
      transaction[field] = updates[field];
    });

    const saved = await transaction.save();
    return res.json({ success: true, data: saved });
  } catch (err) {
    return next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid transaction id' });
    }

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    if (transaction.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    await transaction.deleteOne();
    return res.json({ success: true, message: 'Transaction deleted' });
  } catch (err) {
    return next(err);
  }
};

const summary = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    const dateRange = buildDateRange(from, to);
    const match = { userId: new mongoose.Types.ObjectId(req.user.id) };
    if (dateRange) {
      match.date = dateRange;
    }

    const results = await Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const summaryData = results.reduce(
      (acc, item) => {
        if (item._id === 'income') acc.income = item.total;
        if (item._id === 'expense') acc.expense = item.total;
        return acc;
      },
      { income: 0, expense: 0 }
    );

    return res.json({ success: true, data: summaryData });
  } catch (err) {
    return next(err);
  }
};

const categories = async (req, res) => {
  return res.json({
    success: true,
    data: {
      income: INCOME_CATEGORIES,
      expense: EXPENSE_CATEGORIES,
    },
  });
};

module.exports = {
  list,
  getById,
  create,
  update,
  remove,
  summary,
  categories,
};
