
import { Express } from 'express';

import { getHealthcheck } from './controllers/get-healthcheck';
import { getBaseRoute } from './controllers/get-base-route';
import { getImagesV0 } from './controllers/get-images-v0';

export function registerRoutes(app: Express): Express {

  app.get('/health', getHealthcheck);
  app.get('/', getBaseRoute);
  app.get('/image/v0/:folder/:image?', getImagesV0);

  return app;
}
