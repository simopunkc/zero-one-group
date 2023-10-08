import Fastify, { FastifyInstance, FastifyReply } from 'fastify';
import { app } from './app';
import * as dummy from "@api/migration/data-test-dummy";

const dbUtilsMock = {
  runQuery: jest.fn(),
  setupDummyData: jest.fn(),
  setupDummyTestData: jest.fn(),
  resetDb: jest.fn(),
};

describe('/', () => {
  let server: FastifyInstance;

  beforeEach(async () => {
    server = Fastify();
    server.register(app);
    jest.resetModules();
  });

  it('hello', async () => {
    jest.doMock("@api/src/data-source", () => {
      return {
        dbUtils: dbUtilsMock,
        dbConnection: {
          getConnection: () => ({
            manager: {
              query: jest.fn(),
            },
          }),
          connectDatabase: jest.fn(),
        },
      };
    });
    const response = await server.inject({
      method: 'GET',
      url: '/',
    });
    const res = response.json();
    expect(res.message).toEqual('Hello API');
  });

  it('reset db', async () => {
    jest.doMock("@api/src/data-source", () => {
      return {
        dbUtils: dbUtilsMock,
        dbConnection: {
          getConnection: {
            manager: {
              query: jest.fn().mockResolvedValue({}),
            },
            getRepository: jest.fn(),
          },
          connectDatabase: jest.fn(),
        },
      };
    });
    const response = await server.inject({
      method: 'GET',
      url: '/reset',
    });
    const res = response.json();
    expect(res.message).toEqual('Reset DB Success');
  });
});

describe('/api/news', () => {
  let server: FastifyInstance;

  beforeEach(async () => {
    server = Fastify();
    server.register(app);
    jest.resetModules();
  });

  it('list news', async () => {
    jest.doMock("@api/src/data-source", () => {
      return {
        dbUtils: dbUtilsMock,
        dbConnection: {
          getConnection: () => ({
            manager: {
              query: jest.fn(),
            },
            getRepository: () => ({
              find: jest.fn().mockResolvedValue([dummy.testNews1]),
            }),
          }),
          connectDatabase: jest.fn(),
        },
      };
    });
    const response = await server.inject({
      method: 'GET',
      url: '/api/news',
    });
    const res = response.json();
    expect(res.message).toEqual('list news');
    expect(res.data.length).toEqual(1);
  });

  it('list drafted news', async () => {
    jest.doMock("@api/src/data-source", () => {
      return {
        dbUtils: dbUtilsMock,
        dbConnection: {
          getConnection: () => ({
            manager: {
              query: jest.fn(),
            },
            getRepository: () => ({
              findBy: jest.fn().mockResolvedValue([dummy.testNews3]),
            }),
          }),
          connectDatabase: jest.fn(),
        },
      };
    });
    const response = await server.inject({
      method: 'GET',
      url: '/api/news/drafted',
    });
    const res = response.json();
    expect(res.message).toEqual('list drafted news');
    expect(res.data.length).toEqual(1);
  });

  it('list published news', async () => {
    jest.doMock("@api/src/data-source", () => {
      return {
        dbUtils: dbUtilsMock,
        dbConnection: {
          getConnection: () => ({
            manager: {
              query: jest.fn(),
            },
            getRepository: () => ({
              findBy: jest.fn().mockResolvedValue([dummy.testNews2]),
            }),
          }),
          connectDatabase: jest.fn(),
        },
      };
    });
    const response = await server.inject({
      method: 'GET',
      url: '/api/news/published',
    });
    const res = response.json();
    expect(res.message).toEqual('list published news');
    expect(res.data.length).toEqual(1);
  });

  it('list deleted news', async () => {
    jest.doMock("@api/src/data-source", () => {
      return {
        dbUtils: dbUtilsMock,
        dbConnection: {
          getConnection: () => ({
            manager: {
              query: jest.fn(),
            },
            getRepository: () => ({
              findBy: jest.fn().mockResolvedValue([dummy.testNews1]),
            }),
          }),
          connectDatabase: jest.fn(),
        },
      };
    });
    const response = await server.inject({
      method: 'GET',
      url: '/api/news/deleted',
    });
    const res = response.json();
    expect(res.message).toEqual('list deleted news');
    expect(res.data.length).toEqual(1);
  });

  it('single new', async () => {
    jest.doMock("@api/src/data-source", () => {
      return {
        dbUtils: dbUtilsMock,
        dbConnection: {
          getConnection: () => ({
            manager: {
              query: jest.fn(),
            },
            getRepository: () => ({
              findOneBy: jest.fn().mockResolvedValue(dummy.testNews1),
            }),
          }),
          connectDatabase: jest.fn(),
        },
      };
    });
    const response = await server.inject({
      method: 'GET',
      url: '/api/news/1',
    });
    const res = response.json();
    expect(res.message).toEqual('single new');
  });

  it('create new', async () => {
    jest.doMock("@api/src/data-source", () => {
      return {
        dbUtils: dbUtilsMock,
        dbConnection: {
          getConnection: () => ({
            manager: {
              query: jest.fn(),
              save: jest.fn().mockResolvedValue(dummy.testNewsPost),
            },
          }),
          connectDatabase: jest.fn(),
        },
      };
    });
    const response = await server.inject({
      method: 'POST',
      url: '/api/news',
      payload: {
        title: dummy.testNewsPost.title,
        content: dummy.testNewsPost.content,
        status_content: dummy.testNewsPost.status_content,
      },
    });
    const res = response.json();
    expect(res.message).toEqual('create new');
  });

  it('replace new', async () => {
    jest.doMock("@api/src/data-source", () => {
      return {
        dbUtils: dbUtilsMock,
        dbConnection: {
          getConnection: () => ({
            manager: {
              query: jest.fn(),
            },
            getRepository: () => ({
              findOneBy: jest.fn().mockResolvedValue(dummy.testNews1),
              save: jest.fn().mockResolvedValue(dummy.testNewsPut),
            }),
          }),
          connectDatabase: jest.fn(),
        },
      };
    });
    const response = await server.inject({
      method: 'PUT',
      url: '/api/news/1',
      payload: {
        title: dummy.testNewsPut.title,
        content: dummy.testNewsPut.content,
        status_content: dummy.testNewsPut.status_content,
      },
    });
    const res = response.json();
    expect(res.message).toEqual('replace new');
  });

  it('update new', async () => {
    jest.doMock("@api/src/data-source", () => {
      return {
        dbUtils: dbUtilsMock,
        dbConnection: {
          getConnection: () => ({
            manager: {
              query: jest.fn(),
            },
            getRepository: () => ({
              findOneBy: jest.fn().mockResolvedValue(dummy.testNews2),
              save: jest.fn().mockResolvedValue(dummy.testNewsPatch),
            }),
          }),
          connectDatabase: jest.fn(),
        },
      };
    });
    const response = await server.inject({
      method: 'PATCH',
      url: '/api/news/2/status_content',
      payload: {
        status_content: dummy.testNewsPatch.status_content,
      },
    });
    const res = response.json();
    expect(res.message).toEqual('update new');
  });

  it('delete new', async () => {
    jest.doMock("@api/src/data-source", () => {
      return {
        dbUtils: dbUtilsMock,
        dbConnection: {
          getConnection: () => ({
            manager: {
              query: jest.fn(),
            },
            getRepository: () => ({
              findOneBy: jest.fn().mockResolvedValue(dummy.testNews3),
              save: jest.fn().mockResolvedValue(dummy.testNewsDelete),
            }),
          }),
          connectDatabase: jest.fn(),
        },
      };
    });
    const response = await server.inject({
      method: 'DELETE',
      url: '/api/news/3',
    });
    const res = response.json();
    expect(res.message).toEqual('delete new');
  });
});

describe('/api/topics', () => {
  let server: FastifyInstance;

  beforeEach(async () => {
    server = Fastify();
    server.register(app);
    jest.resetModules();
  });

  it('list topics', async () => {
    jest.doMock("@api/src/data-source", () => {
      return {
        dbUtils: dbUtilsMock,
        dbConnection: {
          getConnection: () => ({
            manager: {
              query: jest.fn(),
            },
            getRepository: () => ({
              find: jest.fn().mockResolvedValue([dummy.testTopics1]),
            }),
          }),
          connectDatabase: jest.fn(),
        },
      };
    });
    const response = await server.inject({
      method: 'GET',
      url: '/api/topics',
    });
    const res = response.json();
    expect(res.message).toEqual('list topics');
    expect(res.data.length).toEqual(1);
  });

  it('single topic', async () => {
    jest.doMock("@api/src/data-source", () => {
      return {
        dbUtils: dbUtilsMock,
        dbConnection: {
          getConnection: () => ({
            manager: {
              query: jest.fn(),
            },
            getRepository: () => ({
              findOneBy: jest.fn().mockResolvedValue([dummy.testTopics2]),
            }),
          }),
          connectDatabase: jest.fn(),
        },
      };
    });
    const response = await server.inject({
      method: 'GET',
      url: '/api/topics/2',
    });
    const res = response.json();
    expect(res.message).toEqual('single topic');
  });

  it('create topic', async () => {
    jest.doMock("@api/src/data-source", () => {
      return {
        dbUtils: dbUtilsMock,
        dbConnection: {
          getConnection: () => ({
            manager: {
              query: jest.fn(),
              save: jest.fn().mockResolvedValue(dummy.testTopicsPost),
            },
          }),
          connectDatabase: jest.fn(),
        },
      };
    });
    const response = await server.inject({
      method: 'POST',
      url: '/api/topics',
      payload: {
        category_name: dummy.testTopicsPost.category_name,
      },
    });
    const res = response.json();
    expect(res.message).toEqual('create topic');
  });

  it('update topic', async () => {
    jest.doMock("@api/src/data-source", () => {
      return {
        dbUtils: dbUtilsMock,
        dbConnection: {
          getConnection: () => ({
            manager: {
              query: jest.fn(),
            },
            getRepository: () => ({
              findOneBy: jest.fn().mockResolvedValue(dummy.testTopics1),
              save: jest.fn().mockResolvedValue(dummy.testTopicsPut),
            }),
          }),
          connectDatabase: jest.fn(),
        },
      };
    });
    const response = await server.inject({
      method: 'PATCH',
      url: '/api/topics/1',
      payload: {
        category_name: dummy.testTopicsPut.category_name,
      },
    });
    const res = response.json();
    expect(res.message).toEqual('update topic');
  });
  
  it('list news on this topic', async () => {
    jest.doMock("@api/src/data-source", () => {
      return {
        dbUtils: dbUtilsMock,
        dbConnection: {
          getConnection: () => ({
            manager: {
              query: jest.fn(),
            },
            getRepository: () => ({
              findBy: jest.fn().mockResolvedValueOnce([dummy.testRefNewsTopics1, dummy.testRefNewsTopics2]).mockResolvedValueOnce([dummy.testNews1, dummy.testNews2]),
            }),
          }),
          connectDatabase: jest.fn(),
        },
      };
    });
    const response = await server.inject({
      method: 'GET',
      url: '/api/topics/2/news',
    });
    const res = response.json();
    expect(res.message).toEqual('list news on this topic');
    expect(res.data.length).toEqual(2);
  });

  it('create ref news topic', async () => {
    jest.doMock("@api/src/data-source", () => {
      return {
        dbUtils: dbUtilsMock,
        dbConnection: {
          getConnection: () => ({
            manager: {
              query: jest.fn(),
            },
            getRepository: () => ({
              save: jest.fn().mockResolvedValue(dummy.testRefNewsTopics2),
            }),
          }),
          connectDatabase: jest.fn(),
        },
      };
    });
    const response = await server.inject({
      method: 'POST',
      url: '/api/topics/2/news/2',
    });
    const res = response.json();
    expect(res.message).toEqual('create ref news topic');
  });

  it('delete ref news topic', async () => {
    jest.doMock("@api/src/data-source", () => {
      return {
        dbUtils: dbUtilsMock,
        dbConnection: {
          getConnection: () => ({
            manager: {
              query: jest.fn(),
            },
            getRepository: () => ({
              findOneBy: jest.fn().mockResolvedValue(dummy.testRefNewsTopics1),
              remove: jest.fn().mockResolvedValue(dummy.testRefNewsTopics1),
            }),
          }),
          connectDatabase: jest.fn(),
        },
      };
    });
    const response = await server.inject({
      method: 'DELETE',
      url: '/api/topics/2/news/1',
    });
    const res = response.json();
    expect(res.message).toEqual('delete ref news topic');
  });
});