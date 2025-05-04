const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('reading_list', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      blog_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'blogs', key: 'id' },
      },
    });

    await queryInterface.addConstraint('reading_list', {
      fields: ['user_id', 'blog_id'],
      type: 'unique',
      name: 'unique_user_blog_pair',
    });
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('reading_list');
  },
};
