
import type { Datastore } from '@google-cloud/datastore';

export type JcdV3CreateDbOpts = {
  gcpDb: Datastore,
  dry?: boolean,
};
