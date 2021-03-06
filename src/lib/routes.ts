
import { Express } from 'express';

import { getHealthcheck } from './controllers/get-healthcheck';
import { getBaseRoute } from './controllers/get-base-route';
import { getImagesV0 } from './controllers/get-images-v0';
import { getImagesV1 } from './controllers/get-images-v1';
import { getJcdProjectList } from './controllers/jcd-project/get-jcd-projects';

export function registerRoutes(app: Express): Express {

  app.get('/health', getHealthcheck);
  app.get('/', getBaseRoute);
  app.get('/image/v0/:folder/:image?', getImagesV0);
  app.get('/image/v1/:folder/:image?', getImagesV1);

  app.get('/jcd/v0/project/list', getJcdProjectList);

  return app;
}
