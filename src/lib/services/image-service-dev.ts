
import { Readable } from 'stream';
import type { ReadableStream } from 'node:stream/web';

import { GetGcpImageStreamOpts } from './gcp-storage-service';

import { ImageStream } from '../../models/image-stream';
import { isNull } from '../modules/type-validation/validate-primitives';

export class ImageServiceDev {
  static async getImageStream(opts: GetGcpImageStreamOpts): Promise<ImageStream> {
    let imageStream: ImageStream;
    let imageReadStream: Readable;
    let headers: Record<string, string>;
    let imgPath: string;
    let imgUrl: string;
    let resp: Response;
    let contentType: string | null;
    // let uri = `http://127.0.0.1:4445/`;
    if(opts.folderKey === undefined) {
      imgPath = opts.imageKey;
    } else {
      imgPath = `${opts.folderKey}/${opts.imageKey}`;
    }
    imgUrl = `http://127.0.0.1:4445/${imgPath}`;
    resp = await fetch(imgUrl);
    if(isNull(resp.body)) {
      throw new Error('null response body when fetching stream');
    }
    /*
      see: https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/65542#discussioncomment-6071004
    */
    imageReadStream = Readable.fromWeb(resp.body as ReadableStream<Uint8Array>);
    contentType = resp.headers.get('content-type');
    headers = {};
    if(!isNull(contentType)) {
      headers['content-type'] = contentType;
    }
    imageStream = {
      stream: imageReadStream,
      headers,
    };
    return imageStream;
  }
}
