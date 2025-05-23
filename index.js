const express = require('express');

const { PORT } = require('./utils/config');
const { connectToDatabase } = require('./utils/db');

const blogsRouter = require('./controllers/blogs');
const authorsRouter = require('./controllers/authors');
const usersRouter = require('./controllers/users');
const readinglistRouter = require('./controllers/readinglist');
const loginRouter = require('./controllers/login');
const { errorHandler, tokenExtractor } = require('./utils/middleware');

const app = express();

app.use(express.json());
app.use(tokenExtractor);

app.use('/api/blogs', blogsRouter);
app.use('/api/authors', authorsRouter);
app.use('/api/users', usersRouter);
app.use('/api/readinglist', readinglistRouter);
app.use('/api/login', loginRouter);

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
