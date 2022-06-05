import { Model } from 'sequelize';
import { MOVIE_FORMATS } from '../../utils/consts';

export default class Films extends Model {
  static init = (sequelize, DataTypes) => super.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      year: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      format: {
        allowNull: false,
        type: DataTypes.ENUM(...Object.values(MOVIE_FORMATS)),
      },
    },
    {
      sequelize,
      modelName: 'Films',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  );

  static associate = (models) => {
    Films.hasMany(models.FilmsActors, {
      as: 'actors',
      foreignKey: 'filmId',
      onDelete: 'CASCADE',
    });
  };
}
