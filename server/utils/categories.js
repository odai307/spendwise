const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Rent',
  'Utilities',
  'Health',
  'Entertainment',
  'Shopping',
  'Education',
  'Other',
];

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Gift',
  'Investment',
  'Other',
];

const ALL_CATEGORIES = Array.from(new Set([
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES,
]));

module.exports = {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  ALL_CATEGORIES,
};
