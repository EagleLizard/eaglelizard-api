import path from 'path';

export const BASE_DIR = path.resolve(__dirname, `..${path.sep}..`);

const LOG_DIR_NAME = 'logs';
const LOG_DIR_PATH = [
  BASE_DIR,
  LOG_DIR_NAME,
].join(path.sep);

const MEM_LOG_NAME = 'mem.log';
const MEM_LOG_PATH = [
  LOG_DIR_PATH,
  MEM_LOG_NAME,
].join(path.sep);

export {
  LOG_DIR_PATH,
  MEM_LOG_PATH,
};
