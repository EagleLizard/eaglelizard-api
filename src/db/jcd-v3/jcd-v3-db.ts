
import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import { Datastore } from '@google-cloud/datastore';
import { Storage } from '@google-cloud/storage';

import { config } from '../../config';

import { createJcdV3Keys } from './jcd-v3-create/create-jcd-v3-project-keys';
import { createJcdV3ProjectOrders } from './jcd-v3-create/create-jcd-v3-project-orders';
import { createJcdV3ProjectImages } from './jcd-v3-create/create-jcd-v3-project-images';
import { createJcdV3Projects } from './jcd-v3-create/create-jcd-v3-projects';
import { creatJcdV3Art } from './jcd-v3-create/create-jcd-v3-art';

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
  const gcpStorage = new Storage;
  let dry = false;
  dry = true;

  console.log('Jcd V3 DB Create');

  console.log('');
  console.log('createJcdV3Keys...');
  await createJcdV3Keys({
    gcpDb,
    dry,
  });

  console.log('');
  console.log('createJcdV3ProjectOrders...');
  await createJcdV3ProjectOrders({
    gcpDb,
    dry,
  });

  console.log('');
  console.log('createJcdV3Images...');
  await createJcdV3ProjectImages({
    gcpDb,
    dry,
  });

  console.log('');
  console.log('createJcdV3Projects...');
  await createJcdV3Projects({
    gcpDb,
    dry,
  });

  console.log('');
  console.log('createJcdV3Images art/ ...');
  await creatJcdV3Art({
    gcpDb,
    dry,
  });

  // const bucketv3 = gcpStorage.bucket(config.JCD_V3_GCP_BUCKET);
  // const [ filesV3 ] = await bucketv3.getFiles();
  // console.log(filesV3.length);
  // const artFiles = filesV3.filter(file => {
  //   return file.name.startsWith('art/');
  // });
  // artFiles.forEach(file => {
  //   if(file.name.startsWith('art/')) {
  //     console.log(file.name);
  //   }
  // });
  // console.log(`artFiles.length: ${artFiles.length}`);
}
