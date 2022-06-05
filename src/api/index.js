import express from 'express';
import users from './users';
import sessions from './sessions';
import movies from './movies';
import { isAuth, isNotAuth } from '../middleware/auth';

const router = express.Router();

router.use('/users', isNotAuth, users);
router.use('/sessions', isNotAuth, sessions);
router.use('/movies', isAuth, movies);

export default router;
