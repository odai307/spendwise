const validateBody = (schema) => (req, res, next) => {
  const { value, error } = schema.validate(req.body, {
    abortEarly: true,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  req.body = value;
  return next();
};

module.exports = validateBody;
