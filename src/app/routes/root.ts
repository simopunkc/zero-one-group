import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { resetDb } from '@api/db/utils';

export default async function (fastify: FastifyInstance) {
  fastify.get(
    '/',
    async function (request: FastifyRequest, reply: FastifyReply) {
      return { message: 'Hello API' };
    }
  );
  
  fastify.get('/reset', async () => {
    return await resetDb(fastify.pg);
  });
}