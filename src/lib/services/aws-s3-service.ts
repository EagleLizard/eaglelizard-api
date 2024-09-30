
import { PassThrough, Readable } from 'stream';

import { GetObjectCommand, S3Client, GetObjectCommandOutput } from '@aws-sdk/client-s3';

import {
  getS3Secret,
  AwsS3Secret,
} from './gcp-auth-service';
import { awsSdkLogStream, awsSdkLogger } from '../logger';
import { ImageStream } from '../../models/image-stream';

// AWS.config.logger = awsSdkLogStream;

export interface GetS3ImageStreamOpts {
  imageKey: string;
  folderKey: string;
  cacheStream?: PassThrough;
}

export async function getS3ImageStream(opts: GetS3ImageStreamOpts): Promise<ImageStream> {
  let s3: S3Client;
  // let s3Request: S3Client.Request<AWS.S3.GetObjectOutput, AWS.AWSError>;
  let s3Request: GetObjectCommandOutput;
  let s3ImageStream: ImageStream;
  let imageKey: string, folderKey: string, cacheStream: PassThrough;
  let headers: Record<string, string>;
  let s3Stream: Readable;
  ({
    imageKey,
    folderKey,
    cacheStream,
  } = opts);

  s3 = await getAwsS3();
  s3Request = await s3.send(new GetObjectCommand({
    Bucket: 'elasticbeanstalk-us-west-1-297608881144' + folderKey,
    Key: imageKey,
  }));
  headers = {};
  if(s3Request.ContentType !== undefined) {
    headers['content-type'] = s3Request.ContentType;
  }
  if(s3Request.ContentLength !== undefined) {
    headers['content-length'] = `${s3Request.ContentLength}`;
  }
  s3Stream = s3Request.Body as Readable;
  if(cacheStream !== undefined) {
    s3Stream.pipe(cacheStream);
  }
  s3ImageStream = {
    headers,
    stream: s3Stream,
  };
  return s3ImageStream;
}

async function getAwsS3(): Promise<S3Client> {
  delete process.env.AWS_SECRET_ACCESS_KEY;
  let awsS3Secret: AwsS3Secret
  let s3: S3Client;
  awsS3Secret = await getS3Secret();
  s3 = new S3Client({
    region: 'us-west-1',
    // logger: awsSdkLogStream,
    logger: awsSdkLogger,
    credentials: {
      accessKeyId: awsS3Secret.id,
      secretAccessKey: awsS3Secret.secret,
    },
  });
  return s3;
}
