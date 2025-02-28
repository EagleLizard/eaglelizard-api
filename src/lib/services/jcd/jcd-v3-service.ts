
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
export class JcdV3Service {

  static async getJcdProjectPreviews(): Promise<JcdV3ProjectPreview[]> {
    let jcdProjectOrders: JcdV3ProjectOrder[];
    let jcdProjects: JcdV3Project[];
    let jcdTitleImages: JcdV3Image[];
    let jcdProjectPreviews: JcdV3ProjectPreview[];

    [
      jcdProjectOrders,
      jcdProjects,
      jcdTitleImages,
    ] = await Promise.all([
      JcdV3Service.getJcdProjectOrders(),
      JcdV3Service.getJcdProjects(),
      JcdV3Service.getJcdTitleImages(),
    ]);

    jcdProjectPreviews = [];

    for(let i = 0; i < jcdProjectOrders.length; ++i) {
      let foundProject: JcdV3Project;
      let foundTitleImage: JcdV3Image;
      let projectPreview: JcdV3ProjectPreview;
      let jcdProjectOrder = jcdProjectOrders[i];
      foundProject = jcdProjects.find(jcdProject => {
        return jcdProject.projectKey === jcdProjectOrder.projectKey;
      });
      foundTitleImage = jcdTitleImages.find(jcdTitleImage => {
        return jcdTitleImage.projectKey === jcdProjectOrder.projectKey;
      });
      if((foundProject !== undefined) && (foundTitleImage !== undefined)) {
        console.log(jcdProjectOrder);
        projectPreview = {
          projectKey: jcdProjectOrder.projectKey,
          route: foundProject.route,
          title: foundProject.title,
          titleUri: foundTitleImage.bucketFile,
          orderIndex: jcdProjectOrder.orderIdx,
        };
        jcdProjectPreviews.push(projectPreview);
      }
    }
    return jcdProjectPreviews;
  }

  static async getJcdImagesByProject(projectKey: string): Promise<JcdV3Image[]> {
    let imagesQuery: Query, imageEntities: unknown[];
    let jcdImages: JcdV3Image[];
    imagesQuery = GcpDbService.gcpDb
      .createQuery(JCD_V3_DB_IMAGE_KIND)
      .filter('projectKey', '=', projectKey)
      .filter('active', true)
    ;
    console.log(projectKey);
    [ imageEntities ] = await imagesQuery.run();
    jcdImages = imageEntities.map(JcdV3Image.deserialize);
    return jcdImages;
  }

  static async getJcdTitleImages(): Promise<JcdV3Image[]> {
    let titleImageQuery: Query, titleImageEntities: unknown[];
    let jcdTitleImages: JcdV3Image[];
    titleImageQuery = GcpDbService.gcpDb
      .createQuery(JCD_V3_DB_IMAGE_KIND)
      .filter('imageType', '=', 'TITLE')
    ;
    [ titleImageEntities ] = await titleImageQuery.run();
    jcdTitleImages = titleImageEntities.map(JcdV3Image.deserialize);
    return jcdTitleImages;
  }

  static async getJcdProjectByRoute(projectRoute: string): Promise<JcdV3Project> {
    let projectsQuery: Query, projectEntities: unknown[];
    let jcdProjects: JcdV3Project[];
    projectsQuery = GcpDbService.gcpDb
      .createQuery(JCD_V3_DB_PROJECT_KIND)
      .filter('route', '=', projectRoute)
    ;
    [ projectEntities ] = await projectsQuery.run();
    jcdProjects = projectEntities.map(JcdV3Project.deserialize);
    return jcdProjects[0];
  }

  static async getJcdProjects(): Promise<JcdV3Project[]> {
    let projectsQuery: Query, projectEntities: unknown[];
    let jcdProjects: JcdV3Project[];
    projectsQuery = GcpDbService.gcpDb.createQuery(JCD_V3_DB_PROJECT_KIND);
    [ projectEntities ] = await projectsQuery.run();
    jcdProjects = projectEntities.map(JcdV3Project.deserialize);
    return jcdProjects;
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
