import path from 'path';

import pino, { Logger, LoggerOptions } from 'pino';

import { config } from '../config';
import { LOG_DIR_PATH } from './constants';
import { mkdirIfNotExist } from './modules/util/files';
import { FastifyBaseLogger } from 'fastify';

const APP_LOG_FILE_NAME = 'app.log';
const APP_LOG_FILE_PATH = [
  LOG_DIR_PATH,
  APP_LOG_FILE_NAME,
].join(path.sep);

const APP_ERROR_LOG_FILE_NAME = 'app.error.log';
const APP_ERROR_LOG_FILE_PATH = [
  LOG_DIR_PATH,
  APP_ERROR_LOG_FILE_NAME,
].join(path.sep);

const level = (config.APP_ENV === 'DEV')
  ? 'debug'
  : 'info'
;

export const loggerV2 = initLogger();

/*
  see: https://github.com/fastify/fastify/blob/ac462b2b4d859e88d029019869a9cb4b8626e6fd/lib/logger.js
*/
function initLogger() {
  let opts: LoggerOptions;
  // let stream = pino.destination('./logs/app2.log');\
  // console.log({ LOG_DIR_PATH });
  mkdirIfNotExist(LOG_DIR_PATH);
  let streams: pino.StreamEntry[] = [
    // {
    //   stream: pino.destination(APP_LOG_FILE_PATH),
    //   level: 'trace',
    // },
    {
      stream: pino.destination(APP_LOG_FILE_PATH),
    },
    {
      stream: pino.destination(APP_ERROR_LOG_FILE_PATH),
      level: 'error',
    },
    // {
    //   stream: process.stdout,
    //   level: 'debug',
    // },
    // {
    //   stream: process.stderr,
    //   level: 'error',
    // },
  ];
  let stream = pino.multistream(streams);
  console.log({ stream });
  console.log({ level });
  opts = {
    level,
  };
  let logger2: FastifyBaseLogger = pino(opts, stream);
  return logger2;
}
