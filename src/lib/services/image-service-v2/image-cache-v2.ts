
import path from 'path';
import { readFile, writeFile } from 'fs/promises';

import { ImageCacheMetaV2 } from './image-cache-meta-v2';
import { GetImageTransformStreamOpts, ImageStream } from '../../../models/image-stream';
import { IMAGE_CACHE_DIR_PATH } from '../../jcd-v3-constants';
import {
  checkFile,
  mkdirIfNotExistRecursiveSync,
} from '../../modules/util/files';
import { PassThrough, Readable } from 'stream';
import { createReadStream, createWriteStream, WriteStream } from 'fs';

(function initImageCacheV3() {
  mkdirIfNotExistRecursiveSync(IMAGE_CACHE_DIR_PATH);
})();

const CACHE_KEY_DELIM = '_';

export type ImageCacheV2Opts = GetImageTransformStreamOpts;

export class ImageCacheV2 {

  static async getCachedImageStream(opts: ImageCacheV2Opts): Promise<ImageStream> {
    let imageStream: ImageStream;
    let cacheMeta: ImageCacheMetaV2, readStream: Readable;
    let cacheFilePath: string;

    cacheFilePath = ImageCacheV2.getCacheFilePath(opts);
    cacheMeta = await ImageCacheV2.readCacheMeta(opts);

    readStream = createReadStream(cacheFilePath);

    imageStream = {
      stream: readStream,
      headers: cacheMeta.headers,
    };

    return imageStream;
  }

  static async getImageStreamAndCache(imageStream: ImageStream, opts: ImageCacheV2Opts): Promise<ImageStream> {
    let cacheFilePath: string;
    let cacheStream: PassThrough;
    let cacheFileStream: WriteStream;

    await ImageCacheV2.writeCacheMeta(imageStream, opts);

    cacheFilePath = ImageCacheV2.getCacheFilePath(opts);

    cacheFileStream = createWriteStream(cacheFilePath);
    cacheStream = new PassThrough();

    cacheStream.pipe(cacheFileStream);
    imageStream.stream.pipe(cacheStream);

    return {
      stream: imageStream.stream,
      headers: imageStream.headers,
    };
  }

  static async readCacheMeta(opts: ImageCacheV2Opts): Promise<ImageCacheMetaV2> {
    let cacheMetaFilePath: string;
    let cacheMeta: ImageCacheMetaV2, cacheMetaFileData: unknown;

    cacheMetaFilePath = ImageCacheV2.getCacheMetaFilePath(opts);
    cacheMetaFileData = JSON.parse((await readFile(cacheMetaFilePath)).toString());
    cacheMeta = ImageCacheMetaV2.deserialize(cacheMetaFileData);
    return cacheMeta;
  }

  static async writeCacheMeta(imageStream: ImageStream, opts: ImageCacheV2Opts) {
    let cacheMetaFilePath: string;
    let cacheMeta: ImageCacheMetaV2, cacheMetaFileData: string;

    cacheMetaFilePath = ImageCacheV2.getCacheMetaFilePath(opts);
    cacheMeta = {
      headers: imageStream.headers,
    };
    cacheMetaFileData = JSON.stringify(cacheMeta, null, 2);
    await writeFile(cacheMetaFilePath, cacheMetaFileData);
  }

  static async inCache(opts: ImageCacheV2Opts) {
    let cacheFilePath: string, cacheMetaFilePath: string;
    let cacheFileExists: boolean, cacheMetaFileExists: boolean;
    let isInCache: boolean;

    cacheFilePath = ImageCacheV2.getCacheFilePath(opts);
    cacheMetaFilePath = ImageCacheV2.getCacheMetaFilePath(opts);

    cacheFileExists = await checkFile(cacheFilePath);
    cacheMetaFileExists = await checkFile(cacheMetaFilePath);

    isInCache = cacheFileExists && cacheMetaFileExists;

    return isInCache;
  }

  static getCacheFilePath(opts: ImageCacheV2Opts): string {
    let cacheKey: string, cacheFilePath: string;
    cacheKey = ImageCacheV2.getCacheKey(opts);
    cacheFilePath = [
      IMAGE_CACHE_DIR_PATH,
      cacheKey,
    ].join(path.sep);
    return cacheFilePath;
  }

  static getCacheMetaFilePath(opts: ImageCacheV2Opts): string {
    let cacheMetaFileName: string, cacheMetaFilePath: string;
    cacheMetaFileName = ImageCacheV2.getCacheMetaFileName(opts);
    cacheMetaFilePath = [
      IMAGE_CACHE_DIR_PATH,
      cacheMetaFileName,
    ].join(path.sep);
    return cacheMetaFilePath;
  }

  static getCacheKey(opts: ImageCacheV2Opts): string {
    let cacheKey: string;
    cacheKey = [
      opts.folderKey ?? '',
      opts.imageKey ?? '',
      opts.width ?? '',
      opts.height ?? '',
    ].join(CACHE_KEY_DELIM);
    return cacheKey;
  }

  static getCacheMetaFileName(opts: ImageCacheV2Opts): string {
    let cacheKey: string, cacheMetaFileName: string;
    cacheKey = ImageCacheV2.getCacheKey(opts);
    cacheMetaFileName = `${cacheKey}.json`;
    return cacheMetaFileName;
  }
}
