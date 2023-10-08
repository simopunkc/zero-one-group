import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { dbUtils } from '@api/src/data-source';

export default async function (fastify: FastifyInstance) {
  fastify.get(
    '/',
    async function (request: FastifyRequest, reply: FastifyReply) {
      return {
        message: 'Hello API',
      };
    }
  );
  
  fastify.get('/reset', async () => {
    try {
      await dbUtils.resetDb();
      return {
        message: 'Reset DB Success',
      };
    } catch (error) {
      return {
        message: error.message,
      }
    }
  });
}