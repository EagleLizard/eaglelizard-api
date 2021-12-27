
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

const DEFAULT_PORT = 8080;

let PORT: number;
const APP_ROOT = path.resolve(__dirname, '..');
const RUNTIME_ENV = process.env.NODE_ENV || 'development';
const GCP_PROJECT_ID = process.env.GCP_PROJECT_ID;
const aws_access_key_id = process.env.aws_access_key_id;
const APP_ENV = process.env.APP_ENV;

(() => {
  try {
    init();
  } catch(e) {
    console.error(e);
    throw e;
  }
})();

export const config = {
  PORT,
  APP_ROOT,
  RUNTIME_ENV,
  GCP_PROJECT_ID,
  aws_access_key_id,
  APP_ENV,
};

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
