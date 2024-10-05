
import { Readable } from 'stream';

import { FastifyReply, FastifyRequest } from 'fastify';
import {
  ApiError,
} from '@google-cloud/common';

import { ImageStream } from '../../models/image-stream';
import { getImageTransformStreamV1 } from '../services/image-service-v1';
import { logger } from '../logger';

export async function getImagesV1(
  req: FastifyRequest<{
    Params: {
      image?: string;
      folder?: string;
    },
    Querystring: {
      width?: string;
      height?: string;
    }
  }>,
  res: FastifyReply
) {
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
      return res.send(e.response.statusMessage);
    } else {
      throw e;
    }
  }
  headers = gcpImageStream.headers;
  imageStream = gcpImageStream.stream;

  res.header('content-type', headers['content-type']);
  res.header('Access-Control-Allow-Origin', '*');

  imageStream.on('error', err => {
    console.error(err);
  });

  return res.send(imageStream);
}
