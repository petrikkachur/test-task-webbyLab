import { Model } from 'sequelize';

export default class Actors extends Model {
  static init = (sequelize, DataTypes) => super.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      firstName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      lastName: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'Actors',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  );

  static associate = (models) => {
    Actors.hasMany(models.FilmsActors, {
      as: 'Films',
      foreignKey: 'actorId',
      onDelete: 'CASCADE',
    });
  };
}
