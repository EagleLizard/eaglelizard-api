
import { Datastore, Transaction } from '@google-cloud/datastore';
import { JcdV3Project } from '../../../models/jcd-models-v3/jcd-v3-project';
import { JCD_V3_PROJECT_BASES } from '../jcd-v3-projects-base';

export async function createJcdV3Projects(gcpDb: Datastore) {
  let transaction: Transaction;
  let nextJcdV3Projects: JcdV3Project[];

  nextJcdV3Projects = JCD_V3_PROJECT_BASES.map(JcdV3Project.deserialize);
  console.log(nextJcdV3Projects);

}
