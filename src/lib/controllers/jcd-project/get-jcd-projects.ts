
import { Request, Response } from 'express';
import { JcdProject, JcdProjectPage } from '../../../models/jcd-entities';

import { JcdService } from '../../services/jcd/jcd-service';

export async function getJcdProjectList(req: Request, res: Response) {
  let jcdProjectKeys: string[];
  jcdProjectKeys = await JcdService.getJcdProjectKeys();
  res.status(200).json({
    projects: jcdProjectKeys,
  });
}

export async function getJcdProjects(req: Request, res: Response) {
  let jcdProjects: JcdProject[];
  jcdProjects = await JcdService.getJcdProjects();
  res.status(200).json({
    projects: jcdProjects,
  });
}

export async function getJcdProject(req: Request, res: Response) {
  let jcdProject: JcdProject, projectRoute: string;
  projectRoute = req.params.projectRoute;
  try {
    jcdProject = await JcdService.getJcdProject(projectRoute);
    res.status(200).json({
      project: jcdProject,
    });
  } catch(e) {
    console.error(e);
    res.status(500).end();
  }
}

export async function getJcdProjectPage(req: Request, res: Response) {
  let jcdProjectPage: JcdProjectPage, projectKey: string;
  projectKey = req.params.projectKey;
  try {
    jcdProjectPage = await JcdService.getJcdProjectPage(projectKey);
    res.status(200).json({
      projectPage: jcdProjectPage,
    });
  } catch(e) {
    console.error(e);
    res.status(500).end();
  }
}
