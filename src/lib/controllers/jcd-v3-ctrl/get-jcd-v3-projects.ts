
import { Request, Response } from 'express';
import { JcdV3ProjectPreview } from '../../../models/jcd-models-v3/jcd-v3-project-preview';

import { JcdV3Service } from '../../services/jcd/jcd-v3-service';

export async function getJcdV3Projects(req: Request, res: Response) {
  let jcdV3ProjectPreviews: JcdV3ProjectPreview[];
  jcdV3ProjectPreviews = await JcdV3Service.getJcdProjectPreviews();
  res.status(200).json(jcdV3ProjectPreviews);
}
