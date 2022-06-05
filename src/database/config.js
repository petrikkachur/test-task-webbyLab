/* eslint-disable import/no-import-module-exports */
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const logStream = fs.createWriteStream('./sql.log', { flags: 'a' });

module.exports = {
  dialect: 'sqlite',
  storage: 'database.sqlite',
  logging: (msg) => logStream.write(`${msg}\n`),
};
