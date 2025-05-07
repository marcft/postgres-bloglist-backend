const jwt = require('jsonwebtoken');

const { SECRET } = require('../utils/config');
const { User, ActiveSession } = require('../models');

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  } else {
    req.token = null;
  }
  next();
};

const userExtractor = async (req, res, next) => {
  // App won't throw any error if you access an API point with no auth need
  if (req.token === null) {
    req.user = null;
    next();
    return;
  }

  const decodedToken = jwt.verify(req.token, SECRET);

  const user = await User.findByPk(decodedToken.id);
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }

  const activeSession = await ActiveSession.findOne({
    where: {
      userId: user.id,
      sessionToken: req.token,
    },
  });

  if (user.disabled !== false) {
    if (activeSession) {
      await activeSession.destroy();
    }
    return res.status(401).json({ error: 'User currently disabled' });
  }

  if (!activeSession) {
    return res.status(401).json({ error: 'Please log in again' });
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

  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' });
  }

  next(error);
};

module.exports = { errorHandler, tokenExtractor, userExtractor };
