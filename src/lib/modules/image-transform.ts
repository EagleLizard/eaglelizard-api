
import sharp, { ResizeOptions } from 'sharp';
import { PassThrough, Readable } from 'stream';

const JPEG_MIME_TYPE = 'image/jpeg';

sharp.cache(false);
sharp.concurrency(1);

export type ImageTransformOpts = {
  imageStream: Readable;
  contentType: string;
  width: number;
  height: number;
  cacheStream?: PassThrough;
};

export function imageTransform(imageTransformOpts: ImageTransformOpts): Readable {
  let imageStream: Readable, contentType: string, width: number, height: number,
    cacheStream: PassThrough;
  let sharpTransformer: sharp.Sharp, resizeOpts: ResizeOptions;
  ({
    imageStream,
    contentType,
    width,
    height,
    cacheStream,
  } = imageTransformOpts);
  resizeOpts = {
    withoutEnlargement: true,
    fit: sharp.fit.inside,
  };
  if(width !== undefined) {
    resizeOpts.width = width;
  }
  if(height !== undefined) {
    resizeOpts.height = height;
  }
  sharpTransformer = sharp()
    .rotate()
    .resize(resizeOpts)
  ;

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
