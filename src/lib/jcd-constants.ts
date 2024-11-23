
import { config } from '../config';

export enum JCD_VERSION_ENUM {
  JCD_V2 = 'JCD_V2',
  JCD_V3 = 'JCD_V3',
  JCD_V4 = 'JCD_V4',
}

export const JCD_BUCKET_MAP: Record<JCD_VERSION_ENUM, string> = {
  [JCD_VERSION_ENUM.JCD_V2]: config.JCD_GCP_BUCKET,
  [JCD_VERSION_ENUM.JCD_V3]: config.JCD_V3_GCP_BUCKET,
  [JCD_VERSION_ENUM.JCD_V4]: config.JCD_V4_GCP_BUCKET,
};
