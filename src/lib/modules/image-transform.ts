
import sharp from 'sharp';
import { Readable } from 'stream';

const JPEG_MIME_TYPE = 'image/jpeg';

export interface ImageTransformOpts {
  imageStream: Readable;
  contentType: string;
  width: number;
}

export function imageTransform(imageTransformOpts: ImageTransformOpts): Readable {
  let imageStream: Readable, contentType: string, width: number;
  let sharpTransformer: sharp.Sharp;
  ({
    imageStream,
    contentType,
    width,
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

  return imageStream.pipe(sharpTransformer);
}

function isJpeg(contentType: string): boolean {
  return contentType.trim().toLowerCase() === JPEG_MIME_TYPE;
}
