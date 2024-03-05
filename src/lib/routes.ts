
import { Express } from 'express';

import { getHealthcheck } from './controllers/get-healthcheck';
import { getBaseRoute } from './controllers/get-base-route';
import { getImagesV0 } from './controllers/get-images-v0';
import { getImagesV1 } from './controllers/get-images-v1';
import { getImagesV2 } from './controllers/get-images-v2';
import {
  getJcdProjectList,
  getJcdProjects,
  getJcdProject,
  getJcdProjectPage,
} from './controllers/jcd-project/get-jcd-projects';
import {
  getJcdV3ImagesByProjectKey,
  getJcdV3ProjectByRoute,
  getJcdV3Projects,
} from './controllers/jcd-v3-ctrl/get-jcd-v3-projects';
import { getRobotsTxt } from './controllers/get-robots.txt';

export function registerRoutes(app: Express): Express {

  app.get('/health', getHealthcheck);
  app.get('/', getBaseRoute);
  app.get('/robots.txt', getRobotsTxt);

  app.get('/image/v0/:folder/:image?', getImagesV0);
  app.get('/image/v1/:folder/:image?', getImagesV1);
  app.get('/image/v2/:folder/:image?', getImagesV2);

  app.get('/jcd/v0/project/list', getJcdProjectList);
  app.get('/jcd/v0/project', getJcdProjects);
  app.get('/jcd/v0/project/:projectRoute', getJcdProject);
  app.get('/jcd/v0/project/page/:projectKey', getJcdProjectPage);

  app.get('/jcd/v1/project', getJcdV3Projects);
  app.get('/jcd/v1/project/:projectRoute', getJcdV3ProjectByRoute);
  app.get('/jcd/v1/project/images/:projectKey', getJcdV3ImagesByProjectKey);

  return app;
}
