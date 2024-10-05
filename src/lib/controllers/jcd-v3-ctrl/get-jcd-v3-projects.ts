
import { JcdV3Image } from '../../../models/jcd-models-v3/jcd-v3-image';
import { JcdV3Project } from '../../../models/jcd-models-v3/jcd-v3-project';
import { JcdV3ProjectPreview } from '../../../models/jcd-models-v3/jcd-v3-project-preview';
import { logger } from '../../logger';

import { JcdV3Service } from '../../services/jcd/jcd-v3-service';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function getJcdV3Projects(req: FastifyRequest, res: FastifyReply) {
  let jcdV3ProjectPreviews: JcdV3ProjectPreview[];
  jcdV3ProjectPreviews = await JcdV3Service.getJcdProjectPreviews();
  res.send(jcdV3ProjectPreviews);
}

export async function getJcdV3ProjectByRoute(
  req: FastifyRequest<{
    Params: {
      projectRoute?: string;
    };
  }>,
  res: FastifyReply,
) {
  let jcdProject: JcdV3Project, projectRoute: string;
  projectRoute = req.params.projectRoute;
  try {
    jcdProject = await JcdV3Service.getJcdProjectByRoute(projectRoute);
    res.send(jcdProject);
  } catch(e) {
    logger.error(e);
    res.status(500).send();
  }
}

export async function getJcdV3ImagesByProjectKey(
  req: FastifyRequest<{
    Params: {
      projectKey?: string;
    };
  }>,
  res: FastifyReply,
) {
  let jcdImages: JcdV3Image[], projectKey: string;
  projectKey = req.params.projectKey;
  try {
    jcdImages = await JcdV3Service.getJcdImagesByProject(projectKey);
    res.send(jcdImages);
  } catch(e) {
    logger.error(e);
    res.status(500).send();
  }
}
