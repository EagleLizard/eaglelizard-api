
import { Datastore, Key, Query, Transaction } from '@google-cloud/datastore';
import { JCD_V3_ART_PROJECT_KEY } from '../jcd-v3-project-enum';
import { JCD_V3_ART_IMAGES_BASE } from '../jcd-v3-art-images-base';
import { JcdV3Image } from '../../../models/jcd-models-v3/jcd-v3-image';
import { JCD_V3_DB_IMAGE_KIND } from '../../../lib/jcd-v3-constants';
import { JcdV3CreateDbOpts } from './jcd-v3-create';

export async function creatJcdV3Art(opts: JcdV3CreateDbOpts) {
  let gcpDb: Datastore = opts.gcpDb;
  let transaction: Transaction;
  let imageQuery: Query, imageDbEntities: unknown[];
  let jcdV3ArtProjectKeyId: string, currJcdV3Images: JcdV3Image[];
  let nextJcdV3Images: JcdV3Image[];
  console.log('~ art');
  jcdV3ArtProjectKeyId = JCD_V3_ART_PROJECT_KEY;
  imageQuery = gcpDb
    .createQuery(JCD_V3_DB_IMAGE_KIND)
    .filter('projectKey', '=', jcdV3ArtProjectKeyId)
  ;
  [ imageDbEntities ] = await imageQuery.run();
  currJcdV3Images = imageDbEntities.map(JcdV3Image.deserialize);

  nextJcdV3Images = JCD_V3_ART_IMAGES_BASE.map((artImageUri, idx) => {
    let jcdV3ArtImage: JcdV3Image, artImageId: string;
    artImageId = JcdV3Image.getIdFromBucketPath(artImageUri);
    jcdV3ArtImage = {
      id: artImageId,
      projectKey: jcdV3ArtProjectKeyId,
      bucketFile: artImageUri,
      orderIdx: idx,
      active: true,
      imageType: 'GALLERY',
    };
    return jcdV3ArtImage;
  });

  /*
    Deserialize for type safety
  */
  nextJcdV3Images = nextJcdV3Images.map(jcdV3Image => {
    try {
      return JcdV3Image.deserialize(jcdV3Image);
    } catch(e) {
      console.error(`Failed to deserialize JcdV3Image '${jcdV3Image.id}' for projectKey '${jcdV3Image.projectKey}'`);
      throw e;
    }
  });

  /*
    Remove existing entities from upsertion
  */
  nextJcdV3Images = nextJcdV3Images.filter(nextJcdV3Image => {
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
    console.log(jcdV3ArtProjectKeyId);
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
