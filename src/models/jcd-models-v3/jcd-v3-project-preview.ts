
import { isNumber, isObject, isString } from '../../lib/modules/type-validation/validate-primitives';
import { JcdTypeError } from '../jcd-type-error';

export class JcdV3ProjectPreview {

  constructor(
    public projectKey: string,
    public route: string,
    public title: string,
    public titleUri: string,
    public orderIndex: number,
  ) {}

  static deserialize(rawProjectPreview: unknown): JcdV3ProjectPreview {
    let projectPreview: Record<string, unknown>;
    let projectKey: string,
      route: string,
      title: string,
      titleUri: string,
      orderIndex: number
    ;
    if(!isObject(rawProjectPreview)) {
      throw new JcdTypeError('object');
    }
    projectPreview = rawProjectPreview as Record<string, unknown>;
    if(!isString(projectPreview.projectKey)) {
      throw new Error('string');
    }
    if(!isString(projectPreview.route)) {
      throw new Error('string');
    }
    if(!isString(projectPreview.title)) {
      throw new Error('string');
    }
    if(!isString(projectPreview.titleUri)) {
      throw new Error('string');
    }
    if(!isNumber(projectPreview.orderIndex)) {
      throw new Error('number');
    }

    projectKey = projectPreview.projectKey;
    route = projectPreview.route;
    title = projectPreview.title;
    titleUri = projectPreview.titleUri;
    orderIndex = projectPreview.orderIndex;

    return new JcdV3ProjectPreview(
      projectKey,
      route,
      title,
      titleUri,
      orderIndex,
    );
  }
}
