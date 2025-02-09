
import { Datastore, Key, Query, Transaction } from '@google-cloud/datastore';
import { JCD_V3_DB_IMAGE_KIND } from '../../../lib/jcd-v3-constants';
import { JcdV3Image } from '../../../models/jcd-models-v3/jcd-v3-image';

import { JcdV3ImageProjectBase, JCD_V3_IMAGE_PROJECT_BASES } from '../jcd-v3-images-base';
import { JCD_V3_PROJECT_ENUM } from '../jcd-v3-project-enum';
import { JCD_V3_PROJECT_LIST } from '../jcd-v3-project-list';
import { JcdV3CreateDbOpts } from './jcd-v3-create';

export async function createJcdV3ProjectImages(opts: JcdV3CreateDbOpts) {
  let gcpDb: Datastore = opts.gcpDb;
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
    await createJcdV3ProjectImage({
      gcpDb,
      jcdV3ImageProjectBase: currV3ImageProjectBase,
      dry: opts.dry,
    });
  }
}

type CreateJcdV3ProjectImageOpts = {
  jcdV3ImageProjectBase: JcdV3ImageProjectBase;
} & JcdV3CreateDbOpts;

async function createJcdV3ProjectImage(opts: CreateJcdV3ProjectImageOpts) {
  let gcpDb: Datastore = opts.gcpDb;
  let jcdV3ImageProjectBase: JcdV3ImageProjectBase = opts.jcdV3ImageProjectBase;
  let transaction: Transaction;
  let imageQuery: Query, imageDbEntities: any[];
  let currJcdV3Images: JcdV3Image[];
  let jcdV3ProjectKeyId: JCD_V3_PROJECT_ENUM, nextJcdV3Images: JcdV3Image[];
  let titleImagePath: string, titleJcdV3Image: JcdV3Image;

  jcdV3ProjectKeyId = jcdV3ImageProjectBase.projectKey;
  nextJcdV3Images = [];
  titleImagePath = jcdV3ImageProjectBase.titleImgUri;
  titleJcdV3Image = {
    id: JcdV3Image.getIdFromBucketPath(titleImagePath),
    projectKey: jcdV3ProjectKeyId,
    bucketFile: titleImagePath,
    orderIdx: -1,
    active: true,
    imageType: 'TITLE',
  };
  nextJcdV3Images.push(titleJcdV3Image);
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
    nextJcdV3Images.push(galleryJcdV3Image);
  });

  /*
    Run the plain JcdV3Images through the deserialize function to enforce
      type safety
  */
  nextJcdV3Images = nextJcdV3Images.map(jcdV3Image => {
    try {
      return JcdV3Image.deserialize(jcdV3Image);
    } catch(e) {
      console.error(`Failed to deserialize JcdV3Image '${jcdV3Image.id}' for projectKey '${jcdV3Image.projectKey}'`);
      throw e;
    }
  });

  imageQuery = gcpDb
    .createQuery(JCD_V3_DB_IMAGE_KIND)
    .filter('projectKey', '=', jcdV3ProjectKeyId)
  ;
  [ imageDbEntities ] = await imageQuery.run();
  currJcdV3Images = imageDbEntities.map(JcdV3Image.deserialize);

  nextJcdV3Images = nextJcdV3Images
    .filter(nextJcdV3Image => {
      let foundCurrJcdV3ImageIdx: number;
      foundCurrJcdV3ImageIdx = currJcdV3Images
        .findIndex(currJcdV3Image => {
          return (
            (currJcdV3Image.id === nextJcdV3Image.id)
            && (currJcdV3Image.imageType === nextJcdV3Image.imageType)
            && (currJcdV3Image.orderIdx === nextJcdV3Image.orderIdx)
            && (currJcdV3Image.bucketFile === nextJcdV3Image.bucketFile)
            && (currJcdV3Image.active === nextJcdV3Image.active)
          );
        });
      return foundCurrJcdV3ImageIdx === -1;
    });

  if(nextJcdV3Images.length > 0) {
    const tupleHeaders: (keyof JcdV3Image)[] = [ 'id', 'orderIdx', 'active' ];
    const nextJcdV3ImageTuples = nextJcdV3Images.map(jcdV3Image => {
      return tupleHeaders.reduce((acc, curr) => {
        acc.push(jcdV3Image[curr]);
        return acc;
      }, []);
    });
    console.log(jcdV3ProjectKeyId);
    console.log(tupleHeaders.join(', '));
    nextJcdV3ImageTuples.forEach(jcdImageTuple => {
      console.log(jcdImageTuple);
    });
  }

  if(opts.dry) {
    console.log('dry');
    return;
  }
  transaction = gcpDb.transaction();

  nextJcdV3Images.forEach(jcdV3Image => {
    let dbKey: Key;
    dbKey = gcpDb.key([ JCD_V3_DB_IMAGE_KIND, jcdV3Image.id ]);
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
