const jwt = require('jsonwebtoken');
const { NotAuthorizedError } = require('../errors/not-authorized-err');

module.exports.auth = (req, res, next) => {
  const { token } = req.cookies;
  let payload;

  try {
    if (!token) {
      next(new NotAuthorizedError('Необходима авторизация'));
    }
    payload = jwt.verify(token, '4PgzIvqPt4i08qhHTg8MZCWruulpojs6');
  } catch (err) {
    next(new NotAuthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
