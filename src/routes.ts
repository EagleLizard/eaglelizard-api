
import { Express } from 'express';

import { getHealthcheck } from './controllers/get-healthcheck';

export function registerRoutes(app: Express): Express {

  app.get('/healthcheck', getHealthcheck);

  return app;
}
