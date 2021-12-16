import { MemCache } from './mem-cache/mem-cache';

const INTERVAL = 1e4;

export class MemLogger {
  memCache?: MemCache;
  constructor(memCache?: MemCache) {
    // this.logHeap();
    this.memCache = memCache;
  }

  run() {
    this.logHeap();
  }

  private logHeap() {
    let memoryUsage: NodeJS.MemoryUsage;
    let cacheSize: number, memVals: [ string, number ][];

    memoryUsage = process.memoryUsage();
    memVals = [ 'rss', 'heapTotal', 'heapUsed', 'external' ].map(memKey => {
      let byteVal: number;
      byteVal = ((memoryUsage as unknown) as Record<string, number>)[memKey];
      return [ memKey, byteVal ];
    });

    process.stdout.write('\n');
    memVals.forEach(memTuple => {
      let memKey: string, byteVal: number, megaBytes: number;
      [ memKey, byteVal ] = memTuple;
      megaBytes = byteVal / 1024 / 1024;
      console.log(`${memKey}: ${(+megaBytes.toFixed(3)).toLocaleString()} MB`);
    });

    if(this.memCache !== undefined) {
      cacheSize = this.memCache.cacheSize() / 1024 / 1024;
      console.log(`Cache Size: ${cacheSize.toFixed(3)} MB`);
    }

    setTimeout(() => {
      this.logHeap();
    }, INTERVAL);
  }
}
