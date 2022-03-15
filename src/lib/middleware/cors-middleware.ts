
import { NextFunction, Request, Response } from 'express';

export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}
