import { Model } from 'sequelize';

export default class Users extends Model {
  static init = (sequelize, DataTypes) => super.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        unique: true,
        type: DataTypes.STRING,
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Users',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      defaultScope: {
        attributes: {
          exclude: ['password'],
        },
      },
      scopes: {
        withProtectInfo: {
          attributes: {},
        },
      },
    },
  );

  static associate = () => { };
}
