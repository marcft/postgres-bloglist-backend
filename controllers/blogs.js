const router = require('express').Router();

const { Blog } = require('../models');

router.get('/', async (req, res) => {
  const blogs = await Blog.findAll();
  res.json(blogs);
});

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(req.body);
    res.json(blog);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete('/:id', async (req, res) => {
  const blogsDeleted = await Blog.destroy({ where: { id: req.params.id } });
  if (blogsDeleted === 0) {
    res.status(404).json({ error: 'Blog not found' });
    return;
  }
  res.status(204).end();
});

module.exports = router;
