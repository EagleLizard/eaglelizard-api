
import { PassThrough, Readable } from 'stream';

import {
  getS3ImageStream,
  ImageStream,
} from './aws-s3-service';
import {
  imageTransform,
} from '../modules/image-transform';
import { MemCache } from '../modules/mem-cache/mem-cache';
import { getHasher, Hasher } from '../modules/hasher';
import { CacheFile } from '../modules/mem-cache/cache-file';

export const MEM_CACHE = new MemCache;

export async function getImageTransformStream(imageKey: string, folderKey: string, width?: number): Promise<ImageStream> {
  let imageStream: ImageStream, contentStream: Readable, headers: Record<string, string>;

  imageStream = await getImageStream(imageKey, folderKey);
  contentStream = imageStream.stream;
  headers = imageStream.headers;
  if(width !== undefined) {
    contentStream = imageTransform({
      imageStream: imageStream.stream,
      contentType: headers['content-type'],
      width,
    });
  }
  return {
    stream: contentStream,
    headers,
  };
}

async function getImageStream(imageKey: string, folderKey: string, width?: number): Promise<ImageStream> {
  let hasInCache: boolean;
  let imageStream: ImageStream;
  hasInCache = MEM_CACHE.has(imageKey, folderKey, width);
  imageStream = hasInCache
    ? getCacheStream(imageKey, folderKey, width)
    : await getS3ImageStreamAndCache(imageKey, folderKey, width)
  ;
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
  let cacheStream: PassThrough, imageDataChunks: string[], hasher: Hasher,
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
  hasher = getHasher();

  cacheStream.on('data', (chunk) => {
    hasher.update(chunk);
    imageDataChunks.push(chunk);
  });

  cacheStream.on('end', () => {
    imageData = imageDataChunks.join('');

    if(!MEM_CACHE.has(imageKey, folderKey, width)) {
      MEM_CACHE.set(imageData, headers['content-type'], hasher.digest(), imageKey, folderKey);
    }
  });
  return imageStream;
}
