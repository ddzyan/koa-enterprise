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

module.exports = class Home extends Service {
  async getList() {
    return posts;
  }
};
