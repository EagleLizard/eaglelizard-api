
import { Query } from '@google-cloud/datastore';

import {
  GcpDbService,
} from '../gcp-db-service';
import { JcdV3ProjectKey } from '../../../models/jcd-models-v3/jcd-v3-project-key';
import { JcdV3ProjectOrder } from '../../../models/jcd-models-v3/jcd-v3-project-order';
import { JCD_V3_DB_IMAGE_KIND, JCD_V3_DB_PROJECT_KEY_KIND, JCD_V3_DB_PROJECT_KIND, JCD_V3_DB_PROJECT_ORDER_KIND } from '../../jcd-v3-constants';
import { JcdV3Project } from '../../../models/jcd-models-v3/jcd-v3-project';
import { JcdV3Image } from '../../../models/jcd-models-v3/jcd-v3-image';
import { JcdV3ProjectPreview } from '../../../models/jcd-models-v3/jcd-v3-project-preview';
import { logger } from '../../logger';
export class JcdV3Service {

  static async getJcdProjectPreviews(): Promise<JcdV3ProjectPreview[]> {
    let jcdProjectOrders: JcdV3ProjectOrder[];
    let projectEntities: unknown[], jcdProjects: JcdV3Project[];
    let titleImageEntities: unknown[], jcdTitleImages: JcdV3Image[];
    let projectsQuery: Query, titleImageQuery: Query;

    let jcdProjectPreviews: JcdV3ProjectPreview[];

    const startMs = Date.now();

    jcdProjectOrders = await JcdV3Service.getJcdProjectOrders();

    projectsQuery = GcpDbService.gcpDb.createQuery(JCD_V3_DB_PROJECT_KIND);
    [ projectEntities ] = await projectsQuery.run();
    jcdProjects = projectEntities.map(JcdV3Project.deserialize);

    titleImageQuery = GcpDbService.gcpDb
      .createQuery(JCD_V3_DB_IMAGE_KIND)
      .filter('imageType', '=', 'TITLE')
    ;
    [ titleImageEntities ] = await titleImageQuery.run();
    jcdTitleImages = titleImageEntities.map(JcdV3Image.deserialize);

    const getProjectPreviewMs = Date.now() - startMs;
    logger.info(`${getProjectPreviewMs} ms`);

    jcdProjectPreviews = jcdProjectOrders.map(jcdProjectOrder => {
      let projectPreview: JcdV3ProjectPreview;
      let foundProject: JcdV3Project, foundTitleImage: JcdV3Image;
      foundProject = jcdProjects.find(jcdProject => {
        return jcdProject.projectKey === jcdProjectOrder.projectKey;
      });
      foundTitleImage = jcdTitleImages.find(jcdTitleImage => {
        return jcdTitleImage.projectKey === jcdProjectOrder.projectKey;
      });
      projectPreview = {
        projectKey: jcdProjectOrder.projectKey,
        route: foundProject.route,
        title: foundProject.title,
        titleUri: foundTitleImage.bucketFile,
        orderIndex: jcdProjectOrder.orderIdx,
      };
      return projectPreview;
    });
    return jcdProjectPreviews;
  }

  static async getJcdProjectOrders(): Promise<JcdV3ProjectOrder[]> {
    let jcdV3ProjectKeys: JcdV3ProjectKey[], activeProjectKeys: string[];
    let projectOrderQuery: Query, projectOrderEntities: unknown[];
    let jcdV3ProjectOrders: JcdV3ProjectOrder[];
    jcdV3ProjectKeys = await JcdV3Service.getActiveJcdProjectKeys();
    activeProjectKeys = jcdV3ProjectKeys.map(jcdV3ProjectKey => jcdV3ProjectKey.projectKey);

    projectOrderQuery = GcpDbService.gcpDb
      .createQuery(JCD_V3_DB_PROJECT_ORDER_KIND)
      .order('orderIdx')
    ;
    [ projectOrderEntities ] = await projectOrderQuery.run();
    jcdV3ProjectOrders = projectOrderEntities
      .map(JcdV3ProjectOrder.deserialize)
      .filter(jcdV3ProjectOrder => {
        let foundActiveProjectKeyIdx: number;
        foundActiveProjectKeyIdx = activeProjectKeys.findIndex(activeProjectKey => {
          return jcdV3ProjectOrder.projectKey === activeProjectKey;
        });
        return foundActiveProjectKeyIdx !== -1;
      })
    ;

    return jcdV3ProjectOrders;
  }

  static async getActiveJcdProjectKeys(): Promise<JcdV3ProjectKey[]> {
    let query: Query, jcdV3ProjectKeyEntities: unknown[];
    let jcdV3ProjectKeys: JcdV3ProjectKey[];
    query = GcpDbService.gcpDb
      .createQuery(JCD_V3_DB_PROJECT_KEY_KIND)
      .filter('active', true)
    ;
    [ jcdV3ProjectKeyEntities ] = await query.run();
    jcdV3ProjectKeys = jcdV3ProjectKeyEntities.map(JcdV3ProjectKey.deserialize);
    return jcdV3ProjectKeys;
  }
}
