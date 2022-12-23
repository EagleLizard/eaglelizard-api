
import { Readable } from 'stream';

import { Request, Response } from 'express';
import {
  ApiError,
} from '@google-cloud/common';

import { ImageStream } from '../../models/image-stream';
import { getImageTransformStreamV2 } from '../services/image-service-v2';
import { logger } from '../logger';
import { isNumber } from '../modules/type-validation/validate-primitives';

export async function getImagesV2(req: Request, res: Response) {
  let imageKey: string, folderKey: string, widthParam: string, width: number,
    heightParam: string, height: number;
  let gcpImageStream: ImageStream,
    headers: Record<string, string>,
    imageStream: Readable
  ;

  if(req.params.image) {
    imageKey = req.params.image;
    folderKey = `${req.params.folder}`;
  } else {
    imageKey = req.params.folder;
  }

  widthParam = (req.query?.width as string) ?? undefined;
  heightParam = (req.query?.height as string) ?? undefined;

  if(((typeof widthParam) === 'string') && !isNaN(+widthParam)) {
    width = +widthParam;
  }
  if(((typeof heightParam) === 'string') && !isNaN(+heightParam)) {
    height = +heightParam;
  }
  try {
    gcpImageStream = await getImageTransformStreamV2({
      imageKey,
      folderKey,
      width,
      height,
    });
  } catch(e) {
    if(e instanceof ApiError) {
      logger.error(`${e.code} - ${e.message}`);
      res.statusCode = e.response.statusCode;
      res.statusMessage = e.response.statusMessage;
      return res.end();
    } else if(e.code !== undefined) {
      res.statusCode = (isNumber(e.code))
        ? e.code
        : 500
      ;
      res.statusMessage = e.message;
      return res.end();
    } else {
      throw e;
    }
  }
  headers = gcpImageStream.headers;
  imageStream = gcpImageStream.stream;

  const CACHE_CONTROL_MAX_AGE = 60 * 60 * 24;

  res.setHeader('content-type', headers['content-type']);
  res.setHeader('cache-control', `max-age=${CACHE_CONTROL_MAX_AGE}`);
  res.setHeader('Access-Control-Allow-Origin', '*');

  imageStream.on('error', err => {
    console.error(err);
  });

  imageStream.pipe(res);
}
