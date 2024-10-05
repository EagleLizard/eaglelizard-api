import { FastifyReply, FastifyRequest } from 'fastify';

export function getHealthcheck(req: FastifyRequest, res: FastifyReply) {
  res.send({
    status: 'ok',
  });
}
