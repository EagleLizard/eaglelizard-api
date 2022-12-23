
import { PassThrough, Readable } from 'stream';

import { ImageCacheV2 } from './image-service-v2/image-cache-v2';
import {
  GetImageTransformStreamOpts,
  ImageStream,
} from '../../models/image-stream';
import { JCD_VERSION_ENUM } from '../jcd-constants';
import { imageTransform } from '../modules/image-transform';
import {
  getGcpImageStream,
} from './gcp-storage-service';
import { logger } from '../logger';
import { config } from '../../config';

const DO_CACHE = config.APP_ENV === 'dev';
// const DO_CACHE = false;

export async function getImageTransformStreamV2(opts: GetImageTransformStreamOpts): Promise<ImageStream> {
  let imageStream: ImageStream;

  if(DO_CACHE) {
    imageStream = await getImageStreamCachedV2(opts);
  } else {
    imageStream = await getImageStreamFromSource(opts);
  }

  return imageStream;
}

async function getImageStreamCachedV2(opts: GetImageTransformStreamOpts): Promise<ImageStream> {
  let imageStream: ImageStream;
  let contentStream: ImageStream;
  let hasInCache: boolean;

  hasInCache = await ImageCacheV2.inCache(opts);

  if(hasInCache) {
    logger.info('Fetching image from cache');
    contentStream = await ImageCacheV2.getCachedImageStream(opts);
  } else {
    logger.info('Fetching image');
    imageStream = await getImageStreamFromSource(opts);
    contentStream = await ImageCacheV2.getImageStreamAndCache(imageStream, opts);
  }

  return contentStream;
}

async function getImageStreamFromSource(opts: GetImageTransformStreamOpts): Promise<ImageStream> {
  let gcpImageStream: ImageStream, transformStream: Readable, imageStream: ImageStream;
  const {
    imageKey,
    folderKey,
    width,
    height,
  } = opts;

  gcpImageStream = await getGcpImageStream({
    imageKey,
    folderKey,
    jcdBucketVersion: JCD_VERSION_ENUM.JCD_V3,
  });
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
