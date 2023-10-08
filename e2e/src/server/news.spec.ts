import axios from 'axios';
import { dbConnection, dbUtils } from "@api/src/data-source";
import * as dummy from "@api/migration/data-test-dummy";

describe('/api/news', () => {
  beforeEach(async () => {
    await dbUtils.resetDb();
    jest.resetModules();
  });

  it('list news', async () => {
    await dbUtils.setupDummyTestData();
    const res = await axios.get(`/api/news`);
    expect(res.status).toBe(200);
    expect(res.data.message).toEqual('list news');
    expect(res.data.data.length).toEqual(3);
  });

  it('list drafted news', async () => {
    await dbUtils.setupDummyTestData();
    const res = await axios.get(`/api/news/drafted`);
    expect(res.status).toBe(200);
    expect(res.data.message).toEqual('list drafted news');
    expect(res.data.data.length).toEqual(1);
  });

  it('list published news', async () => {
    await dbUtils.setupDummyTestData();
    const res = await axios.get(`/api/news/published`);
    expect(res.status).toBe(200);
    expect(res.data.message).toEqual('list published news');
    expect(res.data.data.length).toEqual(1);
  });

  it('list deleted news', async () => {
    await dbUtils.setupDummyTestData();
    const res = await axios.get(`/api/news/deleted`);
    expect(res.status).toBe(200);
    expect(res.data.message).toEqual('list deleted news');
    expect(res.data.data.length).toEqual(1);
  });

  it('single new', async () => {
    await dbUtils.setupDummyTestData();
    const res = await axios.get(`/api/news/1`);
    expect(res.status).toBe(200);
    expect(res.data.message).toEqual('single new');
  });

  it('create new', async () => {
    const res = await axios.post(`/api/news`, {
      title: dummy.testNewsPost.title,
      content: dummy.testNewsPost.content,
      status_content: dummy.testNewsPost.status_content,
    });
    expect(res.status).toBe(200);
    expect(res.data.message).toEqual('create new');
  });

  it('replace new', async () => {
    const connection = await dbConnection.getConnection();
    await connection.manager.save(dummy.testNews1);
    const res = await axios.put(`/api/news/1`, {
      title: dummy.testNewsPut.title,
      content: dummy.testNewsPut.content,
      status_content: dummy.testNewsPut.status_content,
    });
    expect(res.status).toBe(200);
    expect(res.data.message).toEqual('replace new');
  });

  it('update new', async () => {
    await dbUtils.setupDummyTestData();
    const res = await axios.patch(`/api/news/2/status_content`, {
      status_content: dummy.testNewsPatch.status_content,
    });
    expect(res.status).toBe(200);
    expect(res.data.message).toEqual('update new');
  });

  it('delete new', async () => {
    await dbUtils.setupDummyTestData();
    const res = await axios.delete(`/api/news/3`);
    expect(res.status).toBe(200);
    expect(res.data.message).toEqual('delete new');
  });
});