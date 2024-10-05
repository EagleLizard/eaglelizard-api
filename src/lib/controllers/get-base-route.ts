import { FastifyReply, FastifyRequest } from 'fastify';

export function getBaseRoute(req: FastifyRequest, res: FastifyReply) {
  res.send('EagleLizard API GCP');
}
