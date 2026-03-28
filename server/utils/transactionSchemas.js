const Joi = require('joi');
const { ALL_CATEGORIES } = require('./categories');

const baseTransactionSchema = {
  type: Joi.string().valid('income', 'expense'),
  amount: Joi.number().min(0),
  category: Joi.string().valid(...ALL_CATEGORIES),
  note: Joi.string().trim().max(250).allow('').optional(),
  date: Joi.date(),
};

const createTransactionSchema = Joi.object({
  ...baseTransactionSchema,
  type: baseTransactionSchema.type.required(),
  amount: baseTransactionSchema.amount.required(),
  category: baseTransactionSchema.category.required(),
}).required();

const updateTransactionSchema = Joi.object({
  ...baseTransactionSchema,
}).min(1);

module.exports = {
  createTransactionSchema,
  updateTransactionSchema,
};
