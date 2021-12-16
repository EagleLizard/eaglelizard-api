
import sharp from 'sharp';
import { PassThrough, Readable } from 'stream';

const JPEG_MIME_TYPE = 'image/jpeg';

export interface ImageTransformOpts {
  imageStream: Readable;
  contentType: string;
  width: number;
  cacheStream?: PassThrough;
}

export function imageTransform(imageTransformOpts: ImageTransformOpts): Readable {
  let imageStream: Readable, contentType: string, width: number,
    cacheStream: PassThrough;
  let sharpTransformer: sharp.Sharp;
  ({
    imageStream,
    contentType,
    width,
    cacheStream,
  } = imageTransformOpts);

  sharpTransformer = sharp().resize({
    width,
    withoutEnlargement: true,
    fit: sharp.fit.inside,
  });

  if(isJpeg(contentType)) {
    sharpTransformer.jpeg({
      quality: 100,
    });
  }
  if(cacheStream !== undefined) {
    sharpTransformer.pipe(cacheStream);
  }
  return imageStream.pipe(sharpTransformer);
}

function isJpeg(contentType: string): boolean {
  return contentType.trim().toLowerCase() === JPEG_MIME_TYPE;
}
