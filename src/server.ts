
import express, { Express } from 'express';
// import morgan from 'morgan';

import { config } from './config';
import { registerRoutes } from './lib/routes';
import { logger } from './lib/logger';
import { logMiddleware } from './lib/log-middleware/log-middleware';

export async function initServer() {
  return new Promise<void>((resolve, reject) => {
    let app: Express, port: number;

    port = config.PORT;

    app = express();

    app.use(logMiddleware);

    app = registerRoutes(app);

    app.listen(port, () => {
      logger.info(`Listening on port: ${port}`);
      resolve();
    });
  });
}
