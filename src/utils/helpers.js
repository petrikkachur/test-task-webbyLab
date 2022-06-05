import crypto from 'crypto';
import { SALT } from './consts';
import models from '../database/models';

export function extractHeaderToken({ token }) {
  return token.split('')[token.split('').length - 1];
}

export async function hashPassword(password) {
  return new Promise((res, rej) => {
    crypto.pbkdf2(password, SALT, 52, 60, 'sha512', (err, buffer) => {
      if (err) rej(err);
      res(buffer.toString('hex'));
    });
  });
}

export async function checkPassword(password, hashedPassword) {
  return (await hashPassword(password)) === hashedPassword;
}

export function megabytesToBytes({ megabytes }) {
  return megabytes * 1048576;
}

export function createFilm(filmData) {
  return async (transaction) => {
    const film = await models.Films.create(
      {
        title: filmData.title,
        year: filmData.year,
        format: filmData.format,
      },
      { transaction },
    );

    const actors = await Promise.all(
      filmData.actors.map(async (item) => {
        const firstName = item.split(' ')[0];
        const lastName = item.split(' ')[1];

        let actor;
        actor = await models.Actors.findOne({
          where: {
            firstName,
            lastName,
          },
        });
        if (!actor) {
          actor = await models.Actors.create(
            {
              firstName,
              lastName,
            },
            { transaction },
          );
        }

        return actor;
      }),
    );

    await Promise.all(
      actors.map(async (item) => {
        let filmsActors = await models.FilmsActors.findOne({
          where: {
            filmId: film.id,
            actorId: item.id,
          },
        });
        if (!filmsActors) {
          filmsActors = await models.FilmsActors.create(
            {
              filmId: film.id,
              actorId: item.id,
            },
            { transaction },
          );
        }

        return filmsActors;
      }),
    );

    return {
      id: film.id,
      title: film.title,
      year: film.year,
      format: film.format,
      createdAt: film.createdAt,
      updatedAt: film.updatedAt,
      actors,
    };
  };
}
