
import path from 'path';

export const JCD_V3_DB_PROJECT_KEY_KIND = 'JcdProjectKeyV3';
export const JCD_V3_DB_PROJECT_ORDER_KIND = 'JcdProjectOrderV3';
export const JCD_V3_DB_IMAGE_KIND = 'JcdImageV3';
export const JCD_V3_DB_PROJECT_KIND = 'JcdProjectV3';

export const BASE_DIR = path.resolve(__dirname, '../..');
export const IMAGE_CACHE_DIR_NAME = 'image_cache';
export const IMAGE_CACHE_DIR_PATH = [
  BASE_DIR,
  IMAGE_CACHE_DIR_NAME,
].join(path.sep);
