import multer from 'multer';
import { megabytesToBytes } from '../utils/helpers';

const memoryStorage = multer.memoryStorage();
const upload = multer({
  storage: memoryStorage,
  limits: { fieldSize: megabytesToBytes({ megabytes: 10 }) },
});

export default upload;
