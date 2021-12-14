
import { Express } from 'express';

import { getHealthcheck } from './controllers/get-healthcheck';
import { getBaseRoute } from './controllers/get-base-route';

export function registerRoutes(app: Express): Express {

  app.get('/health', getHealthcheck);
  app.get('/', getBaseRoute);


  return app;
}
