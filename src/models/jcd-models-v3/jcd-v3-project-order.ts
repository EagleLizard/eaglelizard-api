
import {
  isObject,
  isString,
  isNumber,
} from '../../lib/modules/type-validation/validate-primitives';
import { JcdTypeError } from '../jcd-type-error';

export class JcdV3ProjectOrder {
  constructor(
    public projectKey: string,
    public orderIdx: number,
  ) {}

  static deserialize(rawProjectOrder: unknown): JcdV3ProjectOrder {
    let jcdV3ProjectOrder: Record<string, unknown>;
    let projectKey: string,
      orderIdx: number
    ;

    if(!isObject(rawProjectOrder)) {
      throw new JcdTypeError('object');
    }
    jcdV3ProjectOrder = rawProjectOrder as Record<string, unknown>;

    if(!isString(jcdV3ProjectOrder.projectKey)) {
      throw new JcdTypeError('string');
    }
    if(!isNumber(jcdV3ProjectOrder.orderIdx)) {
      throw new JcdTypeError('number');
    }

    projectKey = jcdV3ProjectOrder.projectKey;
    orderIdx = jcdV3ProjectOrder.orderIdx;

    return new JcdV3ProjectOrder(
      projectKey,
      orderIdx,
    );
  }
}
