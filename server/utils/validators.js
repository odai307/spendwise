const requireFields = (body, fields) => {
  if (!body || typeof body !== 'object') return fields;
  return fields.filter((field) => body[field] === undefined || body[field] === null || body[field] === '');
};

const isEmail = (email) => {
  if (typeof email !== 'string') return false;
  // Simple and effective email validation for most app use-cases
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const isStrongPassword = (password) => {
  if (typeof password !== 'string') return false;
  return password.length >= 6;
};

const normalizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  return email.trim().toLowerCase();
};

module.exports = {
  requireFields,
  isEmail,
  isStrongPassword,
  normalizeEmail,
};
