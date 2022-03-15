
import { Datastore } from '@google-cloud/datastore';

const db = new Datastore;

export class GcpDbService {
  static get gcpDb(): Datastore {
    return db;
  }
}
