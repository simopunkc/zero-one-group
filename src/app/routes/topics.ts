import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { dbConnection } from '@api/src/data-source';
import { Topics } from '@api/src/entity/Topics';

export default async function (fastify: FastifyInstance) {
  fastify.get('/api/topics', async () => {
    try {
      const connection = await dbConnection.getConnection();
      const topicsRepository = connection.getRepository(Topics);
      const rows =  await topicsRepository.find();
      return {
        message: 'list topics',
        data: rows,
      };
    } catch (error) {
      return {
        message: error.message,
      }
    }
  });

  fastify.get(
    '/api/topics/:idTopic',
    async (request: FastifyRequest<{ Params: { idTopic: number } }>) => {
      try {
        const { idTopic } = request.params;
        const connection = await dbConnection.getConnection();
        const topicsRepository = connection.getRepository(Topics);
        const rows =  await topicsRepository.findOneBy({
          id: idTopic
        });
        return {
          message: 'single topic',
          data: rows,
        };
      } catch (error) {
        return {
          message: error.message,
        }
      }
    }
  );

  fastify.post(
    '/api/topics',
    async (
      request: FastifyRequest<{
        Body: { category_name: string; };
      }>
    ) => {
      try {
        const { category_name } = request.body;
        const topics = new Topics();
        topics.category_name = category_name;
        const connection = await dbConnection.getConnection();
        const rows = await connection.manager.save(topics);
        return {
          message: 'create topic',
          data: rows,
        };
      } catch (error) {
        return {
          message: error.message,
        }
      }
    }
  );

  fastify.patch(
    '/api/topics/:idTopic',
    async (
      request: FastifyRequest<{
        Params: { idTopic: number };
        Body: { category_name: string };
      }>
    ) => {
      try {
        const { idTopic } = request.params;
        const { category_name } = request.body;
        const connection = await dbConnection.getConnection();
        const topicsRepository = connection.getRepository(Topics);
        const topicToUpdate = await topicsRepository.findOneBy({ id: idTopic });
        if (!topicToUpdate) throw new Error(`Could not get new ${idTopic} from database`);
        topicToUpdate.category_name = category_name;
        topicToUpdate.updated_at = new Date().toISOString();
        const rows = await topicsRepository.save(topicToUpdate);
        return {
          message: 'update topic',
          data: rows,
        };
      } catch (error) {
        return {
          message: error.message,
        }
      }
    }
  );
}
