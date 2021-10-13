## 简介

模块包暂未发布

基于 koa2 二次封装的企业级框架模板，设计思想参考 egg loader 加载器原理，实现自动加载 router , controller , service 挂载到 ctx 对象上，内部通过 ctx[controller/service]进行调用，对象内部使用同一个上下文，并且根据可以创建 BaseController 和 BaseService 实现继承。

实现内容：

- [x] loadUtil
- [x] loadRouter
- [x] loadService
- [x] loadController
- [x] loadMiddleware
- [x] loadSchedule

待实现功能：

- 根据环境变量加载配置文件
- 丰富默认自带的 util
- 增加框架启动配置日志

## 使用

创建项目入口 app.js

```js
const { App } = require('@ddz/koa-enterprise');
const routes = require('./routes');
// const middleWares = require('./middleware');

const app = new App({
  routes,
  // middleWares,
});

const server = app.listen(3000, () => {
  console.log('服务启动成功 http://127.0.0.1:3000');
});

module.exports = server;
```

其他内容请参考 test/demo 例子
