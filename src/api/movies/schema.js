import Joi from 'joi';
import { MOVIE_FORMATS, MOVIE_IMPORT_MIME_TYPES } from '../../utils/consts';

export const movieSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().required(),
  format: Joi.string()
    .equal(...Object.values(MOVIE_FORMATS))
    .required(),
  actors: Joi.array().items(Joi.string()).min(1).required(),
});

export const paramsMovieSchema = Joi.object({
  filmId: Joi.number().required(),
});

export const listMovieSchema = Joi.object({
  actor: Joi.string(),
  title: Joi.string(),
  search: Joi.string(),
  sort: Joi.string().equal('id', 'year', 'title').default('id').required(),
  order: Joi.string().equal('DESC', 'ASC').default('ASC').required(),
  limit: Joi.number().integer().default(20).required(),
  offset: Joi.number().integer().default(0).required(),
});

export const filmImportSchema = Joi.object({
  film: Joi.object({
    buffer: Joi.binary().required(),
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid(...Object.values(MOVIE_IMPORT_MIME_TYPES))
      .required(),
    size: Joi.number().required(),
  }),
});
