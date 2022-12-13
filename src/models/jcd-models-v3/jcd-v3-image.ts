
import {
  isBoolean,
  isNumber,
  isObject, isString,
} from '../../lib/modules/type-validation/validate-primitives';
import { JcdTypeError } from '../jcd-type-error';

export class JcdV3Image {
  constructor(
    public id: string,
    public projectKey: string,
    public bucketFile: string,
    public orderIdx: number,
    public active: boolean,
    public imageType: string,
  ) {}

  static deserialize(rawImg: unknown): JcdV3Image {
    let jcdImageV3: JcdV3Image;
    let id: string,
      projectKey: string,
      bucketFile: string,
      orderIdx: number,
      active: boolean,
      imageType: string
    ;
    if(!isObject(rawImg)) {
      throw new JcdTypeError('object');
    }
    jcdImageV3 = rawImg as JcdV3Image;

    if(!isString(jcdImageV3.id)) {
      throw new JcdTypeError('string');
    }

    if(!isString(jcdImageV3.projectKey)) {
      throw new JcdTypeError('string');
    }
    if(!isString(jcdImageV3.bucketFile)) {
      throw new JcdTypeError('string');
    }
    if(!isNumber(jcdImageV3.orderIdx)) {
      throw new JcdTypeError('number');
    }
    if(!isBoolean(jcdImageV3.active)) {
      throw new JcdTypeError('boolean');
    }
    if(!isString(jcdImageV3.imageType)) {
      throw new JcdTypeError('string');
    }

    id = jcdImageV3.id;
    projectKey = jcdImageV3.projectKey;
    bucketFile = jcdImageV3.bucketFile;
    orderIdx = jcdImageV3.orderIdx;
    active = jcdImageV3.active;
    imageType = jcdImageV3.imageType;

    return new JcdV3Image(
      id,
      projectKey,
      bucketFile,
      orderIdx,
      active,
      imageType,
    );
  }

  /*
    Assumes bucketPath follows the format:
      folder-key/file-name.ext
    where '.ext' exists on the name and '/' is the bucket's folder delimeter
  */
  static getIdFromBucketPath(bucketPath: string): string {
    let fileNameWithExt: string, fileName: string;
    fileNameWithExt = bucketPath.split('/').at(-1);
    fileName = fileNameWithExt?.split('.')[0];
    if(!isString(fileName) || fileName.length < 1) {
      throw new Error(`Failed to parse v3 image id from path: ${bucketPath}`);
    }
    return fileName;
  }
}
