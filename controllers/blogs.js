const router = require('express').Router();

const { Blog } = require('../models');

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post('/', async (req, res) => {
  const blog = await Blog.create(req.body);
  res.json(blog);
});

router.delete('/:id', async (req, res) => {
  const blogsDeleted = await Blog.destroy({ where: { id: req.params.id } });
  if (blogsDeleted === 0) {
    res.status(204).json({ error: 'Blog not found' });
    return;
  }
  res.status(204).end();
});

router.put('/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);
  if (!blog) {
    res.status(404).send({ error: 'Blog not found' });
    return;
  }

  if (typeof req.body.likes === 'undefined') {
    res.status(400).send({ error: 'You must set the likes' });
  }

  blog.likes = req.body.likes;
  await blog.save();
  res.json(blog);
});

module.exports = router;
