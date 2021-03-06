
import { Readable } from 'stream';

import { Request, Response } from 'express';
import {
  ApiError,
} from '@google-cloud/common';

import { ImageStream } from '../../models/image-stream';
import { getImageTransformStreamV1 } from '../services/image-service-v1';
import { logger } from '../logger';

export async function getImagesV1(req: Request, res: Response) {
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
    gcpImageStream = await getImageTransformStreamV1({
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
    } else {
      throw e;
    }
  }
  headers = gcpImageStream.headers;
  imageStream = gcpImageStream.stream;

  res.setHeader('content-type', headers['content-type']);
  res.setHeader('Access-Control-Allow-Origin', '*');

  imageStream.on('error', err => {
    console.error(err);
  });

  imageStream.pipe(res);
}
