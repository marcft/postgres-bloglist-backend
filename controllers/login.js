const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = require('express').Router();

const { SECRET } = require('../utils/config');
const { User, ActiveSession } = require('../models');
const { userExtractor } = require('../utils/middleware');

const getActiveSessionToken = async (user) => {
  const activeSession = await ActiveSession.findOne({
    where: {
      userId: user.id,
    },
  });

  if (!activeSession) return null;

  try {
    jwt.verify(activeSession.sessionToken, SECRET);
    return activeSession.sessionToken;
  } catch {
    await activeSession.destroy();
    return null;
  }
};

router.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({
    where: {
      username: username,
    },
  });

  if (!user) {
    return response.status(401).json({ error: 'Invalid username' });
  }

  if (user.disabled !== false) {
    return response.status(401).json({ error: 'User currently disabled' });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordCorrect) {
    return response.status(401).json({ error: 'Invalid password' });
  }

  let currentToken = await getActiveSessionToken(user);

  console.log(currentToken);

  if (!currentToken) {
    currentToken = jwt.sign(
      {
        username: user.username,
        id: user.id,
      },
      SECRET,
      { expiresIn: '24h' }
    );

    await ActiveSession.create({
      userId: user.id,
      sessionToken: currentToken,
    });
  }

  response
    .status(200)
    .send({ token: currentToken, username: user.username, name: user.name });
});

// Middleware verifies the token and sets req.user, returning an error for invalid tokens.
// Just if no token is provided, it sets req.user to null and continues.
router.use(userExtractor);

router.delete('/', async (request, response) => {
  if (request.user === null) {
    return response.status(401).json({ error: 'Unauthorized log out' });
  }

  await ActiveSession.destroy({
    where: {
      userId: request.user.id,
    },
  });

  response.status(204).end();
});

module.exports = router;
