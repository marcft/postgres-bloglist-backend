const { Op } = require('sequelize');
const router = require('express').Router();

const { Blog, User } = require('../models');
const { userFinder } = require('../utils/middleware');

router.get('/', async (req, res) => {
  // Optimize where, doesn't do request when not needed
  let where = {};
  if (req.query.search) {
    where = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${req.query.search}%` } },
        { author: { [Op.iLike]: `%${req.query.search}%` } },
      ],
    };
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name'],
    },
    where,
    order: [['likes', 'DESC']],
  });
  res.json(blogs);
});

const blogFinder = async (req, res, next) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }
  req.blog = blog;

  next();
};

router.post('/', userFinder, async (req, res) => {
  const blog = Blog.build(req.body);
  blog.userId = req.user.id;
  await blog.save();
  res.json(blog);
});

router.delete('/:id', userFinder, blogFinder, async (req, res) => {
  if (req.blog.userId != req.user.id) {
    return res.status(401).json({ error: 'Unauthorized blog delete access' });
  }
  await req.blog.destroy();
  res.status(204).end();
});

router.put('/:id', blogFinder, async (req, res) => {
  if (typeof req.body.likes === 'undefined') {
    res.status(400).send({ error: 'You must set the likes' });
  }
  req.blog.likes = req.body.likes;
  await req.blog.save();
  res.json(req.blog);
});

module.exports = router;
