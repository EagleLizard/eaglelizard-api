
import { Datastore, Key, Query, Transaction } from '@google-cloud/datastore';
import { JcdV3Project } from '../../../models/jcd-models-v3/jcd-v3-project';
import { JCD_V3_PROJECT_BASES } from '../jcd-v3-projects-base';
import { JCD_V3_DB_PROJECT_KEY_KIND, JCD_V3_DB_PROJECT_KIND } from '../../../lib/jcd-v3-constants';

export async function createJcdV3Projects(gcpDb: Datastore) {
  let transaction: Transaction;
  let projectsQuery: Query, jcdV3ProjectEntities: unknown[];
  let currJcdV3Projects: JcdV3Project[], nextJcdV3Projects: JcdV3Project[];

  nextJcdV3Projects = [];

  /*
    Validate no duplicates
  */
  JCD_V3_PROJECT_BASES.forEach(jcdV3ProjectBase => {
    let foundProjectIdx: number;
    foundProjectIdx = nextJcdV3Projects.findIndex(nextJcdV3Project => {
      return nextJcdV3Project.projectKey === jcdV3ProjectBase.projectKey;
    });
    if(foundProjectIdx !== -1) {
      throw new Error(`Duplicate project definition encountered, projectKey: '${jcdV3ProjectBase.projectKey}'`);
    }
    nextJcdV3Projects.push(jcdV3ProjectBase);
  });
  /*
    Deserialize for type validation/safety
  */
  nextJcdV3Projects = nextJcdV3Projects.map(JcdV3Project.deserialize);

  projectsQuery = gcpDb.createQuery(JCD_V3_DB_PROJECT_KIND);
  [ jcdV3ProjectEntities ] = await projectsQuery.run();

  currJcdV3Projects = jcdV3ProjectEntities.map(JcdV3Project.deserialize);

  nextJcdV3Projects = nextJcdV3Projects.filter(nextJcdV3Project => {
    let foundCurrJcdV3ProjectIdx: number;
    foundCurrJcdV3ProjectIdx = currJcdV3Projects.findIndex(currJcdV3Project => {
      return JcdV3Project.equals(currJcdV3Project, nextJcdV3Project);
    });
    return foundCurrJcdV3ProjectIdx === -1;
  });

  if(nextJcdV3Projects.length > 0) {
    const nextJcdV3ProjectIds = nextJcdV3Projects.map(jcdV3Project => jcdV3Project.projectKey);
    nextJcdV3ProjectIds.forEach(nextJcdV3ProjectId => {
      console.log([ nextJcdV3ProjectId ]);
    });
  }

  transaction = gcpDb.transaction();

  nextJcdV3Projects.forEach(nextJcdV3Project => {
    let dbKey: Key, jcdV3ProjectEntityData: JcdV3Project;
    dbKey = gcpDb.key([ JCD_V3_DB_PROJECT_KIND, nextJcdV3Project.projectKey ]);
    jcdV3ProjectEntityData = {
      projectKey: nextJcdV3Project.projectKey,
      route: nextJcdV3Project.route,
      title: nextJcdV3Project.title,
      playwright: nextJcdV3Project.playwright,
      venue: nextJcdV3Project.venue,
      producer: nextJcdV3Project.producer,
      month: nextJcdV3Project.month,
      year: nextJcdV3Project.year,
      description: nextJcdV3Project.description,
      productionCredits: nextJcdV3Project.productionCredits,
      mediaAndPress: nextJcdV3Project.mediaAndPress,
    };
    transaction.upsert({
      key: dbKey,
      data: jcdV3ProjectEntityData,
    });
  });

  try {
    await transaction.commit();
  } catch(e) {
    await transaction.rollback();
    throw e;
  }

}
