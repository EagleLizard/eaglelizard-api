
import {
  isObject,
} from '../../modules/type-validation/validate-primitives';
import {
  JcdTypeError
} from '../../../models/jcd-type-error';

export class ImageCacheMetaV2 {
  constructor(
    public headers: Record<string, string>,
  ) {}

  static deserialize(rawImageCacheMeta: unknown): ImageCacheMetaV2 {
    let imageCacheMeta: Record<string, unknown>;
    let headers: Record<string, string>;
    if(!isObject(rawImageCacheMeta)) {
      throw new JcdTypeError('object');
    }
    imageCacheMeta = rawImageCacheMeta as Record<string, unknown>;
    if(!isObject(imageCacheMeta.headers)) {
      throw new Error('object');
    }

    headers = imageCacheMeta.headers as Record<string, string>;

    return new ImageCacheMetaV2(
      headers,
    );
  }
}
