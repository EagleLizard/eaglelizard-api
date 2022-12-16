
import {} from '../../lib/modules/type-validation/validate-primitives';
import { JcdTypeError } from '../jcd-type-error';

export class JcdV3ProjectPreview {

  constructor(
    public projectKey: string,
    public route: string,
    public title: string,
    public titleUri: string,
    public orderIndex: number,
  ) {}
}
