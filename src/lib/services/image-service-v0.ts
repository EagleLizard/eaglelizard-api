
import { PassThrough, Readable } from 'stream';

import {
  getS3ImageStream,
} from './aws-s3-service';
import { ImageStream } from '../../models/image-stream';
import {
  imageTransform,
} from '../modules/image-transform';
import { MemCache } from '../modules/mem-cache/mem-cache';
import { CacheFile } from '../modules/mem-cache/cache-file';
import { GetImageTransformStreamOpts } from '../../models/image-stream';

export const MEM_CACHE = new MemCache;

export async function getImageTransformStream(opts: GetImageTransformStreamOpts): Promise<ImageStream> {
  let imageStream: ImageStream;
  const {
    imageKey,
    folderKey,
    width,
    height,
  } = opts;

  if(
    (width !== undefined)
    || (height !== undefined)
  ) {
    imageStream = await getResizeImageStream(opts);
  } else {
    imageStream = await getImageStream(imageKey, folderKey);
  }
  return {
    stream: imageStream.stream,
    headers: imageStream.headers,
  };
}

async function getResizeImageStream(opts: GetImageTransformStreamOpts): Promise<ImageStream> {
  let contentStream: Readable, headers: Record<string, string>;
  let imageStream: ImageStream;
  const {
    imageKey,
    folderKey,
    width,
    height,
  } = opts;

  imageStream = await getImageStream(imageKey, folderKey);
  headers = imageStream.headers;

  contentStream = imageTransform({
    imageStream: imageStream.stream,
    contentType: headers['content-type'],
    width,
    height,
  });
  return {
    stream: contentStream,
    headers,
  };
}

/*
  Probably will deprecate any thumbnail caching,
    it is not very effective and takes up space.
*/
async function getResizeImageStreamCached(opts: GetImageTransformStreamOpts): Promise<ImageStream> {
  let imageStream: ImageStream;
  let cacheImageStream: ImageStream, contentStream: Readable, headers: Record<string, string>;
  let cacheStream: PassThrough, imageDataChunks: string[], imageData: string;
  let hasInCache: boolean;
  const {
    imageKey,
    folderKey,
    width,
    height,
  } = opts;

  hasInCache = MEM_CACHE.has(imageKey, folderKey, width, height);

  if(hasInCache) {
    cacheImageStream = getCacheStream(imageKey, folderKey, width, height);
    contentStream = cacheImageStream.stream;
    headers = cacheImageStream.headers;
  } else {
    imageStream = await getImageStream(imageKey, folderKey);
    headers = imageStream.headers;

    cacheStream = new PassThrough;
    cacheStream.setEncoding('binary');
    imageDataChunks = [];

    cacheStream.on('data', (chunk) => {
      imageDataChunks.push(chunk);
    });
    cacheStream.on('end', () => {
      imageData = imageDataChunks.join('');
      MEM_CACHE.set(imageData, headers['content-type'], imageKey, folderKey, width, height);
    });

    contentStream = imageTransform({
      imageStream: imageStream.stream,
      contentType: headers['content-type'],
      width,
      height,
      cacheStream,
    });
  }
  return {
    stream: contentStream,
    headers,
  };
}

async function getImageStream(imageKey: string, folderKey: string, width?: number): Promise<ImageStream> {
  let hasInCache: boolean, imageStream: ImageStream;

  hasInCache = MEM_CACHE.has(imageKey, folderKey, width);
  console.log(`hasInCache ${MemCache.getKey(imageKey, folderKey, width)}: ${hasInCache}`);

  if(hasInCache) {
    imageStream = getCacheStream(imageKey, folderKey, width);
  } else {
    imageStream = await getS3ImageStreamAndCache(imageKey, folderKey, width);
  }

  return imageStream;
}

function getCacheStream(imageKey: string, folderKey: string, width?: number, height?: number): ImageStream {
  let cacheFile: CacheFile, contentType: string, contentStream: Readable;
  let imageStream: ImageStream, headers: Record<string, string>;

  cacheFile = MEM_CACHE.get(imageKey, folderKey, width, height);
  contentType = cacheFile.contentType;
  contentStream = new Readable;
  contentStream.push(Buffer.from(cacheFile.data, 'binary'));
  contentStream.push(null);
  headers = {
    'content-type': contentType,
  };
  imageStream = {
    headers,
    stream: contentStream,
  };
  return imageStream;
}

async function getS3ImageStreamAndCache(imageKey: string, folderKey: string, width?: number): Promise<ImageStream> {
  let imageStream: ImageStream, headers: Record<string, string>;
  let cacheStream: PassThrough, imageDataChunks: string[],
    imageData: string;

  cacheStream = new PassThrough();
  cacheStream.setEncoding('binary');

  imageStream = await getS3ImageStream({
    imageKey,
    folderKey,
    cacheStream,
  });
  headers = imageStream.headers;

  imageDataChunks = [];

  cacheStream.on('data', (chunk) => {
    imageDataChunks.push(chunk);
  });

  cacheStream.on('end', () => {
    imageData = imageDataChunks.join('');
    if(!MEM_CACHE.has(imageKey, folderKey, width)) {
      MEM_CACHE.set(imageData, headers['content-type'], imageKey, folderKey);
    }
  });
  return imageStream;
}
