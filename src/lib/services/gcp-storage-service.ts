
import {
  Bucket,
  File,
  Storage,
  GetFileMetadataResponse,
} from '@google-cloud/storage';
import {
  Metadata,
} from '@google-cloud/common';
import { PassThrough, Readable } from 'stream';

import { config } from '../../config';
import { ImageStream } from '../../models/image-stream';

let gcpStorage: Storage;

(function initGcpStorage() {
  gcpStorage = new Storage;
})();

export interface GetGcpImageStreamOpts {
  imageKey: string;
  folderKey: string;
  cacheStream?: PassThrough;
}

export async function getGcpImageStream(opts: GetGcpImageStreamOpts): Promise<ImageStream> {
  let jcdBucket: Bucket;
  let imageStream: ImageStream, imageReadStream: Readable;
  let bucketFile: string, remoteFile: File, fileMetaResponse: GetFileMetadataResponse,
    fileMetadata: Metadata;
  let headers: Record<string, string>;

  jcdBucket = gcpStorage.bucket(config.JCD_GCP_BUCKET);

  if(opts.folderKey === undefined) {
    bucketFile = opts.imageKey;
  } else {
    bucketFile = `${opts.folderKey}/${opts.imageKey}`;
  }
  remoteFile = jcdBucket.file(bucketFile);
  fileMetaResponse = await remoteFile.getMetadata();
  [
    fileMetadata,
  ] = fileMetaResponse;

  headers = {
    'content-type': fileMetadata.contentType,
    'content-length': fileMetadata.size,
  };

  imageReadStream = remoteFile.createReadStream();

  imageStream = {
    headers,
    stream: imageReadStream,
  };

  return imageStream;
}
