const { Service } = require('../../../index');

const posts = [
  {
    id: 1,
    title: 'this is test1',
  },
  {
    id: 2,
    title: 'this is test2',
  },
];

class HomeService extends Service {
  async getList() {
    return posts;
  }

  add(numA, numB) {
    const res = this.ctx.utils.number.add(numA, numB);

    return res;
  }
}

module.exports = HomeService;
