
import { PassThrough, Readable } from 'stream';

import {
  GetImageTransformStreamOpts,
  ImageStream,
} from '../../models/image-stream';
import { imageTransform } from '../modules/image-transform';
import {
  getGcpImageStream,
} from './gcp-storage-service';

export async function getImageTransformStreamV1(opts: GetImageTransformStreamOpts): Promise<ImageStream> {
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
  });

  // cacheImage(gcpImageStream);

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

function cacheImage(imageStream: ImageStream) {
  let cacheStream: PassThrough;
  let dataChunks: Buffer[];
  dataChunks = [];
  cacheStream = new PassThrough();
  cacheStream.setEncoding('binary');
  cacheStream.on('data', (chunk) => {
    dataChunks.push(chunk);
  });
  imageStream.stream.pipe(cacheStream);
}
