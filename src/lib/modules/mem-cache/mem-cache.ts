
import { CacheFile } from './cache-file';

export class MemCache {
  cacheMap: Map<string, CacheFile>;
  constructor() {
    this.cacheMap = new Map;
  }

  get(imageKey: string, folderKey: string, width?: number, height?: number) {
    let cacheKey: string;
    cacheKey = MemCache.getKey(imageKey, folderKey, width, height);
    return this.cacheMap.get(cacheKey);
  }

  set(imageData: string, contentType: string, imageKey: string, folderKey: string, width?: number, height?: number) {
    let cacheKey: string;
    cacheKey = MemCache.getKey(imageKey, folderKey, width, height);
    if(!this.cacheMap.has(cacheKey)) {
      this.cacheMap.set(cacheKey, new CacheFile(imageData, contentType));
    }
  }

  has(imageKey: string, folderKey: string, width?: number, height?: number) {
    let cacheKey: string;
    cacheKey = MemCache.getKey(imageKey, folderKey, width, height);
    return this.cacheMap.has(cacheKey);
  }

  cacheSize(): number {
    let cacheFiles: CacheFile[];
    cacheFiles = [ ...this.cacheMap.values() ];
    return cacheFiles.reduce((acc, curr) => {
      return acc + curr.data.length;
    }, 0);
  }

  static getKey(imageKey: string, folderKey: string, width?: number, height?: number) {
    return `${imageKey}_${folderKey}_${width}_${height}`;
  }
}
