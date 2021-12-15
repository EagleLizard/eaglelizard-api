
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { google } from '@google-cloud/secret-manager/build/protos/protos';

import { config } from '../../config';

const secretManagerClient = new SecretManagerServiceClient;

const S3_SECRET_LABEL_KEY = 'aws_s3';
const S3_SECRET_LABEL_VALUE = 'eaglelizard_files';

export interface AwsS3Secret {
  id: string;
  secret: string;
}

export async function getS3Secret(): Promise<AwsS3Secret> {
  let accessKeyId: string, secretValue: string, awsS3Secret: AwsS3Secret;
  accessKeyId = config.aws_access_key_id;

  secretValue = await getS3SecretValue();
  awsS3Secret = {
    id: accessKeyId,
    secret: secretValue,
  };
  return awsS3Secret;
}

async function getS3SecretValue(): Promise<string> {
  let foundSecret: google.cloud.secretmanager.v1.ISecret;
  let latestVersionResp: google.cloud.secretmanager.v1.IAccessSecretVersionResponse;
  let secretValue: string;
  const [ secrets ] = await secretManagerClient.listSecrets({
    parent: `projects/${config.GCP_PROJECT_ID}`,
  });
  if(secrets.length < 1) {
    throw new Error(`No secrets found for parent project: ${config.GCP_PROJECT_ID}`);
  }
  foundSecret = secrets.find(secret => {
    return secret.labels?.[S3_SECRET_LABEL_KEY] === S3_SECRET_LABEL_VALUE;
  });
  if(!foundSecret) {
    throw new Error(`Could not find secret: key: ${S3_SECRET_LABEL_KEY}, label: ${S3_SECRET_LABEL_VALUE}`);
  }
  [ latestVersionResp ] = await secretManagerClient.accessSecretVersion({
    name: `${foundSecret.name}/versions/latest`
  });
  secretValue = latestVersionResp.payload.data.toString();
  return secretValue;
}
