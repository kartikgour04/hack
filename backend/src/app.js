import express from 'express';
import { config } from './config.js';
import { apiRouter } from './routes/index.js';
import { apiNotFound, errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use('/images', express.static(config.imagesDir));
  app.use('/api', apiRouter);
  app.use('/api', apiNotFound);
  app.use(errorHandler);

  return app;
}
