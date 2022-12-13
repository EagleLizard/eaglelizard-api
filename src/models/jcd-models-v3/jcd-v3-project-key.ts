
import {
  isObject,
  isString,
  isBoolean,
} from '../../lib/modules/type-validation/validate-primitives';
import {
  JcdTypeError,
} from '../jcd-type-error';

export class JcdV3ProjectKey {
  constructor(
    public projectKey: string,
    public active: boolean,
  ) {}

  static deserialize(rawJcdV3ProjectKey: unknown): JcdV3ProjectKey {
    let jcdV3ProjectKey: JcdV3ProjectKey;
    let projectKey: string,
      active: boolean
    ;
    if(!isObject(rawJcdV3ProjectKey)) {
      throw new JcdTypeError('object');
    }
    jcdV3ProjectKey = rawJcdV3ProjectKey as JcdV3ProjectKey;

    if(!isString(jcdV3ProjectKey.projectKey)) {
      throw new JcdTypeError('string');
    }
    if(!isBoolean(jcdV3ProjectKey.active)) {
      throw new JcdTypeError('boolean');
    }

    projectKey = jcdV3ProjectKey.projectKey;
    active = jcdV3ProjectKey.active;

    return new JcdV3ProjectKey(
      projectKey,
      active,
    );

  }
}
