
import { Request, Response } from 'express';

export function getBaseRoute(req: Request, res: Response) {
  res.send('EagleLizard API GCP');
}
