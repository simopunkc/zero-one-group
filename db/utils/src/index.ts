import { PostgresDb } from '@fastify/postgres';

export const RESET_DB = `
DROP TYPE IF EXISTS news_status CASCADE;
DROP TABLE IF EXISTS news, topics, ref_news_topics CASCADE;

CREATE TYPE news_status AS ENUM ('draft', 'deleted', 'published');

CREATE TABLE news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(160) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  status_content news_status NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE topics (
  id SERIAL PRIMARY KEY,
  category_name VARCHAR(60) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ref_news_topics (
  news_id INTEGER NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  topics_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  UNIQUE (news_id, topics_id)
);
`;

export async function resetDb(pg: PostgresDb) {
  await runQuery(pg, RESET_DB);
  return 'Ok';
}

export async function runQuery(
  pg: PostgresDb,
  query: string,
  params: unknown[] = []
) {
  const client = await pg.connect();
  try {
    return await client.query(query, params);
  } finally {
    client.release();
  }
}
