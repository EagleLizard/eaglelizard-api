
// import { NextFunction, Request, Response } from 'express';
import { FastifyInstance } from 'fastify';

import cors from '@fastify/cors';
import { EzdConfig } from '../../config';
// export function _corsMiddleware(req: Request, res: Response, next: NextFunction) {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   next();
// }

export function registerCorsMiddleware(app: FastifyInstance, config: EzdConfig) {
  return app.register(cors, {
    origin: config.JCD_WEB_ORIGIN,
    credentials: true,
  });
}
