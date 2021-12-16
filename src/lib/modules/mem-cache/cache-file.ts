
export class CacheFile {
  data: string;
  contentType: string;
  fileHash: string;
  constructor(data: string, contentType: string, fileHash: string) {
    this.data = data;
    this.contentType = contentType;
    this.fileHash = fileHash;
  }
}
