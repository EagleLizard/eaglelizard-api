
import { JcdProject, JcdProjectPage } from '../../../models/jcd-entities';

import { JcdService } from '../../services/jcd/jcd-service';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function getJcdProjectList(req: FastifyRequest, res: FastifyReply) {
  let jcdProjectKeys: string[];
  jcdProjectKeys = await JcdService.getJcdProjectKeys();
  res.send({
    projects: jcdProjectKeys,
  });
}

export async function getJcdProjects(req: FastifyRequest, res: FastifyReply) {
  let jcdProjects: JcdProject[];
  jcdProjects = await JcdService.getJcdProjects();
  res.send({
    projects: jcdProjects,
  });
}

export async function getJcdProject(
  req: FastifyRequest<{
    Params: {
      projectRoute?: string;
    };
  }>,
  res: FastifyReply,
) {
  let jcdProject: JcdProject, projectRoute: string;
  projectRoute = req.params.projectRoute;
  try {
    jcdProject = await JcdService.getJcdProject(projectRoute);
    return res.send({
      project: jcdProject,
    });
  } catch(e) {
    console.error(e);
    res.status(500).send();
  }
}

export async function getJcdProjectPage(
  req: FastifyRequest<{
    Params: {
      projectKey?: string;
    };
  }>,
  res: FastifyReply,
) {
  let jcdProjectPage: JcdProjectPage, projectKey: string;
  projectKey = req.params.projectKey;
  try {
    jcdProjectPage = await JcdService.getJcdProjectPage(projectKey);
    res.send({
      projectPage: jcdProjectPage,
    });
  } catch(e) {
    console.error(e);
    res.status(500).send();
  }
}
