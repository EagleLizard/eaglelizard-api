
import sourceMapSupport from 'source-map-support';
sourceMapSupport.install();

import { Datastore, Entity, Key, Query, Transaction } from '@google-cloud/datastore';

import { config } from '../config';
import { _JcdProject, JcdProjects, JCD_PROJECT_ORDER } from './jcd-projects';
import { JCD_PROJECT_ENUM } from './jcd-constants';
import { isNumber, isString } from '../lib/modules/type-validation/validate-primitives';
import {
  JcdProjectListItem,
} from '../models/jcd-entities';

const db = new Datastore;

(async () => {
  if(config.APP_ENV === 'dev') {
    console.log(config.APP_ENV);
  }
  try {
    await createDb();
  } catch(e) {
    console.error(e);
    throw e;
  }
})();

async function createDb() {
  await createProjects();
  await createProjectList();
  await createProjectPages();
}

async function createProjectList() {
  let query: Query, projectEntities: Entity[];
  let projectListItems: JcdProjectListItem[];
  let transaction: Transaction;

  query = db.createQuery('JcdProject');
  [ projectEntities ] = await query.run();

  transaction = db.transaction();

  try {
    projectListItems = projectEntities.map(projectEntity => {
      let projectKey: string, orderIndex: number;

      if(isString(projectEntity?.projectKey)) {
        projectKey = projectEntity.projectKey;
      } else {
        throw new Error(`Invalid projectKey type, expected string, received: ${typeof projectEntity?.projectKey}`);
      }
      if(isNumber(projectEntity?.orderIndex)) {
        orderIndex = projectEntity.orderIndex;
      } else {
        throw new Error(`Invalid orderIndex type, expected number, received: ${typeof projectEntity?.orderIndex}`);
      }

      return {
        projectKey,
        orderIndex,
      };
    });

    projectListItems.forEach(projectListItem => {
      let dbKey: Key;
      dbKey = db.key([ 'JcdProjectKey', projectListItem.projectKey ]);
      const jcdProjectKey = {
        key: dbKey,
        data: {
          projectKey: projectListItem.projectKey,
          orderIndex: projectListItem.orderIndex,
        },
      };
      transaction.save(jcdProjectKey);
    });

    await transaction.commit();

  } catch(e) {
    await transaction.rollback();
    throw e;
  }
}

async function createProjectPages() {
  let transaction: Transaction;
  console.log('createProjectPages');
  transaction = db.transaction();
  try {
    for(let i = 0; i < JcdProjects.length; ++i) {
      let currProject: _JcdProject;
      currProject = JcdProjects[i];
      createProjectPage(transaction, currProject);
    }
    await transaction.commit();
  } catch(e) {
    await transaction.rollback();
    throw e;
  }
}

function createProjectPage(transaction: Transaction, project: _JcdProject) {
  let dbKey: Key;
  dbKey = db.key([ 'JcdProjectPage', project.projectKey ]);
  const jcdProjectPage = {
    key: dbKey,
    data: {
      projectKey: project.projectKey,
      galleryImageUris: project.projectPage.galleryImageUris,
      projectDetails: {
        org: project.projectPage.projectDetails.org,
        month: project.projectPage.projectDetails.month,
        year: project.projectPage.projectDetails.year,
        credit: project.projectPage.projectDetails.credit,
        credits: project.projectPage.projectDetails.credits,
        mediaAndPress: project.projectPage.projectDetails.mediaAndPress,
        originalCredits: project.projectPage.projectDetails.originalCredits,
      },
    },
  };
  transaction.save(jcdProjectPage);
}

async function createProjects() {
  let transaction: Transaction;

  console.log('Create Projects');

  transaction = db.transaction();
  try {
    for(let i = 0; i < JcdProjects.length; ++i) {
      let currProject: _JcdProject;
      currProject = JcdProjects[i];
      createProject(transaction, currProject);
    }
    await transaction.commit();
  } catch(e) {
    await transaction.rollback();
    throw e;
  }
}

function createProject(transaction: Transaction, project: _JcdProject) {
  // first create all of the image entities and get the ids
  let key: Key, orderIdx: number;
  key = db.key([ 'JcdProject', project.projectKey ]);
  orderIdx = getOrderIdx(project.projectKey);
  const jcdProject = {
    key,
    data: {
      orderIndex: orderIdx,
      title: project.title,
      projectKey: project.projectKey,
      coverImageUri: project.coverImageUri,
      route: project.route,
    }
  };
  transaction.save(jcdProject);
}

function getOrderIdx(projectKey: JCD_PROJECT_ENUM) {
  let foundIdx: number;
  foundIdx = JCD_PROJECT_ORDER.findIndex(orderKey => {
    return orderKey === projectKey;
  });
  if(foundIdx === -1) {
    throw new Error(`No order index found for project: ${projectKey}`);
  }
  return foundIdx;
}
