const errorHandler = (error, request, response, next) => {
  console.log('Error from the errorHandler:', error.message);

  if (
    error.name === 'SequelizeValidationError' ||
    error.name == 'SequelizeUniqueConstraintError'
  ) {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = { errorHandler };
