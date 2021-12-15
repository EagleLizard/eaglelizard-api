
import * as AWS from 'aws-sdk';
import { Readable } from 'stream';

import {
  getS3Secret,
  AwsS3Secret,
} from './gcp-auth-service';

export interface S3ImageStream {
  headers: Record<string, string>;
  s3Stream: Readable;
}

export async function getImageTransformStream(imageKey: string, folderKey: string, width?: number): Promise<S3ImageStream> {
  let imageStream: S3ImageStream;
  imageStream = await getImageStream(imageKey, folderKey, width);
  return imageStream;
}

async function getImageStream(imageKey: string, folderKey: string, width: number): Promise<S3ImageStream> {
  let s3: AWS.S3, s3Request: AWS.Request<AWS.S3.GetObjectOutput, AWS.AWSError>;
  let s3ImageStream: S3ImageStream;

  /*
    TODO: Implement width transform with sharp
  */
  console.log(`width: ${width}`);

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
        s3Stream,
      };
      resolve(s3ImageStream);
    });

    s3Stream = s3Request.createReadStream();
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
