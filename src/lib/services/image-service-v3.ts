
import path from 'path';

import { ImageStream } from '../../models/image-stream';
import { DEFAULT_IMG_SZ, ImgSz, imgSzFromDimensions, validateImgSz } from '../../models/img-sz';
import { config } from '../../config';
import { ImageServiceDev } from '../services/image-service-dev';
import { getGcpImageStream } from './gcp-storage-service';
import { JCD_VERSION_ENUM } from '../jcd-constants';

export type GetImageOpts = {} & {
  imagePath: string;
  sz?: string;
  width?: number;
  height?: number;
};

const DEV_STREAM = config.APP_ENV === 'dev';

export const ImageServiceV3 = {
  getImage,
} as const;

async function getImage(opts: GetImageOpts): Promise<ImageStream> {
  let imagePath: string;
  let imageStreamRes: ImageStream;
  let sz: ImgSz;

  if(validateImgSz(opts.sz)) {
    sz = opts.sz;
  } else if((opts.width !== undefined) || (opts.height !== undefined)) {
    sz = imgSzFromDimensions({
      width: opts.width,
      height: opts.height,
    });
  } else {
    sz = DEFAULT_IMG_SZ;
  }
  imagePath = [ sz, opts.imagePath ].join(path.sep);
  if(DEV_STREAM) {
    imageStreamRes = await ImageServiceDev.getImageStream({
      imageKey: imagePath,
      versionFolder: 'img-v4',
    });
  } else {
    imageStreamRes = await getGcpImageStream({
      imageKey: `jcd-img-v4/${imagePath}`,
      jcdBucketVersion: JCD_VERSION_ENUM.JCD_V4,
    });
  }
  return imageStreamRes;
}
