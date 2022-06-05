import express from 'express';
import controller from './controller';
import validator from '../../middleware/validator';
import { userSingUpSchema } from './schema';

const router = express.Router();

router.post('/', validator(userSingUpSchema, 'body'), controller.userSingUp);

export default router;
