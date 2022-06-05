import express from 'express';
import controller from './controller';
import { sessionSchema } from './schema';
import validator from '../../middleware/validator';

const router = express.Router();

router.post('/', validator(sessionSchema, 'body'), controller.userSingIn);

export default router;
