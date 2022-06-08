import { Op } from 'sequelize';
import async from 'async';
import models, { sequelize, Sequelize } from '../../database/models';
import { fileParser } from '../../services/txtParser';
import { createFilm } from '../../utils/helpers';

export default {
  async createMovie(req, res) {
    const { body } = req.valid;

    const existFilm = await models.Films.findOne({
      where: {
        title: body.title,
      },
    });
    if (existFilm) return res.status(409).send('Film is existed');

    const result = await sequelize.transaction(createFilm(body));

    return res.send({ data: result, status: 1 });
  },

  async deleteMovie(req, res) {
    const { params } = req.valid;

    const film = await models.Films.destroy({
      where: {
        id: params.filmId,
      },
    });
    if (!film) return res.status(404).send('Film not found');

    return res.send({
      status: 1,
    });
  },

  async updateMovie(req, res) {
    const { params, body } = req.valid;

    const existedFilm = await models.Films.findOne({
      where: {
        id: params.filmId,
      },
    });
    if (!existedFilm) return res.status(404).send('Film not found');

    const result = await sequelize.transaction(async (transaction) => {
      await existedFilm.destroy({ transaction });

      return await createFilm(body)(transaction);
    });

    return res.send({ data: result, status: 1 });
  },

  async showMovie(req, res) {
    const { params } = req.valid;

    const film = await models.Films.findOne({
      where: {
        id: params.filmId,
      },
      include: [
        {
          model: models.FilmsActors,
          as: 'actors',
          include: {
            model: models.Actors,
            as: 'actor',
            attributes: [],
          },
          attributes: [
            ['ActorId', 'id'],
            [Sequelize.literal("firstName || ' ' || lastName"), 'name'],
            'createdAt',
            'updatedAt',
          ],
        },
      ],
    });
    if (!film) return res.status(404).send('Film not found');

    return res.send({ data: film, status: 1 });
  },

  async listMovies(req, res) {
    const { query } = req.valid;
    const where = {};

    if (query?.search) {
      where[Op.or] = [
        {
          title: {
            [Op.like]: `%${query.search.toLowerCase()}%`,
          },
        },
        Sequelize.where(
          Sequelize.fn(
            'lower',
            Sequelize.literal(
              '"firstName" || " " || "lastName"',
            ),
          ),
          {
            [Op.like]: `%${query.search.toLowerCase()}%`,
          },
        ),
      ];
    }

    if (query?.actor) {
      const actorSearch = Sequelize.where(
        Sequelize.fn(
          'lower',
          Sequelize.literal(
            '"firstName" || " " || "lastName"',
          ),
        ),
        {
          [Op.like]: `%${query.actor.toLowerCase()}%`,
        },
      );
      if (where[Op.or]) where[Op.or].push(actorSearch);
      else where[Op.or] = [actorSearch];
    }

    if (query?.title) {
      const titleSearch = [
        { title: { [Op.like]: `%${query.title.toLowerCase()}%` } },
      ];

      if (where[Op.or]) where[Op.or].push(...titleSearch);
      else where[Op.or] = titleSearch;
    }

    const films = await models.Films.findAndCountAll({
      // subQuery: false,
      distinct: true,
      where,
      include: [
        {
          model: models.FilmsActors,
          as: 'actors',
          attributes: [],
          include: {
            model: models.Actors,
            as: 'actor',
            attributes: [],
          },
        },
      ],
      order: [[query.sort, query.order]],
      limit: query.limit,
      offset: query.offset,
    });

    return res.send({
      data: films.rows,
      meta: {
        total: films.count,
      },
      status: 1,
    });
  },

  async importFilms(req, res) {
    const { body } = req.valid;

    const films = fileParser(body.film.buffer);

    const addedFilms = await async.mapLimit(
      films,
      3,
      async.asyncify(async (film) => {
        const existedFilm = await models.Films.findOne({
          where: {
            title: film.title,
          },
        });
        if (existedFilm) return existedFilm;

        const result = await sequelize.transaction(createFilm(film));
        delete result.actors;

        return result;
      }),
    );

    const total = await models.Films.count();

    return res.send({
      data: [...new Map(addedFilms.map((item) => [item.id, item])).values()],
      meta: {
        imported: addedFilms.length,
        total,
      },
      status: 1,
    });
  },
};
