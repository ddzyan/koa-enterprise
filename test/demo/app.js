const { App } = require('../../index');
const routes = require('./routes');
// const middleWares = require('./middleware');
console.log();
const app = new App({
  projectRoot: __dirname,
  routes,
  // middleWares,
});

const server = app.listen(3000, () => {
  console.log('服务启动成功 http://127.0.0.1:3000');
});

module.exports = server;
