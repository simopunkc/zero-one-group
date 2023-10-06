import { runQuery } from '@api/db/utils';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

const getAllTopics = `SELECT * from topics;`;
const getTopicById = `SELECT * from topics WHERE id=$1 LIMIT 1;`;
const createTopic = `INSERT INTO topics (category_name) VALUES ($1) RETURNING * ;`;
const updateTopic = `UPDATE topics SET category_name=$1, updated_at=$2 WHERE id=$3 RETURNING * ;`;
const getAllNewByTopicId = `SELECT a.* from news a LEFT JOIN ref_news_topics b on a.id=b.news_id where b.news_id=$1`;



export default async function (fastify: FastifyInstance) {
  fastify.get('/api/topics', async () => {
    const { rows } = await runQuery(fastify.pg, getAllTopics);
    return rows;
  });

  fastify.get(
    '/api/topics/:idTopic',
    async (request: FastifyRequest<{ Params: { idTopic: number } }>) => {
      const { idTopic } = request.params;
      const { rows } = await runQuery(fastify.pg, getTopicById, [idTopic]);
      return rows;
    }
  );

  fastify.post(
    '/api/topics',
    async (
      request: FastifyRequest<{
        Body: { category_name: string; };
      }>
    ) => {
      const { category_name } = request.body;
      const { rows } = await runQuery(fastify.pg, createTopic, [
        category_name,
      ]);
      return rows;
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
      const { idTopic } = request.params;
      const { category_name } = request.body;
      const { rows } = await runQuery(fastify.pg, updateTopic, [
        category_name,
        new Date().toISOString(),
        idTopic
      ]);
      return rows;
    }
  );

  fastify.get(
    '/api/topics/:idTopic/news',
    async (request: FastifyRequest<{ Params: { idTopic: number } }>) => {
      const { idTopic } = request.params;
      const { rows } = await runQuery(fastify.pg, getAllNewByTopicId, [idTopic]);
      return rows;
    }
  );
}
