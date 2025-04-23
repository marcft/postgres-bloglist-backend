const Blog = require('./blog');
const User = require('./user');

Blog.sync();
User.sync();

Blog.belongsTo(User);
User.hasMany(Blog);

module.exports = {
  Blog,
  User,
};
