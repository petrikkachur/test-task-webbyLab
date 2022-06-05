import Express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import api from './api';

dotenv.config();

const app = new Express();

app.use(cors());
app.use(bodyParser.json());
app.use('/api/v1', api);

app.listen(process.env.APP_PORT || 1111, () => {
  console.log(`Server listening on port: ${process.env.APP_PORT || 1111}`);
});
