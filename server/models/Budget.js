const mongoose = require('mongoose');

const categoryLimitSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true,
    },
    limit: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    month: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}$/,
    },
    categoryLimits: {
      type: [categoryLimitSchema],
      default: [],
      validate: {
        validator: function (value) {
          const categories = value.map((v) => v.category);
          return new Set(categories).size === categories.length;
        },
        message: 'Duplicate categories are not allowed in categoryLimits',
      },
    },
  },
  { timestamps: true }
);

budgetSchema.index({ userId: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
