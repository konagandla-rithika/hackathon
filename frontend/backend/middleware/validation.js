const { validationResult } = require('express-validator');

// Handle validation errors from express-validator
function validationHandler(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

module.exports = validationHandler;
