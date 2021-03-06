## 简介

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/koa-enterprise.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-enterprise
[download-image]: https://img.shields.io/npm/dm/koa-enterprise.svg?style=flat-square
[download-url]: https://npmjs.org/package/koa-enterprise

基于 koa2 二次封装的企业级框架模板，设计思想参考 egg loader 加载器原理，实现自动加载 router , controller , service 挂载到 ctx 对象上，内部通过 ctx[controller/service]进行调用，对象内部使用同一个上下文，并且根据可以创建 BaseController 和 BaseService 实现继承。

### 实现内容

#### 已完成功能

- [x] loadUtil
- [x] loadRouter
- [x] loadService
- [x] loadController
- [x] loadMiddleware
- [x] loadSchedule

#### 已完成测试

- [x] 服务器启动，请求返回结果验证测试

#### 待实现功能：

- 根据环境变量加载配置文件
- 丰富默认自带的 util
- 增加框架启动配置日志
- 增加必要中间件
  - 请求日志

## 使用

创建项目入口 app.js

```js
const { App } = require('koa-enterprise');
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
