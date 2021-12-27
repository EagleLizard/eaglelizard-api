
import { PassThrough, Readable } from 'stream';

import {
  getS3ImageStream,
  ImageStream,
} from './aws-s3-service';
import {
  imageTransform,
} from '../modules/image-transform';
import { MemCache } from '../modules/mem-cache/mem-cache';
import { CacheFile } from '../modules/mem-cache/cache-file';

export const MEM_CACHE = new MemCache;

export async function getImageTransformStream(imageKey: string, folderKey: string, width?: number): Promise<ImageStream> {
  let imageStream: ImageStream;

  if(width !== undefined) {
    imageStream = await getResizeImageStream(imageKey, folderKey, width);
  } else {
    imageStream = await getImageStream(imageKey, folderKey);
  }
  return {
    stream: imageStream.stream,
    headers: imageStream.headers,
  };
}

async function getResizeImageStream(imageKey: string, folderKey: string, width: number): Promise<ImageStream> {
  let contentStream: Readable, headers: Record<string, string>;
  let imageStream: ImageStream;

  imageStream = await getImageStream(imageKey, folderKey);
  headers = imageStream.headers;

  contentStream = imageTransform({
    imageStream: imageStream.stream,
    contentType: headers['content-type'],
    width,
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
function getResizeImageStreamCached(imageKey: string, folderKey: string, width: number, imageStream: ImageStream): ImageStream {
  let cacheImageStream: ImageStream, contentStream: Readable, headers: Record<string, string>;
  let cacheStream: PassThrough, imageDataChunks: string[], imageData: string;
  let hasInCache: boolean;

  hasInCache = false;

  if(hasInCache) {
    cacheImageStream = getCacheStream(imageKey, folderKey, width);
    contentStream = cacheImageStream.stream;
    headers = cacheImageStream.headers;
  } else {
    headers = imageStream.headers;

    cacheStream = new PassThrough;
    cacheStream.setEncoding('binary');
    imageDataChunks = [];

    cacheStream.on('data', (chunk) => {
      imageDataChunks.push(chunk);
    });
    cacheStream.on('end', () => {
      imageData = imageDataChunks.join('');
      MEM_CACHE.set(imageData, headers['content-type'], imageKey, folderKey, width);
    });

    contentStream = imageTransform({
      imageStream: imageStream.stream,
      contentType: headers['content-type'],
      width,
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

function getCacheStream(imageKey: string, folderKey: string, width?: number): ImageStream {
  let cacheFile: CacheFile, contentType: string, contentStream: Readable;
  let imageStream: ImageStream, headers: Record<string, string>;

  cacheFile = MEM_CACHE.get(imageKey, folderKey, width);
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
