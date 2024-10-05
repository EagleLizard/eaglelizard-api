
import { Readable } from 'stream';

import { getImageTransformStream } from '../services/image-service-v0';
import { ImageStream } from '../../models/image-stream';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function getImagesV0(
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
  let s3ImageStream: ImageStream,
    headers: Record<string, string>,
    imageStream: Readable
  ;
  if(req.params.image) {
    imageKey = req.params.image;
    folderKey = `/${req.params.folder}`;
  } else {
    imageKey = req.params.folder;
    folderKey = '';
  }

  widthParam = (req.query?.width as string) ?? undefined;
  heightParam = (req.query?.height as string) ?? undefined;

  if(((typeof widthParam) === 'string') && !isNaN(+widthParam)) {
    width = +widthParam;
  }
  if(((typeof heightParam) === 'string') && !isNaN(+heightParam)) {
    height = +heightParam;
  }

  s3ImageStream = await getImageTransformStream({
    imageKey,
    folderKey,
    width,
    height,
  });
  headers = s3ImageStream.headers;
  imageStream = s3ImageStream.stream;

  res.header('content-type', headers['content-type']);
  res.header('Access-Control-Allow-Origin', '*');
  return res.send(imageStream);
}
