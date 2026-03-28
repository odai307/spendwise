const Joi = require('joi');
const { ALL_CATEGORIES } = require('./categories');

const monthPattern = /^\d{4}-\d{2}$/;

const categoryLimitSchema = Joi.object({
  category: Joi.string()
    .valid(...ALL_CATEGORIES)
    .required(),
  limit: Joi.number().min(0).required(),
});

const upsertBudgetSchema = Joi.object({
  month: Joi.string().pattern(monthPattern).optional(),
  categoryLimits: Joi.array().items(categoryLimitSchema).default([]),
}).required();

module.exports = {
  upsertBudgetSchema,
};
