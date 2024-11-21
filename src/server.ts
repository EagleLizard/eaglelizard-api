
import Fastify, { FastifyInstance } from 'fastify';

import { config } from './config';
import { registerRoutes } from './lib/routes';
import { logger } from './lib/logger';
import { loggerV2 } from './lib/logger-v2';
import { logMiddleware } from './lib/middleware/log-middleware';
import { registerCorsMiddleware } from './lib/middleware/cors-middleware';
import { MemLogger, MemLoggerStream } from './lib/modules/mem-logger';
import { MEM_CACHE } from './lib/services/image-service-v0';

export async function initServer() {
  return new Promise<void>((resolve, reject) => {
    let app: FastifyInstance, port: number;
    let memLogger: MemLogger;
    if(config.APP_ENV === 'dev') {
      memLogger = new MemLogger(MEM_CACHE);
      memLogger.run();
    }

    port = config.PORT;

    app = Fastify({
      loggerInstance: loggerV2
    });

    // app.use(logMiddleware);
    // app.use(corsMiddleware);
    app = registerCorsMiddleware(app, config);

    app = registerRoutes(app);
    app.listen({
      port
    }, (err) => {
      if(err) {
        app.log.error(err);
        process.exit(1);
      }
      loggerV2.info(`Listening on port: ${port}`);
      resolve();
    });
  });
}
