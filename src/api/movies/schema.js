import Joi from 'joi';
import { MOVIE_FORMATS, MOVIE_IMPORT_MIME_TYPES } from '../../utils/consts';

export const movieSchema = Joi.object({
  title: Joi.string().trim().required(),
  year: Joi.number().integer().min(1870).max(new Date().getFullYear())
    .required(),
  format: Joi.string()
    .equal(...Object.values(MOVIE_FORMATS))
    .required(),
  actors: Joi.array().items(Joi.string().pattern(/\S+\s\S+/).required()).min(1).unique((a, b) => a === b)
    .required(),
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
