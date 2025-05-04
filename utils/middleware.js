const jwt = require('jsonwebtoken');

const { SECRET } = require('../utils/config');
const { User } = require('../models');

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  } else {
    req.token = null;
  }
  next();
};

const userFinder = async (req, res, next) => {
  if (req.token === null) {
    return res.status(401).json({ error: 'token missing' });
  }
  const decodedToken = jwt.verify(req.token, SECRET);

  const user = await User.findByPk(decodedToken.id);
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }
  req.user = user;

  next();
};

const errorHandler = (error, request, response, next) => {
  console.log('Error from the errorHandler:', error.message);

  if (
    error.name === 'SequelizeValidationError' ||
    error.name == 'SequelizeUniqueConstraintError'
  ) {
    return response.status(400).json({
      error: error.message,
      details: error.errors.map((e) => e.message),
    });
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return response.status(400).json({
      error: `Foreign key constraint failed: ${
        error.index || 'Invalid reference to another table.'
      }`,
    });
  }

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' });
  }

  next(error);
};

module.exports = { errorHandler, tokenExtractor, userFinder };
