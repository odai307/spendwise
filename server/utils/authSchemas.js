const Joi = require('joi');

const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(6).required(),
  currency: Joi.string().valid('GHS', 'USD', 'EUR', 'GBP').optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).optional(),
    lastName: Joi.string().trim().min(2).max(50).optional(),
    currency: Joi.string().valid('GHS', 'USD', 'EUR', 'GBP').optional(),
  }).min(1),
  changePasswordSchema: Joi.object({
    currentPassword: Joi.string().min(6).required(),
    newPassword: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required(),
  }).messages({
    'any.only': 'Confirm password must match new password',
  }),
};
