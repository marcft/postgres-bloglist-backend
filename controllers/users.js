const bcrypt = require('bcrypt');
const router = require('express').Router();

const { User } = require('../models');

router.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
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
