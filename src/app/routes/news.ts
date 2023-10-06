import { runQuery } from '@api/db/utils';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

const getAllNews = `SELECT * from news;`;
const getAllDraftedNews = `SELECT * from news WHERE status_content='draft';`;
const getAllPublishedNews = `SELECT * from news WHERE status_content='published';`;
const getAllDeletedNews = `SELECT * from news WHERE status_content='deleted';`;
const getNewById = `SELECT * from news WHERE id=$1 LIMIT 1;`;
const createNew = `INSERT INTO news (title, content, status_content)
VALUES ($1, $2, $3) RETURNING * ;`;
const replaceNew = `UPDATE news SET title=$1, content=$2, status_content=$3 WHERE id = $4 RETURNING * ;`;
const updateNewCurrentStatus = `UPDATE news SET status_content=$1, updated_at=$2 WHERE id = $3 RETURNING * ;`;
const softDeleteNew = `UPDATE news SET status_content='deleted', updated_at=$1 WHERE id = $2 RETURNING * ;`;

export default async function (fastify: FastifyInstance) {
  fastify.get('/api/news', async () => {
    const { rows } = await runQuery(fastify.pg, getAllNews);
    console.log(rows);
    return rows;
  });

  fastify.get('/api/news/drafted', async () => {
    const { rows } = await runQuery(fastify.pg, getAllDraftedNews);
    return rows;
  });

  fastify.get('/api/news/published', async () => {
    const { rows } = await runQuery(fastify.pg, getAllPublishedNews);
    return rows;
  });

  fastify.get('/api/news/deleted', async () => {
    const { rows } = await runQuery(fastify.pg, getAllDeletedNews);
    return rows;
  });

  fastify.get(
    '/api/news/:id',
    async (request: FastifyRequest<{ Params: { id: number } }>) => {
      const { id } = request.params;
      const { rows } = await runQuery(fastify.pg, getNewById, [id]);
      return rows;
    }
  );

  fastify.post(
    '/api/news',
    async (
      request: FastifyRequest<{
        Body: { title: string; content: string; status_content: string };
      }>
    ) => {
      const { title, content, status_content } = request.body;
      const { rows } = await runQuery(fastify.pg, createNew, [
        title,
        content,
        status_content,
      ]);
      return rows;
    }
  );

  fastify.put(
    '/api/news/:id',
    async (
      request: FastifyRequest<{
        Params: { id: number };
        Body: { title: string; content: string; status_content: string };
      }>
    ) => {
      const { title, content, status_content } = request.body;
      const { id } = request.params;
      const { rows } = await runQuery(fastify.pg, replaceNew, [
        title,
        content,
        status_content,
        id,
      ]);
      return rows;
    }
  );

  fastify.patch(
    '/api/news/:id/status_content',
    async (
      request: FastifyRequest<{
        Params: { id: number };
        Body: { status_content: string };
      }>
    ) => {
      const { id } = request.params;
      const { status_content } = request.body;
      const { rows } = await runQuery(fastify.pg, updateNewCurrentStatus, [
        status_content,
        new Date().toISOString(),
        id
      ]);
      return rows;
    }
  );

  fastify.delete(
    '/api/news/:id',
    async (
      request: FastifyRequest<{
        Params: { id: number };
      }>
    ) => {
      const { id } = request.params;
      const { rows } = await runQuery(fastify.pg, softDeleteNew, [
        new Date().toISOString(),
        id
      ]);
      return rows;
    }
  );
}
