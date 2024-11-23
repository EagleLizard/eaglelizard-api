
import { isString } from '../lib/modules/type-validation/validate-primitives';

const ImgSzs = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
] as const;
export type ImgSz = typeof ImgSzs[number];
export const DEFAULT_IMG_SZ: ImgSz = 'lg';

export function validateImgSz(val: unknown): val is ImgSz {
  if(!isString(val)) {
    return false;
  }
  return ImgSzs.includes(val as ImgSz);
}

/*
  Map old v3 requests to new ImgSz vals
*/
export function imgSzFromDimensions(opts: {
  width?: number;
  height?: number;
}): ImgSz {
  if((opts.width === undefined) && (opts.height === undefined)) {
    return DEFAULT_IMG_SZ;
  }
  let dimension = Math.max(opts.width ?? 0, opts.height ?? 0);
  if(dimension > 1920) {
    return 'xl';
  }
  if(dimension > 1366) {
    return 'lg';
  }
  if(dimension > 854) {
    return 'md';
  }
  if(dimension > 666) {
    return 'sm';
  }
  return 'xs';
}
