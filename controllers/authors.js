const { Op, fn, col } = require('sequelize');
const router = require('express').Router();

const { Blog } = require('../models');

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      'author',
      [fn('COUNT', col('id')), 'articles'],
      [fn('SUM', col('likes')), 'likes'],
    ],
    where: {
      author: { [Op.not]: null },
    },
    group: 'author',
    order: [['likes', 'DESC']],
  });

  res.json(blogs);
});

module.exports = router;
