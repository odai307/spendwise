const Budget = require('../models/Budget');
const Transaction = require('../models/Transaction');

const getMonthString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

const getMonthRange = (month) => {
  const [year, monthStr] = month.split('-').map(Number);
  const start = new Date(year, monthStr - 1, 1);
  const end = new Date(year, monthStr, 0, 23, 59, 59, 999);
  return { start, end };
};

const getCurrent = async (req, res, next) => {
  try {
    const month = req.query.month || getMonthString(new Date());
    const budget = await Budget.findOne({ userId: req.user.id, month });
    return res.json({
      success: true,
      data: budget || { month, categoryLimits: [] },
    });
  } catch (err) {
    return next(err);
  }
};

const upsert = async (req, res, next) => {
  try {
    const month = req.body.month || getMonthString(new Date());
    const categoryLimits = req.body.categoryLimits || [];

    const budget = await Budget.findOneAndUpdate(
      { userId: req.user.id, month },
      { $set: { categoryLimits } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return res.json({ success: true, data: budget });
  } catch (err) {
    return next(err);
  }
};

const status = async (req, res, next) => {
  try {
    const month = req.query.month || getMonthString(new Date());
    const budget = await Budget.findOne({ userId: req.user.id, month });

    if (!budget) {
      return res.json({
        success: true,
        data: { month, categories: [], totalBudget: 0, totalSpent: 0 },
      });
    }

    const { start, end } = getMonthRange(month);

    const spending = await Transaction.aggregate([
      {
        $match: {
          userId: budget.userId,
          type: 'expense',
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: '$category',
          spent: { $sum: '$amount' },
        },
      },
    ]);

    const spentByCategory = spending.reduce((acc, item) => {
      acc[item._id] = item.spent;
      return acc;
    }, {});

    const categories = budget.categoryLimits.map((item) => {
      const spent = spentByCategory[item.category] || 0;
      const remaining = Math.max(item.limit - spent, 0);
      const percentUsed = item.limit > 0 ? Number(((spent / item.limit) * 100).toFixed(1)) : null;
      return {
        category: item.category,
        limit: item.limit,
        spent,
        remaining,
        percentUsed,
      };
    });

    const totalBudget = budget.categoryLimits.reduce((sum, item) => sum + item.limit, 0);
    const totalSpent = categories.reduce((sum, item) => sum + item.spent, 0);

    return res.json({
      success: true,
      data: {
        month,
        categories,
        totalBudget,
        totalSpent,
      },
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getCurrent,
  upsert,
  status,
};
