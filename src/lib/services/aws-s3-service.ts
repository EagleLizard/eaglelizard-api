
import { PassThrough, Readable } from 'stream';

import * as AWS from 'aws-sdk';

import {
  getS3Secret,
  AwsS3Secret,
} from './gcp-auth-service';

export interface GetS3ImageStreamOpts {
  imageKey: string;
  folderKey: string;
  cacheStream?: PassThrough;
}

export interface ImageStream {
  headers: Record<string, string>;
  stream: Readable;
}

export async function getS3ImageStream(opts: GetS3ImageStreamOpts): Promise<ImageStream> {
  let s3: AWS.S3, s3Request: AWS.Request<AWS.S3.GetObjectOutput, AWS.AWSError>;
  let s3ImageStream: ImageStream;
  let imageKey: string, folderKey: string, cacheStream: PassThrough;
  ({
    imageKey,
    folderKey,
    cacheStream,
  } = opts);

  s3 = await getAwsS3();
  return new Promise((resolve, reject) => {
    let s3Stream: Readable;
    console.log(`${folderKey}/${imageKey}`);
    s3Request = s3.getObject({
      Bucket: 'elasticbeanstalk-us-west-1-297608881144' + folderKey,
      Key: imageKey
    });

    s3Request.on('httpHeaders', (status, headers) => {
      s3ImageStream = {
        headers,
        stream: s3Stream,
      };
      resolve(s3ImageStream);
    });

    s3Stream = s3Request.createReadStream();
    if(cacheStream !== undefined) {
      s3Stream.pipe(cacheStream);
    }
  });
}

async function getAwsS3(): Promise<AWS.S3> {
  let awsS3Secret: AwsS3Secret, s3: AWS.S3;
  awsS3Secret = await getS3Secret();
  s3 = new AWS.S3({
    region: 'us-west-1',
    accessKeyId: awsS3Secret.id,
    secretAccessKey: awsS3Secret.secret,
  });
  return s3;
}

