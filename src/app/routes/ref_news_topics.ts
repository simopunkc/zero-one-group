import { dbConnection } from '@api/src/data-source';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { RefNewsTopics } from "@api/src/entity/RefNewsTopics";
import { News } from '@api/src/entity/News';
import { In } from 'typeorm';

export default async function (fastify: FastifyInstance) {
  fastify.get(
    '/api/topics/:idTopic/news',
    async (request: FastifyRequest<{ Params: { idTopic: number } }>) => {
      try {
        const { idTopic } = request.params;
        const connection = await dbConnection.getConnection();
        const refNewsTopicsRepository = connection.getRepository(RefNewsTopics);
        const tempRows = await refNewsTopicsRepository.findBy({
          topics_id: idTopic
        });
        const listIdNews = (tempRows.length > 0) ? tempRows.map((row) => row.news_id) : [];
        const newsRepository = connection.getRepository(News);
        const rows = await newsRepository.findBy({
          id: In([...listIdNews])
        });
        return {
          message: 'list news on this topic',
          data: rows,
        };
      } catch (error) {
        return {
          message: error.message,
        }
      }
    }
  );

  fastify.post('/api/topics/:idTopic/news/:id', async (
    request: FastifyRequest<{
      Params: { idTopic: number; id: number; };
    }>) => {
      try {
        const { idTopic, id } = request.params;
        const refNewsTopics = new RefNewsTopics();
        refNewsTopics.news_id = id;
        refNewsTopics.topics_id = idTopic;
        const connection = await dbConnection.getConnection();
        const refNewsTopicsRepository = connection.getRepository(RefNewsTopics);
        const rows = await refNewsTopicsRepository.save(refNewsTopics);
        return {
          message: 'create ref news topic',
          data: rows,
        };
      } catch (error) {
        return {
          message: error.message,
        }
      }
  });

  fastify.delete('/api/topics/:idTopic/news/:id', async (
    request: FastifyRequest<{
      Params: { idTopic: number; id: number; };
    }>) => {
      try {
        const { idTopic, id } = request.params;
        const connection = await dbConnection.getConnection();
        const refNewsTopicsRepository = connection.getRepository(RefNewsTopics);
        const refNewsTopicsToRemove =  await refNewsTopicsRepository.findOneBy({
          news_id: id,
          topics_id: idTopic,
        });
        if (!refNewsTopicsToRemove) throw new Error(`Could not get new ${id} from database`);
        const rows = await refNewsTopicsRepository.remove(refNewsTopicsToRemove);
        return {
          message: 'delete ref news topic',
          data: rows,
        };
      } catch (error) {
        return {
          message: error.message,
        }
      }
  });
}
