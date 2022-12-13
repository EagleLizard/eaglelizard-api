
import { Datastore, Entity, Query } from '@google-cloud/datastore';
import { Storage } from '@google-cloud/storage';

import { config } from '../../config';
import { JcdProject } from '../../models/jcd-entities';
import { JcdV3ProjectKey } from '../../models/jcd-models-v3/jcd-v3-project-key';
import { JcdV3Image } from '../../models/jcd-models-v3/jcd-v3-image';
import { JCD_V3_PROJECT_LIST } from './jcd-v3-project-enum';
import { JcdV3ImageProjectBase, JCD_V3_IMAGE_PROJECT_BASES } from './jcd-v3-images-base';

const db = new Datastore;
const gcpStorage = new Storage;

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
  console.log(`JCD_V3_IMAGE_PROJECT_BASES.length ${JCD_V3_IMAGE_PROJECT_BASES.length}`);
  let jcdV3ProjectKeys: JcdV3ProjectKey;
  jcdV3ProjectKeys = JCD_V3_PROJECT_LIST.map(jcdV3ProjectEnumKey => {
    return new JcdV3ProjectKey(
      jcdV3ProjectEnumKey,
      true,
    );
  });
  await createJcdV3Images();
  // console.log(jcdV3ProjectKeys);
  // const bucketv3 = gcpStorage.bucket(config.JCD_V3_GCP_BUCKET);
  // const [ filesV3 ] = await bucketv3.getFiles();
  // filesV3.forEach(file => {
  //   console.log(file.name);
  // });
}

async function createJcdV3Images() {
  let jcdV3Images: JcdV3Image[];
  jcdV3Images = [];
  JCD_V3_PROJECT_LIST.forEach(jcdV3ProjectKey => {
    let jcdV3ImageProjectBase: JcdV3ImageProjectBase;
    let titleJcdV3Image: JcdV3Image, galleryJcdV3Images: JcdV3Image[];
    let titleImagePath: string;
    jcdV3ImageProjectBase = JCD_V3_IMAGE_PROJECT_BASES.find(imgProjBase => {
      return imgProjBase.projectKey === jcdV3ProjectKey;
    });
    if(jcdV3ImageProjectBase === undefined) {
      throw new Error(`Could not find project with key '${jcdV3ProjectKey}' in list of project bases`);
    }
    titleImagePath = jcdV3ImageProjectBase.titleImgUri;
    titleJcdV3Image = {
      id: JcdV3Image.getIdFromBucketPath(titleImagePath),
      projectKey: jcdV3ProjectKey,
      bucketFile: titleImagePath,
    };
  });
}
