import { Request, Response, NextFunction } from 'express';
import morgan, { StreamOptions } from 'morgan';

import { logger } from '../logger';

export const morganStream: StreamOptions = {
  write: (message) => {
    logger.info(message);
  },
};

// const logFmt = ':method :url :status :res[content-length] - :response-time ms';
const logFmt = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms';

// Build the morgan middleware
const morganMiddleware = morgan(
  logFmt,
  {
    stream: morganStream,
  }
);

export function logMiddleware(req: Request, res: Response, next: NextFunction) {
  morganMiddleware(req, res, err => {
    if(err !== undefined) {
      logger.error(err);
    }
  });
  next();
}
