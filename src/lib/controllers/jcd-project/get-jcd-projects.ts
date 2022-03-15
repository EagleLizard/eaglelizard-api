
import { Request, Response } from 'express';

import { JcdService } from '../../services/jcd/jcd-service';

export async function getJcdProjectList(req: Request, res: Response) {
  let jcdProjectKeys: string[];
  jcdProjectKeys = await JcdService.getJcdProjectKeys();
  res.status(200).json({
    projects: jcdProjectKeys,
  });
}
