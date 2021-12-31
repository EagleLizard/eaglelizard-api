import { Readable } from 'stream';

export interface ImageStream {
  headers: Record<string, string>;
  stream: Readable;
}

export interface GetImageTransformStreamOpts {
  imageKey: string;
  folderKey: string;
  width?: number;
  height?: number;
}

