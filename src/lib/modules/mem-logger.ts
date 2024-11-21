
import fs, { WriteStream } from 'fs';

import { MemCache } from './mem-cache/mem-cache';
import { DateTimeUtil } from './util/datetime-util';
import { MEM_LOG_PATH } from '../constants';
const INTERVAL = 1e4;

export type MemLoggerStream = {
  write: WriteStream['write'];
};

export class MemLogger {
  memCache?: MemCache;
  logStream: MemLoggerStream;
  constructor(memCache?: MemCache, logFilePath?: string) {
    // this.logHeap();
    this.memCache = memCache;
    this.logStream = fs.createWriteStream(MEM_LOG_PATH, {
      flags: 'a',
    });
    // this.logStream = logStream ?? process.stdout;
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

    this.logStream.write('\n');
    this.logStream.write(`[${DateTimeUtil.getDebugDateTimeStr(new Date)}]\n`);
    memVals.forEach(memTuple => {
      let memKey: string, byteVal: number, megaBytes: number;
      [ memKey, byteVal ] = memTuple;
      megaBytes = byteVal / 1024 / 1024;
      this.logStream.write(`${memKey}: ${(+megaBytes.toFixed(3)).toLocaleString()} MB\n`);
    });

    if(this.memCache !== undefined) {
      cacheSize = this.memCache.cacheSize() / 1024 / 1024;
      this.logStream.write(`mem_cache: ${cacheSize.toFixed(3)} MB\n`);
    }

    setTimeout(() => {
      this.logHeap();
    }, INTERVAL);
  }
}
