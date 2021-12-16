
import { CacheFile } from './cache-file';

export class MemCache {
  cacheMap: Map<string, CacheFile>;
  constructor() {
    this.cacheMap = new Map;
  }

  get(imageKey: string, folderKey: string, width?: number) {
    let cacheKey: string;
    cacheKey = this.getKey(imageKey, folderKey, width);
    return this.cacheMap.get(cacheKey);
  }

  set(imageData: string, contentType: string, fileHash: string, imageKey: string, folderKey: string, width?: number) {
    let cacheKey: string;
    cacheKey = this.getKey(imageKey, folderKey, width);
    if(!this.cacheMap.has(cacheKey)) {
      this.cacheMap.set(cacheKey, new CacheFile(imageData, contentType, fileHash));
    }
  }

  has(imageKey: string, folderKey: string, width?: number) {
    let cacheKey: string;
    cacheKey = this.getKey(imageKey, folderKey, width);
    return this.cacheMap.has(cacheKey);
  }

  cacheSize(): number {
    let cacheFiles: CacheFile[];
    cacheFiles = [ ...this.cacheMap.values() ];
    return cacheFiles.reduce((acc, curr) => {
      return acc + curr.data.length;
    }, 0);
  }

  private getKey(imageKey: string, folderKey: string, width?: number) {
    return `${imageKey}_${folderKey}_${width}`;
  }
}
