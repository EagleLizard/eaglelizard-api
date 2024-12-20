
import { Readable } from 'stream';

import {
  GetImageTransformStreamOpts,
  ImageStream,
} from '../../models/image-stream';
import { imageTransform } from '../modules/image-transform';
import {
  getGcpImageStream,
} from './gcp-storage-service';
import { config } from '../../config';
import { ImageServiceDev } from './image-service-dev';

export async function getImageTransformStreamV1(opts: GetImageTransformStreamOpts): Promise<ImageStream> {
  let gcpImageStream: ImageStream, transformStream: Readable, imageStream: ImageStream;
  const {
    imageKey,
    folderKey,
    width,
    height,
  } = opts;
  if(config.APP_ENV === 'dev') {
    gcpImageStream = await ImageServiceDev.getImageStream({
      imageKey,
      folderKey,
      versionFolder: 'img-v3',
    });
  } else {
    gcpImageStream = await getGcpImageStream({
      imageKey,
      folderKey,
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
