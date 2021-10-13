const routes = [
  {
    match: '/',
    controller: 'home.index',
  },
  {
    match: '/list',
    controller: 'home.fetchList',
    method: 'post',
  },
];

module.exports = routes;
