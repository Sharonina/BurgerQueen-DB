function errorHandler(error, req, res, next) {
  res.status(error.statusCode || 500).send({ message: error.message });
}

module.exports = { errorHandler };
