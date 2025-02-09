
import { Datastore, Key, Query, Transaction } from '@google-cloud/datastore';

import { JcdV3ProjectOrder } from '../../../models/jcd-models-v3/jcd-v3-project-order';
import { JCD_V3_PROJECT_ORDER_BASES } from '../jcd-v3-project-list';
import { JCD_V3_DB_PROJECT_ORDER_KIND } from '../../../lib/jcd-v3-constants';
import { JcdV3CreateDbOpts } from './jcd-v3-create';

export async function createJcdV3ProjectOrders(opts: JcdV3CreateDbOpts) {
  let gcpDb: Datastore = opts.gcpDb;
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

  projectOrderQuery = gcpDb.createQuery(JCD_V3_DB_PROJECT_ORDER_KIND);
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

  if(nextJcdV3ProjectOrders.length > 0) {
    const tupleHeaders: (keyof JcdV3ProjectOrder)[] = [ 'projectKey', 'orderIdx' ];
    const jcdProjectOrderTuples = nextJcdV3ProjectOrders.map(jcdProjectOrder => {
      return tupleHeaders.reduce((acc, curr) => {
        acc.push(jcdProjectOrder[curr]);
        return acc;
      }, []);
    });
    console.log(tupleHeaders.join(', '));
    jcdProjectOrderTuples.forEach(jcdProjectOrderTuple => {
      console.log(jcdProjectOrderTuple);
    });
  }
  if(opts.dry) {
    console.log('dry');
    return;
  }

  transaction = gcpDb.transaction();

  nextJcdV3ProjectOrders.forEach(jcdV3ProjectOrderEntity => {
    let dbKey: Key, jcdV3ProjectOrderEntityData: JcdV3ProjectOrder;
    dbKey = gcpDb.key([ JCD_V3_DB_PROJECT_ORDER_KIND, jcdV3ProjectOrderEntity.projectKey ]);
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
