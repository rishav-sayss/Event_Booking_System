const { validationResult } = require('express-validator');
const { AppError } = require('./error');

function validate(req, _res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const messages = result.array().map((e) => `${e.path}: ${e.msg}`).join('; ');
  next(new AppError(messages, 422));
}

module.exports = { validate };
