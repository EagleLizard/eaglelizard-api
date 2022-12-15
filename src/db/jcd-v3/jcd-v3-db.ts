
import { Datastore, Entity, Key, Query, Transaction } from '@google-cloud/datastore';
import { Storage } from '@google-cloud/storage';

import { config } from '../../config';
import { JcdProject } from '../../models/jcd-entities';
import { JcdV3ProjectKey } from '../../models/jcd-models-v3/jcd-v3-project-key';
import { JcdV3ProjectOrder } from '../../models/jcd-models-v3/jcd-v3-project-order';
import { JcdV3Image } from '../../models/jcd-models-v3/jcd-v3-image';
import { JCD_V3_PROJECT_LIST, JCD_V3_PROJECT_ORDER_BASE as JCD_V3_PROJECT_ORDER_BASES } from './jcd-v3-project-list';
import { JcdV3ImageProjectBase, JCD_V3_IMAGE_PROJECT_BASES } from './jcd-v3-images-base';
import { JCD_V3_PROJECT_ENUM } from './jcd-v3-project-enum';
// import { JCD_PROJECT_ENUM as JCD_V3_PROJECT_ENUM } from '../jcd-constants';

const gcpDb = new Datastore;

(async () => {
  if(config.APP_ENV === 'dev') {
    console.log(config.APP_ENV);
  }
  try {
    await jcdV3DbMain();
  } catch(e) {
    console.error(e);
    throw e;
  }
})();

async function jcdV3DbMain() {
  console.log('Jcd V3 DB Create');
  console.log('createJcdV3Keys...');
  await createJcdV3Keys();
  console.log('createJcdV3ProjectOrders...');
  await createJcdV3ProjectOrders();
  // console.log('createJcdV3Images...');
  // await createJcdV3ProjectImages();

  // console.log(jcdV3ProjectKeys);
  // const bucketv3 = gcpStorage.bucket(config.JCD_V3_GCP_BUCKET);
  // const [ filesV3 ] = await bucketv3.getFiles();
  // console.log(filesV3.length);
  // filesV3.forEach(file => {
  //   console.log(file.name);
  // });
}

async function createJcdV3Keys() {
  let transaction: Transaction;
  let projecKeysQuery: Query, projectKeyDbEntities: unknown[];
  let currJcdV3ProjectKeys: JcdV3ProjectKey[], nextJcdV3ProjectKeys: JcdV3ProjectKey[];

  projecKeysQuery = gcpDb.createQuery('JcdProjectKeyV3');
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
    dbKey  = gcpDb.key([ 'JcdProjectKeyV3', jcdV3ProjectKeyEntity.projectKey ]);
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

async function createJcdV3ProjectOrders() {
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

async function createJcdV3ProjectImages() {
  let jcdV3Images: JcdV3Image[];
  jcdV3Images = [];

  let jcdV3ImageProjectBases: JcdV3ImageProjectBase[];
  jcdV3ImageProjectBases = [];

  /*
    pre-validate type safety and base project existence before initiating
      any transactions, since we will have a separate transaction per
      project
  */
  JCD_V3_PROJECT_LIST.forEach(currV3ProjectEnum => {
    let currV3ImageProjectBase: JcdV3ImageProjectBase;
    currV3ImageProjectBase = JCD_V3_IMAGE_PROJECT_BASES.find(imgProjBase => {
      return imgProjBase.projectKey === currV3ProjectEnum;
    });
    if(currV3ImageProjectBase === undefined) {
      throw new Error(`Could not find project with key '${currV3ProjectEnum}' in list of project bases`);
    }
    jcdV3ImageProjectBases.push(currV3ImageProjectBase);
  });

  for(let i = 0; i < jcdV3ImageProjectBases.length; ++i) {
    let currV3ImageProjectBase: JcdV3ImageProjectBase;
    currV3ImageProjectBase = jcdV3ImageProjectBases[i];
    await createJcdV3ProjectImage(currV3ImageProjectBase);
  }
}

async function createJcdV3ProjectImage(jcdV3ImageProjectBase: JcdV3ImageProjectBase) {
  let transaction: Transaction;
  let jcdV3ProjectKeyId: JCD_V3_PROJECT_ENUM, jcdV3Images: JcdV3Image[];
  let titleImagePath: string, titleJcdV3Image: JcdV3Image;

  jcdV3ProjectKeyId = jcdV3ImageProjectBase.projectKey;
  jcdV3Images = [];
  titleImagePath = jcdV3ImageProjectBase.titleImgUri;
  titleJcdV3Image = {
    id: JcdV3Image.getIdFromBucketPath(titleImagePath),
    projectKey: jcdV3ProjectKeyId,
    bucketFile: titleImagePath,
    orderIdx: -1,
    active: true,
    imageType: 'TITLE',
  };
  jcdV3Images.push(titleJcdV3Image);
  jcdV3ImageProjectBase.galleryImgUris.forEach((galleryImageUri, idx) => {
    let galleryJcdV3Image: JcdV3Image, galleryImageId: string;
    galleryImageId = JcdV3Image.getIdFromBucketPath(galleryImageUri);
    galleryJcdV3Image = {
      id: galleryImageId,
      projectKey: jcdV3ProjectKeyId,
      bucketFile: galleryImageUri,
      orderIdx: idx,
      active: true,
      imageType: 'GALLERY',
    };
    jcdV3Images.push(galleryJcdV3Image);
  });

  /*
    Run the plain JcdV3Images through the deserialize function to enforce
      type safety
  */
  jcdV3Images = jcdV3Images.map(jcdV3Image => {
    try {
      return JcdV3Image.deserialize(jcdV3Image);
    } catch(e) {
      console.error(`Failed to deserialize JcdV3Image '${jcdV3Image.id}' for projectKey '${jcdV3Image.projectKey}'`);
      throw e;
    }
  });

  transaction = gcpDb.transaction();

  jcdV3Images.forEach(jcdV3Image => {
    let dbKey: Key;
    dbKey = gcpDb.key([ 'JcdImageV3', jcdV3Image.id ]);
    transaction.upsert({
      key: dbKey,
      data: {
        ...jcdV3Image,
      }
    });
  });

  try {
    await transaction.commit();
  } catch(e) {
    await transaction.rollback();
    throw e;
  }

}
