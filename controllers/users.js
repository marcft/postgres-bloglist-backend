const bcrypt = require('bcrypt');
const router = require('express').Router();

const { User, Blog } = require('../models');

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: { exclude: ['userId'] },
    },
  });
  res.json(users);
});

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['passwordHash', 'createdAt', 'updatedAt'] },
    include: {
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['userId', 'createdAt', 'updatedAt'] },
      through: {
        attributes: ['id', 'read'],
      },
    },
  });
  res.json(user);
});

router.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  if (!password) {
    res.status(404).send({ error: 'You must provide a password' });
    return;
  }

  if (password.length < 3) {
    return res
      .status(400)
      .send({ error: 'Password has to be at least 3 characters long' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await User.create({ username, name, passwordHash });

  res.status(201).json(user);
});

router.put('/:username', async (req, res) => {
  const user = await User.findOne({ where: { username: req.params.username } });

  if (!user) {
    res.status(404).send({ error: 'User not found' });
    return;
  }

  if (typeof req.body.username === 'undefined') {
    res.status(400).send({ error: 'You must provide the new username' });
  }

  user.username = req.body.username;
  await user.save();
  res.json(user);
});

module.exports = router;
