
import {
  isBoolean,
  isNumber,
  isObject,
  isString,
} from '../../lib/modules/type-validation/validate-primitives';
import { JcdTypeError } from '../jcd-type-error';

enum JCD_V3_IMAGE_TYPE_ENUM {
  TITLE = 'TITLE',
  GALLERY = 'GALLERY',
}

// export type JcdV3ImageType = JCD_V3_IMAGE_TYPE_ENUM.TITLE | JCD_V3_IMAGE_TYPE_ENUM.GALLERY;
type JcdV3ImageType = `${JCD_V3_IMAGE_TYPE_ENUM}`;

export class JcdV3Image {
  constructor(
    public id: string,
    public projectKey: string,
    public bucketFile: string,
    public orderIdx: number,
    public active: boolean,
    public imageType: JcdV3ImageType,
  ) {}

  static deserialize(rawImg: unknown): JcdV3Image {
    let jcdV3Image: Record<string, unknown>;
    let id: string,
      projectKey: string,
      bucketFile: string,
      orderIdx: number,
      active: boolean,
      imageType: JcdV3ImageType
    ;
    if(!isObject(rawImg)) {
      throw new JcdTypeError('object');
    }
    jcdV3Image = rawImg as Record<string, unknown>;

    if(!isString(jcdV3Image.id)) {
      throw new JcdTypeError('string');
    }

    if(!isString(jcdV3Image.projectKey)) {
      throw new JcdTypeError('string');
    }
    if(!isString(jcdV3Image.bucketFile)) {
      throw new JcdTypeError('string');
    }
    if(!isNumber(jcdV3Image.orderIdx)) {
      throw new JcdTypeError('number');
    }
    if(!isBoolean(jcdV3Image.active)) {
      throw new JcdTypeError('boolean');
    }
    if(!isJcdV3ImageType(jcdV3Image.imageType)) {
      throw new JcdTypeError('JcdV3ImageType');
    }

    id = jcdV3Image.id;
    projectKey = jcdV3Image.projectKey;
    bucketFile = jcdV3Image.bucketFile;
    orderIdx = jcdV3Image.orderIdx;
    active = jcdV3Image.active;
    imageType = jcdV3Image.imageType;

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
    if(!isString(fileName) || (fileName?.length ?? -Infinity) < 1) {
      throw new Error(`Failed to parse v3 image id from path: ${bucketPath}`);
    }
    return fileName;
  }
}

function isJcdV3ImageType(val: unknown): val is JcdV3ImageType {
  if(isString(val)) {
    return Object.values(JCD_V3_IMAGE_TYPE_ENUM).includes(val as JCD_V3_IMAGE_TYPE_ENUM);
  }
  return false;
}
