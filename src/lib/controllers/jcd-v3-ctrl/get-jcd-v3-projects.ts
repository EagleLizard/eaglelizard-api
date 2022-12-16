
import { Request, Response } from 'express';

import { JcdV3Service } from '../../services/jcd/jcd-v3-service';

export async function getJcdV3Projects(req: Request, res: Response) {
  await JcdV3Service.getJcdProjectPreviews();
  res.status(200).json({});
}
