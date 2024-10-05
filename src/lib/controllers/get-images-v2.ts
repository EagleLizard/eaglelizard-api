
import { Readable } from 'stream';

import { FastifyReply, FastifyRequest } from 'fastify';
import {
  ApiError,
} from '@google-cloud/common';

import { ImageStream } from '../../models/image-stream';
import { getImageTransformStreamV2 } from '../services/image-service-v2';
import { logger } from '../logger';
import { isNumber } from '../modules/type-validation/validate-primitives';

export async function getImagesV2(
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
      return res.send(e.response.statusMessage);
    } else if(e.code !== undefined) {
      res.statusCode = (isNumber(e.code))
        ? e.code
        : 500
      ;
      return res.send(e.message);
    } else {
      throw e;
    }
  }
  headers = gcpImageStream.headers;
  imageStream = gcpImageStream.stream;

  const CACHE_CONTROL_MAX_AGE = 60 * 60 * 24;

  res.header('content-type', headers['content-type']);
  res.header('cache-control', `max-age=${CACHE_CONTROL_MAX_AGE}`);
  res.header('Access-Control-Allow-Origin', '*');

  imageStream.on('error', err => {
    console.error(err);
  });

  return res.send(imageStream);
  // await sleepStream(imageStream, 500);
}

async function sleepStream(rs: Readable, ms = 150) {
  let delayMs: number;
  rs.pause();
  delayMs = Math.round(ms - (ms * Math.random()));
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      rs.resume();
      resolve();
    }, delayMs);
  });
}
