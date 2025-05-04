const router = require('express').Router();

const { Reading } = require('../models');
const { userFinder } = require('../utils/middleware');

router.post('/', async (req, res) => {
  const reading = await Reading.create(req.body);
  res.status(201).json(reading);
});

router.put('/:id', userFinder, async (req, res) => {
  if (typeof req.body.read === 'undefined') {
    res.status(400).send({ error: 'You must provide read property' });
  }

  const reading = await Reading.findByPk(req.params.id);
  if (!reading) {
    return res.status(404).json({ error: 'Reading not found' });
  }

  console.log(reading.userId, req.user.id);

  if (reading.userId !== req.user.id) {
    return res.status(401).json({ error: 'Unauthorized modification' });
  }

  reading.read = req.body.read;
  await reading.save();
  res.json(reading);
});

module.exports = router;
