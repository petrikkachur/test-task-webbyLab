import { Model } from 'sequelize';

export default class FilmsActors extends Model {
  static init = (sequelize, DataTypes) => super.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      filmId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        reference: {
          model: 'Films',
          key: 'id',
        },
        onDelete: 'cascade',
      },
      actorId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        reference: {
          model: 'Actors',
          key: 'id',
        },
        onDelete: 'cascade',
      },
    },
    {
      sequelize,
      modelName: 'FilmActors',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  );

  static associate = (models) => {
    FilmsActors.belongsTo(models.Actors, {
      as: 'actor',
      onDelete: 'cascade',
    });
    // FilmsActors.belongsTo(models.Films, {
    //   onDelete: 'cascade',
    // });
  };
}
