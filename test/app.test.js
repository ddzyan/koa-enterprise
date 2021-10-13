const request = require('supertest');
const assert = require('assert');

const app = require('./demo/app');

describe('服务测试', () => {
  it('/ test', async (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err) assert.fail(err);
        const resBody = res.body;
        assert.strictEqual(resBody.data, 'hello word', '返回结果错误');
        done();
      });
  });
});
