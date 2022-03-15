
import { Entity, Query } from '@google-cloud/datastore';
import {
  GcpDbService,
} from '../gcp-db-service';
import {
  isString,
} from '../../modules/type-validation/validate-primitives';
import { JcdProject, JcdProjectPage } from '../../../models/jcd-entities';

export class JcdService {
  static async getJcdProjectKeys(): Promise<string[]> {
    let query: Query, projectKeyEntities: Entity[];
    let projectKeys: string[];
    query = GcpDbService.gcpDb
      .createQuery('JcdProjectKey')
      .order('orderIndex')
    ;
    [ projectKeyEntities ] = await query.run();
    if(!Array.isArray(projectKeyEntities)) {
      throw new Error(`Invalid projectListEntities type, expected array, received: ${typeof projectKeyEntities}`);
    }
    projectKeys = projectKeyEntities.map(projectKeyEntity => {
      if(!isString(projectKeyEntity?.projectKey)) {
        throw new Error('Invalid projectKey');
      }
      return projectKeyEntity.projectKey;
    });
    return projectKeys;
  }

  static async getJcdProjects(): Promise<JcdProject[]> {
    let query: Query, projectEntities: any[];
    let projects: JcdProject[];
    query = GcpDbService.gcpDb
      .createQuery('JcdProject')
      .order('orderIndex')
    ;
    [ projectEntities ] = await query.run();
    projects = projectEntities.map(JcdProject.deserialize);
    return projects;
  }

  static async getJcdProject(projectRoute: string): Promise<JcdProject> {
    let query: Query, projectEntity: any;
    let project: JcdProject;
    query = GcpDbService.gcpDb
      .createQuery('JcdProject')
      .filter('route', '=', projectRoute)
    ;
    [ projectEntity ] = await query.run();
    project = JcdProject.deserialize(projectEntity[0]);

    return project;
  }

  static async getJcdProjectPage(projectKey: string): Promise<JcdProjectPage> {
    let query: Query, projectPageEntity: any;
    let projectPage: JcdProjectPage;
    query = GcpDbService.gcpDb
      .createQuery('JcdProjectPage')
      .filter('projectKey', '=', projectKey)
    ;
    [ projectPageEntity ] = await query.run();
    projectPage = JcdProjectPage.deserialize(projectPageEntity[0]);
    return projectPage;
  }
}

