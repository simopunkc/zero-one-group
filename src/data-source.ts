import "reflect-metadata";
import { DataSource } from "typeorm";
import { News } from "@api/src/entity/News";
import { Topics } from "@api/src/entity/Topics";
import { RefNewsTopics } from "@api/src/entity/RefNewsTopics";
import * as dummy from "@api/migration/data-dummy";
import * as dummyTest from "@api/migration/data-test-dummy";

export const RESET_DB = `
DROP TYPE IF EXISTS news_status CASCADE;
CREATE TYPE news_status AS ENUM ('draft', 'deleted', 'published');
DROP TABLE IF EXISTS news, topics, ref_news_topics CASCADE;
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
  id SERIAL PRIMARY KEY,
  news_id INTEGER NOT NULL REFERENCES news(id) ON DELETE CASCADE,
  topics_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  UNIQUE (news_id, topics_id)
);
`;

export interface InterfaceDatabaseConnection{
    getConnection(): Promise<DataSource>;
    connectDatabase(): Promise<DataSource>;
}

export class DatabaseConnection implements InterfaceDatabaseConnection {
    private _connection: DataSource;

    async getConnection(): Promise<DataSource> {
        if (!this._connection?.isInitialized) {
            this._connection = await this.connectDatabase();
        }
        return this._connection;
    }
    async connectDatabase(): Promise<DataSource> {
        this._connection = new DataSource({
            type: "postgres",
            host: process.env.DB_HOST_PGSQL,
            port: Number(process.env.DB_PORT_PGSQL),
            username: process.env.DB_USERNAME_PGSQL,
            password: process.env.DB_PASSWORD_PGSQL,
            database: process.env.DB_DATABASE_PGSQL,
            synchronize: false,
            logging: false,
            entities: [
                News,
                Topics,
                RefNewsTopics,
            ],
            migrations: [],
            subscribers: [],
        });
        return this._connection.initialize();
    }
}

export const dbConnection = new DatabaseConnection();

export interface InterfaceDatabaseUtils{
    runQuery(query: string): unknown;
    setupDummyData(): void;
    setupDummyTestData(): void;
    resetDb(): void;
}

export class DatabaseUtils implements InterfaceDatabaseUtils {
    async runQuery(query: string) {
        const connection = await dbConnection.getConnection();
        return await connection.manager.query(query);
    }
    async setupDummyData() {
        const connection = await dbConnection.getConnection();
        await Promise.all([
            connection.manager.save(dummy.dummyNews1),
            connection.manager.save(dummy.dummyNews2),
            connection.manager.save(dummy.dummyNews3),
            connection.manager.save(dummy.dummyNews4),
            connection.manager.save(dummy.dataDummyTopics1),
            connection.manager.save(dummy.dataDummyTopics2),
            connection.manager.save(dummy.dataDummyTopics3),
            connection.manager.save(dummy.dataDummyTopics4),
        ]);
        await Promise.all([
            connection.manager.save(dummy.dataDummyRefNewsTopics1),
            connection.manager.save(dummy.dataDummyRefNewsTopics2),
            connection.manager.save(dummy.dataDummyRefNewsTopics3),
            connection.manager.save(dummy.dataDummyRefNewsTopics4),
        ]);
    }
    async setupDummyTestData() {
        const connection = await dbConnection.getConnection();
        await Promise.all([
            connection.manager.save(dummyTest.testNews1),
            connection.manager.save(dummyTest.testNews2),
            connection.manager.save(dummyTest.testNews3),
            connection.manager.save(dummyTest.testTopics1),
            connection.manager.save(dummyTest.testTopics2),
        ]);
        await Promise.all([
            connection.manager.save(dummyTest.testRefNewsTopics1),
            connection.manager.save(dummyTest.testRefNewsTopics2),
        ]);
    }
    async resetDb() {
        const connection = await dbConnection.getConnection();
        const result = await connection.manager.query(RESET_DB);
        return result;
    }
}

export const dbUtils = new DatabaseUtils();