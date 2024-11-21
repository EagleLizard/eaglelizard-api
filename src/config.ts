
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

import { isString } from './lib/modules/type-validation/validate-primitives';

const DEFAULT_PORT = 8080;

let PORT: number;
const APP_ROOT = path.resolve(__dirname, '..');
const RUNTIME_ENV = process.env.NODE_ENV || 'development';
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
const aws_access_key_id = process.env.aws_access_key_id;
const APP_ENV = process.env.APP_ENV;

const JCD_GCP_BUCKET = 'jcd-image-1';
const JCD_V3_GCP_BUCKET = 'jcd-image-v3';

const JCD_WEB_ORIGIN = getEnvVarOrErr('JCD_WEB_ORIGIN');
const IMG_MEM_CACHE = getBoolEnvVar('IMG_MEM_CACHE');

const SFS_PORT = getNumberEnvVar('SFS_PORT');

(() => {
  try {
    init();
  } catch(e) {
    console.error(e);
    throw e;
  }
})();

export type EzdConfig = {
  PORT: number;
  APP_ROOT: string;
  RUNTIME_ENV: string;
  GCP_PROJECT_ID: string;
  aws_access_key_id: string;
  APP_ENV: string;
  JCD_GCP_BUCKET: string;
  JCD_V3_GCP_BUCKET: string;

  JCD_WEB_ORIGIN: string;
  IMG_MEM_CACHE: boolean;

  SFS_PORT: number;
}

export const config = {
  PORT,
  APP_ROOT,
  RUNTIME_ENV,
  GCP_PROJECT_ID,
  aws_access_key_id,
  APP_ENV,
  JCD_GCP_BUCKET,
  JCD_V3_GCP_BUCKET,

  JCD_WEB_ORIGIN,
  IMG_MEM_CACHE,
  SFS_PORT,
} as const satisfies EzdConfig;

function init() {
  let isEnvPortStrValid: boolean, isEnvPortValid: boolean;
  isEnvPortStrValid = (
    ((typeof process.env.PORT) === 'string')
    && (process.env.PORT.trim().length > 0))
  ;
  isEnvPortValid = (isEnvPortStrValid === true)
    ? !isNaN(+process.env.PORT)
    : ((typeof process.env.PORT) === 'number')
  ;
  PORT = isEnvPortValid ? (+process.env.PORT) : DEFAULT_PORT;
}

export function isDevEnv(): boolean {
  return config.APP_ENV === 'dev';
}

function getEnvVarOrErr(envKey: string): string {
  let rawEnvVar: string | undefined;
  rawEnvVar = process.env[envKey];
  if(!isString(rawEnvVar)) {
    throw new Error(`Invalid ${envKey}`);
  }
  return rawEnvVar;
}

function getBoolEnvVar(envKey: string): boolean {
  let envVal = process.env[envKey];
  if(envVal?.toLowerCase() === 'true') {
    return true;
  }
  return false;
}

function getNumberEnvVar(envKey: string): number {
  let rawPort: string;
  let portNum: number;
  rawPort = getEnvVarOrErr(envKey);
  portNum = +rawPort;
  if(isNaN(portNum)) {
    throw new Error(`invalid env var ${envKey}, expected 'number'`);
  }
  return portNum;
}
