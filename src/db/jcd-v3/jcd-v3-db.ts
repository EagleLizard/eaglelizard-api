
import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import { Datastore } from '@google-cloud/datastore';
import { Storage } from '@google-cloud/storage';

import { config } from '../../config';

import { createJcdV3Keys } from './jcd-v3-create/create-jcd-v3-project-keys';
import { createJcdV3ProjectOrders } from './jcd-v3-create/create-jcd-v3-project-orders';
import { createJcdV3ProjectImages } from './jcd-v3-create/create-jcd-v3-project-images';
import { createJcdV3Projects } from './jcd-v3-create/create-jcd-v3-projects';

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

  const gcpDb = new Datastore;

  console.log('Jcd V3 DB Create');

  console.log('');
  console.log('createJcdV3Keys...');
  await createJcdV3Keys(gcpDb);

  console.log('');
  console.log('createJcdV3ProjectOrders...');
  await createJcdV3ProjectOrders(gcpDb);

  console.log('');
  console.log('createJcdV3Images...');
  await createJcdV3ProjectImages(gcpDb);

  console.log('');
  console.log('createJcdV3Projects...');
  await createJcdV3Projects(gcpDb);

  // console.log(jcdV3ProjectKeys);
  // const bucketv3 = gcpStorage.bucket(config.JCD_V3_GCP_BUCKET);
  // const [ filesV3 ] = await bucketv3.getFiles();
  // console.log(filesV3.length);
  // filesV3.forEach(file => {
  //   console.log(file.name);
  // });
}
