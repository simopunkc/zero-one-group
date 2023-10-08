import axios from 'axios';
import { dbUtils } from "@api/src/data-source";

describe('/', () => {
  beforeEach(async () => {
    await dbUtils.resetDb();
    await dbUtils.setupDummyTestData();
    jest.resetModules();
  });

  it('hello', async () => {
    const res = await axios.get(`/`);
    expect(res.status).toBe(200);
    expect(res.data.message).toEqual('Hello API');
  });
  
  it('reset db', async () => {
    const res = await axios.get(`/reset`);
    expect(res.status).toBe(200);
    expect(res.data.message).toEqual('Reset DB Success');
  });
});