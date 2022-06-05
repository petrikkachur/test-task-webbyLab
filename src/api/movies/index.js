import express from 'express';
import controller from './controller';
import validator from '../../middleware/validator';
import {
  filmImportSchema,
  listMovieSchema,
  movieSchema,
  paramsMovieSchema,
} from './schema';
import upload from '../../middleware/upload';

const router = express.Router();

router.post('/', validator(movieSchema, 'body'), controller.createMovie);
router.delete(
  '/:filmId',
  validator(paramsMovieSchema, 'params'),
  controller.deleteMovie,
);
router.patch(
  '/:filmId',
  validator(paramsMovieSchema, 'params'),
  validator(movieSchema, 'body'),
  controller.updateMovie,
);
router.get(
  '/:filmId',
  validator(paramsMovieSchema, 'params'),
  controller.showMovie,
);
router.get('/', validator(listMovieSchema, 'query'), controller.listMovies);
router.post(
  '/import',
  upload.single('movies'),
  validator(filmImportSchema, (req) => ({ ...req.body, film: req.file })),
  controller.importFilms,
);

export default router;
