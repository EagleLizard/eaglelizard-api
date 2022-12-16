
import { Express } from 'express';

import { getHealthcheck } from './controllers/get-healthcheck';
import { getBaseRoute } from './controllers/get-base-route';
import { getImagesV0 } from './controllers/get-images-v0';
import { getImagesV1 } from './controllers/get-images-v1';
import {
  getJcdProjectList,
  getJcdProjects,
  getJcdProject,
  getJcdProjectPage,
} from './controllers/jcd-project/get-jcd-projects';
import {
  getJcdV3Projects,
} from './controllers/jcd-v3-ctrl/get-jcd-v3-projects';

export function registerRoutes(app: Express): Express {

  app.get('/health', getHealthcheck);
  app.get('/', getBaseRoute);
  app.get('/image/v0/:folder/:image?', getImagesV0);
  app.get('/image/v1/:folder/:image?', getImagesV1);

  app.get('/jcd/v0/project/list', getJcdProjectList);
  app.get('/jcd/v0/project', getJcdProjects);
  app.get('/jcd/v0/project/:projectRoute', getJcdProject);
  app.get('/jcd/v0/project/page/:projectKey', getJcdProjectPage);

  app.get('/jcd/v1/project', getJcdV3Projects);

  return app;
}
