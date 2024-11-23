
import { Readable } from 'stream';
import type { ReadableStream } from 'node:stream/web';
import http from 'http';

import { GetGcpImageStreamOpts } from './gcp-storage-service';

import { ImageStream } from '../../models/image-stream';
import { isNull } from '../modules/type-validation/validate-primitives';
import { config } from '../../config';

export type ImageStreamDevOpts = GetGcpImageStreamOpts & {
  versionFolder: 'img-v0' | 'img-v3' | 'img-v4';
};

export class ImageServiceDev {
  static async getImageStream(opts: ImageStreamDevOpts): Promise<ImageStream> {
    let imageStream: ImageStream;
    let imageReadStream: Readable;
    let headers: Record<string, string>;
    let imgPath: string;
    let imgUrl: string;
    // let resp: nodeFetch.Response;
    let resp: Response;
    let contentType: string | null;
    // let uri = `http://127.0.0.1:4445/`;
    if(opts.folderKey === undefined) {
      imgPath = opts.imageKey;
    } else {
      imgPath = `${opts.folderKey}/${opts.imageKey}`;
    }
    imgUrl = `http://127.0.0.1:${config.SFS_PORT}/${opts.versionFolder}/${imgPath}`;
    console.log(imgUrl);
    // resp = await nodeFetch(imgUrl);
    resp = await fetch(imgUrl);
    if(isNull(resp.body)) {
      throw new Error('null response body when fetching stream');
    }
    /*
      see: https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/65542#discussioncomment-6071004
    */
    imageReadStream = Readable.fromWeb(resp.body as ReadableStream<Uint8Array>);
    // imageReadStream = Readable.from(resp.body);
    contentType = resp.headers.get('content-type');
    headers = {};
    if(!isNull(contentType)) {
      headers['content-type'] = contentType;
    }
    // if(!isNull(resp.headers.get('content-length'))) {
    //   headers['content-type'] = resp.headers.get('content-length');
    // }
    imageStream = {
      stream: imageReadStream,
      headers,
    };
    return imageStream;
  }
}

type FetchImageRes = {
  headers: http.IncomingHttpHeaders;
  stream: Readable;
};

function fetchImage(imgUrl: string): Promise<FetchImageRes> {
  return new Promise<FetchImageRes>((resolve, reject) => {
    let clientReq: http.ClientRequest;
    clientReq = http.request(imgUrl, (res) => {
      resolve({
        stream: res,
        headers: res.headers,
      });
    });
    clientReq.once('error', (err) => {
      reject(err);
    });
  });
}
