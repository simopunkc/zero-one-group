import { runQuery } from '@api/db/utils';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

const addNewToTopic = `INSERT INTO ref_news_topics (news_id, topics_id)
VALUES ($1, $2) ON CONFLICT (news_id, topics_id) DO NOTHING;`;
const deleteNewFromTopic = `DELETE FROM ref_news_topics WHERE news_id=$1 AND topics_id=$2;`;

export default async function (fastify: FastifyInstance) {
  fastify.post('/api/topics/:idTopic/news/:id', async (
    request: FastifyRequest<{
      Params: { idTopic: number; id: number; };
    }>) => {
    const { idTopic, id } = request.params;
    const { rows } = await runQuery(fastify.pg, addNewToTopic, [id, idTopic]);
    return rows;
  });

  fastify.delete('/api/topics/:idTopic/news/:id', async (
    request: FastifyRequest<{
      Params: { idTopic: number; id: number; };
    }>) => {
    const { idTopic, id } = request.params;
    const { rows } = await runQuery(fastify.pg, deleteNewFromTopic, [id, idTopic]);
    return rows;
  });
}
