
import { Datastore, Key, Query, Transaction } from '@google-cloud/datastore';

import { JcdV3ProjectOrder } from '../../../models/jcd-models-v3/jcd-v3-project-order';
import { JCD_V3_PROJECT_ORDER_BASES } from '../jcd-v3-project-list';

export async function createJcdV3ProjectOrders(gcpDb: Datastore) {
  let transaction: Transaction;
  let projectOrderQuery: Query, projectOrderDbEntities: any[];
  let currJcdV3ProjectOrders: JcdV3ProjectOrder[], nextJcdV3ProjectOrders: JcdV3ProjectOrder[];

  nextJcdV3ProjectOrders = [];

  JCD_V3_PROJECT_ORDER_BASES.forEach(jcdV3ProjectOrderBase => {
    let foundProjectOrderWithOrderIdx: JcdV3ProjectOrder,
      foundProjectOrderWithProjectKey: JcdV3ProjectOrder
    ;
    // enforce uniqueness
    foundProjectOrderWithOrderIdx = nextJcdV3ProjectOrders.find(existingJcdV3ProjectOrderEntity => {
      return existingJcdV3ProjectOrderEntity.orderIdx === jcdV3ProjectOrderBase.orderIdx;
    });
    if(foundProjectOrderWithOrderIdx !== undefined) {
      throw new Error(`Duplicate orderIdx ${foundProjectOrderWithOrderIdx.orderIdx} when adding ${jcdV3ProjectOrderBase.projectKey}, JcdV3ProjectOrder entity '${foundProjectOrderWithOrderIdx.projectKey}' already exists with the same orderIdx`);
    }
    foundProjectOrderWithProjectKey = nextJcdV3ProjectOrders.find(existingJcdV3ProjectOrderEntity => {
      return existingJcdV3ProjectOrderEntity.projectKey === jcdV3ProjectOrderBase.projectKey;
    });
    if(foundProjectOrderWithProjectKey !== undefined) {
      throw new Error(`Duplicate projectKey '${foundProjectOrderWithProjectKey.projectKey}'`);
    }

    nextJcdV3ProjectOrders.push(jcdV3ProjectOrderBase);
  });

  // Deserialize plain objects for type safety
  nextJcdV3ProjectOrders = nextJcdV3ProjectOrders.map(JcdV3ProjectOrder.deserialize);

  projectOrderQuery = gcpDb.createQuery('JcdProjectOrderV3');
  [ projectOrderDbEntities ] = await projectOrderQuery.run();
  currJcdV3ProjectOrders = projectOrderDbEntities.map(JcdV3ProjectOrder.deserialize);

  nextJcdV3ProjectOrders = nextJcdV3ProjectOrders
    .filter(nextJcdV3ProjectOrder => {
      let foundCurrJcdV3OrderIdx: number;
      foundCurrJcdV3OrderIdx = currJcdV3ProjectOrders
        .findIndex(currJcdV3ProjectOrder => {
          return (
            (currJcdV3ProjectOrder.projectKey === nextJcdV3ProjectOrder.projectKey)
            && (currJcdV3ProjectOrder.orderIdx === nextJcdV3ProjectOrder.orderIdx)
          );
        });
      return foundCurrJcdV3OrderIdx === -1;
    });

  transaction = gcpDb.transaction();

  nextJcdV3ProjectOrders.forEach(jcdV3ProjectOrderEntity => {
    let dbKey: Key, jcdV3ProjectOrderEntityData: JcdV3ProjectOrder;
    dbKey = gcpDb.key([ 'JcdProjectOrderV3', jcdV3ProjectOrderEntity.projectKey ]);
    jcdV3ProjectOrderEntityData = {
      projectKey: jcdV3ProjectOrderEntity.projectKey,
      orderIdx: jcdV3ProjectOrderEntity.orderIdx,
    };
    transaction.upsert({
      key: dbKey,
      data: jcdV3ProjectOrderEntityData,
    });
  });

  try {
    await transaction.commit();
  } catch(e) {
    await transaction.rollback();
    throw e;
  }

}
