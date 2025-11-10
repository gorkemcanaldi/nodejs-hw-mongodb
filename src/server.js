import express from 'express';
import cors from 'cors';
import pinohttp from 'pino-http';
import router from './routers/contacts.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import auth from './routers/auth.js';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'path';

const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.use(
    pinohttp({
      transport: {
        target: 'pino-pretty',
        options: { colorize: true },
      },
    })
  );
  app.use('/auth', auth);

  app.get('/', (req, res) => {
    res.json({
      status: 200,
      message: 'API is running',
    });
  });

  app.use('/contacts', router);
  const swaggerPath = path.join(process.cwd(), 'docs/swagger.json');
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  return app;
};
export default setupServer;
