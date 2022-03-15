
import { Entity, Query } from '@google-cloud/datastore';
import {
  GcpDbService,
} from '../gcp-db-service';
import {
  isString,
} from '../../modules/type-validation/validate-primitives';

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
}

