
import { Datastore, Key, Query, Transaction } from '@google-cloud/datastore';
import { JCD_V3_DB_PROJECT_KEY_KIND } from '../../../lib/jcd-v3-constants';

import { JcdV3ProjectKey } from '../../../models/jcd-models-v3/jcd-v3-project-key';
import { JCD_V3_PROJECT_LIST } from '../jcd-v3-project-list';

export async function createJcdV3Keys(gcpDb: Datastore) {
  let transaction: Transaction;
  let projecKeysQuery: Query, projectKeyDbEntities: unknown[];
  let currJcdV3ProjectKeys: JcdV3ProjectKey[], nextJcdV3ProjectKeys: JcdV3ProjectKey[];

  projecKeysQuery = gcpDb.createQuery(JCD_V3_DB_PROJECT_KEY_KIND);
  [ projectKeyDbEntities ] = await projecKeysQuery.run();

  currJcdV3ProjectKeys = projectKeyDbEntities.map(JcdV3ProjectKey.deserialize);
  // console.log(currJcdV3ProjectKeys);
  nextJcdV3ProjectKeys = JCD_V3_PROJECT_LIST.map(jcdV3ProjectEnumKey => {
    return new JcdV3ProjectKey(
      jcdV3ProjectEnumKey,
      true,
    );
  });

  nextJcdV3ProjectKeys = nextJcdV3ProjectKeys
    .filter(nextJcdV3ProjectKey => {
      let foundCurrJcdV3ProjectKeyIdx: number;
      foundCurrJcdV3ProjectKeyIdx = currJcdV3ProjectKeys
        .findIndex(currJcdV3ProjectKey => {
          return currJcdV3ProjectKey.projectKey === nextJcdV3ProjectKey.projectKey;
        });
      return foundCurrJcdV3ProjectKeyIdx === -1;
    });

  transaction = gcpDb.transaction();

  nextJcdV3ProjectKeys.forEach(jcdV3ProjectKeyEntity => {
    let dbKey: Key;
    dbKey  = gcpDb.key([ JCD_V3_DB_PROJECT_KEY_KIND, jcdV3ProjectKeyEntity.projectKey ]);
    transaction.upsert({
      key: dbKey,
      data: {
        projectKey: jcdV3ProjectKeyEntity.projectKey,
        active: jcdV3ProjectKeyEntity.active,
      },
    });
  });

  try {
    await transaction.commit();
  } catch(e) {
    await transaction.rollback();
    throw e;
  }
}
