const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/not-authorized-err');
const { JWT_SECRET } = require('../utils/constants');

module.exports.auth = (req, res, next) => {
  const { token } = req.cookies;
  let payload;

  try {
    if (!token) {
      next(new NotAuthorizedError('Необходима авторизация'));
    }
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new NotAuthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
