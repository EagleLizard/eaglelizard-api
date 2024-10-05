
import path from 'path';
import fs from 'fs';
import { BASE_DIR } from '../jcd-v3-constants';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function getRobotsTxt(req: FastifyRequest, res: FastifyReply) {
  let robotsTxtFilePath: string;
  let fileStream: fs.ReadStream;
  robotsTxtFilePath = [
    BASE_DIR,
    'src',
    'assets',
    'robots.txt',
  ].join(path.sep);
  fileStream = fs.createReadStream(robotsTxtFilePath);
  res.header('content-type', 'text/plain');
  return res.send(fileStream);
}
