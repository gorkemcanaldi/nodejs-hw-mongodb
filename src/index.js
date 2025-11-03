import dotenv from 'dotenv';

dotenv.config();
import initMongoConnection from './db/initMongoConnection.js';
import setupServer from './server.js';
import { createFileIfNotExist } from './utils/createFileIfNotExist.js';
import { TEMP_FOLDER } from './constants/index.js';

const main = async () => {
  await initMongoConnection();
  await createFileIfNotExist(TEMP_FOLDER);
  setupServer();
};

main();
