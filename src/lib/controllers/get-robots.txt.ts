
import path from 'path';
import { Request, Response } from 'express';
import { BASE_DIR } from '../jcd-v3-constants';

export async function getRobotsTxt(req: Request, res: Response) {
  let robotsTxtFilePath: string;
  robotsTxtFilePath = [
    BASE_DIR,
    'src',
    'assets',
    'robots.txt',
  ].join(path.sep);
  res.type('text/plain');
  res.sendFile(robotsTxtFilePath);
}
