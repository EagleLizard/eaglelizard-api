
import express, { Express } from 'express';
// import morgan from 'morgan';

import { config } from './config';
import { registerRoutes } from './lib/routes';
import { logger } from './lib/logger';
import { logMiddleware } from './lib/middleware/log-middleware';
import { MemLogger } from './lib/modules/mem-logger';
import { MEM_CACHE } from './lib/services/image-service-v0';

export async function initServer() {
  return new Promise<void>((resolve, reject) => {
    let app: Express, port: number;
    let memLogger: MemLogger;
    if(config.APP_ENV === 'dev') {
      memLogger = new MemLogger(MEM_CACHE);
      memLogger.run();
    }

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
