
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

const DEFAULT_PORT = 8080;

let PORT: number;
const APP_ROOT = path.resolve(__dirname, '..');
const RUNTIME_ENV = process.env.NODE_ENV || 'development';

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
