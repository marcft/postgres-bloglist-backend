const Blog = require('./blog');
const User = require('./user');
const Reading = require('./reading');
const ActiveSession = require('./active_session');

User.hasMany(Blog);
Blog.belongsTo(User);

User.belongsToMany(Blog, { through: Reading, as: 'readings' });
Blog.belongsToMany(User, { through: Reading, as: 'readings' });

User.hasOne(ActiveSession);
ActiveSession.belongsTo(User);

module.exports = {
  Blog,
  User,
  Reading,
  ActiveSession,
};
