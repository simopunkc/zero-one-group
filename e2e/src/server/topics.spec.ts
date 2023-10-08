import axios from 'axios';
import { dbConnection, dbUtils } from "@api/src/data-source";
import * as dummy from "@api/migration/data-test-dummy";

describe('/api/topics', () => {
  beforeEach(async () => {
    await dbUtils.resetDb();
    jest.resetModules();
  });

  it('list topics', async () => {
    await dbUtils.setupDummyTestData();
    const res = await axios.get(`/api/topics`);
    expect(res.status).toBe(200);
    expect(res.data.message).toEqual('list topics');
    expect(res.data.data.length).toEqual(2);
  });

  it('single topic', async () => {
    await dbUtils.setupDummyTestData();
    const res = await axios.get(`/api/topics/2`);
    expect(res.status).toBe(200);
    expect(res.data.message).toEqual('single topic');
  });

  it('create topic', async () => {
    const res = await axios.post(`/api/topics`, {
      category_name: dummy.testTopicsPost.category_name,
    });
    expect(res.status).toBe(200);
    expect(res.data.message).toEqual('create topic');
  });

  it('update topic', async () => {
    const connection = await dbConnection.getConnection();
    await connection.manager.save(dummy.testTopics1);
    const res = await axios.patch(`/api/topics/1`, {
      category_name: dummy.testTopicsPut.category_name,
    });
    expect(res.status).toBe(200);
    expect(res.data.message).toEqual('update topic');
  });
  
  it('list news on this topic', async () => {
    await dbUtils.setupDummyTestData();
    const res = await axios.get(`/api/topics/2/news`);
    expect(res.status).toBe(200);
    expect(res.data.message).toEqual('list news on this topic');
    expect(res.data.data.length).toEqual(2);
  });

  it('create ref news topic', async () => {
    await dbUtils.setupDummyTestData();
    const res = await axios.post(`/api/topics/1/news/1`, {});
    expect(res.status).toBe(200);
    expect(res.data.message).toEqual('create ref news topic');
  });

  it('delete ref news topic', async () => {
    await dbUtils.setupDummyTestData();
    const res = await axios.delete(`/api/topics/2/news/1`);
    expect(res.status).toBe(200);
    expect(res.data.message).toEqual('delete ref news topic');
  });
});