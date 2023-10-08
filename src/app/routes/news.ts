import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { dbConnection } from '@api/src/data-source';
import { News, StatusContent } from '@api/src/entity/News';

export default async function (fastify: FastifyInstance) {
  fastify.get('/api/news', async () => {
    try {
      const connection = await dbConnection.getConnection();
      const newsRepository = connection.getRepository(News);
      const rows = await newsRepository.find();
      return {
        message: 'list news',
        data: rows,
      };
    } catch (error) {
      return {
        message: error.message,
      }
    }
  });

  fastify.get('/api/news/drafted', async () => {
    try {
      const connection = await dbConnection.getConnection();
      const newsRepository = connection.getRepository(News);
      const rows = await newsRepository.findBy({ status_content: StatusContent.DRAFTED });
      return {
        message: 'list drafted news',
        data: rows,
      };
    } catch (error) {
      return {
        message: error.message,
      }
    }
  });

  fastify.get('/api/news/published', async () => {
    try {
      const connection = await dbConnection.getConnection();
      const newsRepository = connection.getRepository(News);
      const rows = await newsRepository.findBy({ status_content: StatusContent.PUBLISHED });
      return {
        message: 'list published news',
        data: rows,
      };
    } catch (error) {
      return {
        message: error.message,
      }
    }
  });

  fastify.get('/api/news/deleted', async () => {
    try {
      const connection = await dbConnection.getConnection();
      const newsRepository = connection.getRepository(News);
      const rows = await newsRepository.findBy({ status_content: StatusContent.DELETED });
      return {
        message: 'list deleted news',
        data: rows,
      };
    } catch (error) {
      return {
        message: error.message,
      }
    }
  });

  fastify.get(
    '/api/news/:id',
    async (request: FastifyRequest<{ Params: { id: number } }>) => {
      try {
        const { id } = request.params;
        const connection = await dbConnection.getConnection();
        const newsRepository = connection.getRepository(News);
        const rows = await newsRepository.findOneBy({ id: id });
        return {
          message: 'single new',
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
    '/api/news',
    async (
      request: FastifyRequest<{
        Body: { title: string; content: string; status_content: StatusContent };
      }>
    ) => {
      try {
        const { title, content, status_content } = request.body;

        const news = new News();
        news.title = title;
        news.content = content;
        news.status_content = status_content;
        const connection = await dbConnection.getConnection();
        const rows = await connection.manager.save(news);
        return {
          message: 'create new',
          data: rows,
        };
      } catch (error) {
        return {
          message: error.message,
        }
      }
    }
  );

  fastify.put(
    '/api/news/:id',
    async (
      request: FastifyRequest<{
        Params: { id: number };
        Body: { title: string; content: string; status_content: StatusContent };
      }>
    ) => {
      try {
        const { title, content, status_content } = request.body;
        const { id } = request.params;
        const connection = await dbConnection.getConnection();
        const newsRepository = connection.getRepository(News);
        const newToReplace = await newsRepository.findOneBy({ id: id });
        if (!newToReplace) throw new Error(`Could not get new ${id} from database`);
        newToReplace.title = title;
        newToReplace.content = content;
        newToReplace.status_content = status_content;
        const rows = await newsRepository.save(newToReplace);
        return {
          message: 'replace new',
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
    '/api/news/:id/status_content',
    async (
      request: FastifyRequest<{
        Params: { id: number };
        Body: { status_content: StatusContent };
      }>
    ) => {
      try {
        const { id } = request.params;
        const { status_content } = request.body;
        const connection = await dbConnection.getConnection();
        const newsRepository = connection.getRepository(News);
        const newToUpdate = await newsRepository.findOneBy({ id: id });
        if (!newToUpdate) throw new Error(`Could not get new ${id} from database`);
        newToUpdate.status_content = status_content;
        newToUpdate.updated_at = new Date().toISOString();
        const rows = await newsRepository.save(newToUpdate);
        return {
          message: 'update new',
          data: rows,
        };
      } catch (error) {
        return {
          message: error.message,
        }
      }
    }
  );

  fastify.delete(
    '/api/news/:id',
    async (
      request: FastifyRequest<{
        Params: { id: number };
      }>
    ) => {
      try {
        const { id } = request.params;
        const connection = await dbConnection.getConnection();
        const newsRepository = connection.getRepository(News);
        const newToDelete = await newsRepository.findOneBy({ id: id });
        if (!newToDelete) throw new Error(`Could not get new ${id} from database`);
        newToDelete.status_content = StatusContent.DELETED;
        newToDelete.updated_at = new Date().toISOString();
        const rows = await newsRepository.save(newToDelete);
        return {
          message: 'delete new',
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
