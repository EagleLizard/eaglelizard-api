
import { Request, Response } from 'express';
import { Readable } from 'stream';

import { getImageTransformStream, S3ImageStream } from '../services/image-service-v0';

export async function getImagesV0(req: Request, res: Response) {
  let imageKey: string, folderKey: string, widthParam: string, width: number;
  let s3ImageStream: S3ImageStream,
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
  if(((typeof widthParam) === 'string') && !isNaN(+widthParam)) {
    width = +widthParam;
  }

  s3ImageStream = await getImageTransformStream(imageKey, folderKey, width);
  headers = s3ImageStream.headers;
  imageStream = s3ImageStream.s3Stream;

  res.setHeader('content-type', headers['content-type']);
  res.setHeader('content-length', headers['content-length']);
  res.setHeader('Access-Control-Allow-Origin', '*');
  imageStream.pipe(res);
}
