
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
import { JCD_BUCKET_MAP, JCD_VERSION_ENUM } from '../jcd-constants';

let gcpStorage: Storage;

(function initGcpStorage() {
  gcpStorage = new Storage;
})();

export interface GetGcpImageStreamOpts {
  imageKey: string;
  folderKey: string;
  cacheStream?: PassThrough;
  jcdBucketVersion?: JCD_VERSION_ENUM,
}

export async function getGcpImageStream(opts: GetGcpImageStreamOpts): Promise<ImageStream> {
  let jcdBucketKey: string, jcdBucket: Bucket;
  let imageStream: ImageStream, imageReadStream: Readable;
  let bucketFile: string, remoteFile: File, fileMetaResponse: GetFileMetadataResponse,
    fileMetadata: Metadata;
  let headers: Record<string, string>;

  jcdBucketKey = JCD_BUCKET_MAP[opts?.jcdBucketVersion ?? JCD_VERSION_ENUM.JCD_V2];
  jcdBucket = gcpStorage.bucket(jcdBucketKey);

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
