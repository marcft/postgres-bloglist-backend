require('dotenv').config();
const { Sequelize, QueryTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL);

const main = async () => {
  try {
    const blogs = await sequelize.query('SELECT * FROM blogs', {
      type: QueryTypes.SELECT,
    });

    const printableBlogs = blogs.map((blog) => {
      if (blog.author === null) blog.author = 'Anonymous';
      return `${blog.author}: '${blog.title}', ${blog.likes} likes`;
    });

    console.log(printableBlogs.join('\n'));
    sequelize.close();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

main();
