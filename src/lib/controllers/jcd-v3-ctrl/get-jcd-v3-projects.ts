
import { Request, Response } from 'express';
import { JcdV3Image } from '../../../models/jcd-models-v3/jcd-v3-image';
import { JcdV3Project } from '../../../models/jcd-models-v3/jcd-v3-project';
import { JcdV3ProjectPreview } from '../../../models/jcd-models-v3/jcd-v3-project-preview';
import { logger } from '../../logger';

import { JcdV3Service } from '../../services/jcd/jcd-v3-service';

export async function getJcdV3Projects(req: Request, res: Response) {
  let jcdV3ProjectPreviews: JcdV3ProjectPreview[];
  jcdV3ProjectPreviews = await JcdV3Service.getJcdProjectPreviews();
  res.status(200).json(jcdV3ProjectPreviews);
}

export async function getJcdV3ProjectByRoute(req: Request, res: Response) {
  let jcdProject: JcdV3Project, projectRoute: string;
  projectRoute = req.params.projectRoute;
  try {
    jcdProject = await JcdV3Service.getJcdProjectByRoute(projectRoute);
    res.status(200).json(jcdProject);
  } catch(e) {
    logger.log(e);
    res.status(500).end();
  }
}

export async function getJcdV3ImagesByProjectKey(req: Request, res: Response) {
  let jcdImages: JcdV3Image[], projectKey: string;
  projectKey = req.params.projectKey;
  try {
    jcdImages = await JcdV3Service.getJcdImagesByProject(projectKey);
    res.status(200).json(jcdImages);
  } catch(e) {
    logger.error(e);
    res.status(500).end();
  }
}
