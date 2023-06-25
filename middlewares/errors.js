module.exports = ((err, req, res, next) => {
  if (err.message === 'Validation failed') {
    res.status(err.statusCode ? err.statusCode : 400).send({ message: err.message });
  } else {
    res.status(err.statusCode ? err.statusCode : 500).send({ message: err.message });
  }
  next();
});
