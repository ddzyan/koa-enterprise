const request = require('supertest');
const assert = require('assert');

process.env.baseDir = 'test/demo';
const app = require('./demo/app');

describe('服务测试', () => {
  it('/ test', (done) => {
    request(app)
      .get('/')
      .expect(200)
      .end((err, res) => {
        if (err) assert.fail(err);
        assert.strictEqual(res.body.data, 'hello word', '返回结果错误');
        done();
      });
  });
});
