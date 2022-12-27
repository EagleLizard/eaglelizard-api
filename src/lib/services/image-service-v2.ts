
import { PassThrough, Readable } from 'stream';

import { ImageCacheV2 } from './image-service-v2/image-cache-v2';
import {
  GetImageTransformStreamOpts,
  ImageStream,
} from '../../models/image-stream';
import { JCD_VERSION_ENUM } from '../jcd-constants';
import { imageTransform } from '../modules/image-transform';
import {
  getGcpImageStream, GetGcpImageStreamOpts,
} from './gcp-storage-service';
import { logger } from '../logger';
import { config } from '../../config';

const DO_CACHE = config.APP_ENV === 'dev';
// const DO_CACHE = false;

export async function getImageTransformStreamV2(opts: GetImageTransformStreamOpts): Promise<ImageStream> {
  let imageStream: ImageStream;

  imageStream = await getImageStreamFromSource(opts);

  return imageStream;
}

async function getImageStreamFromSource(opts: GetImageTransformStreamOpts): Promise<ImageStream> {
  let gcpImageStream: ImageStream, transformStream: Readable, imageStream: ImageStream;
  const {
    imageKey,
    folderKey,
    width,
    height,
  } = opts;

  if(DO_CACHE) {
    gcpImageStream = await getGcpImageStreamCached({
      folderKey,
      imageKey,
      jcdBucketVersion: JCD_VERSION_ENUM.JCD_V3,
    });
  } else {
    gcpImageStream = await getGcpImageStream({
      imageKey,
      folderKey,
      jcdBucketVersion: JCD_VERSION_ENUM.JCD_V3,
    });
  }
  transformStream = await imageTransform({
    imageStream: gcpImageStream.stream,
    contentType: gcpImageStream.headers['content-type'],
    width,
    height,
  });
  imageStream = {
    headers: gcpImageStream.headers,
    stream: transformStream,
  };
  return imageStream;
}

async function getGcpImageStreamCached(opts: GetGcpImageStreamOpts): Promise<ImageStream> {
  let gcpImageStream: ImageStream, contentStream: ImageStream;
  let hasInCache: boolean, cacheOpts: GetImageTransformStreamOpts;
  cacheOpts = {
    folderKey: opts.folderKey,
    imageKey: opts.imageKey,
  };
  hasInCache = await ImageCacheV2.inCache(cacheOpts);
  if(hasInCache) {
    logger.info('Fetching from cache');
    contentStream = await ImageCacheV2.getCachedImageStream(cacheOpts);
  } else {
    logger.info('Fetching image');
    gcpImageStream = await getGcpImageStream(opts);
    contentStream = await ImageCacheV2.getImageStreamAndCache(gcpImageStream, cacheOpts);
  }
  return contentStream;
}
