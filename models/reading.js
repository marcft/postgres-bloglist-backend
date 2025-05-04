const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

class Reading extends Model {}

Reading.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'blogs', key: 'id' },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'reading',
    tableName: 'reading_list',
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'blog_id'],
      },
    ],
  }
);

module.exports = Reading;
