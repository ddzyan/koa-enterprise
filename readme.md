## 简介

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/koa-enterprise.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-enterprise
[download-image]: https://img.shields.io/npm/dm/koa-enterprise.svg?style=flat-square
[download-url]: https://npmjs.org/package/koa-enterprise

koa-enterprise 是基于 koa 二次封装的企业级框架模板，设计思想参考 egg ，实现 router , controller , service 等加载器自动化遍历加载对象，注册路由，内部通过 ctx[controller/service]进行调用，对象内部使用同一个上下文，并且根据可以创建 BaseController 和 BaseService 实现继承。

ctx 对象会在每次请求的时候进行创建，app 对象则是在框架启动的实时创建是一个单例

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

#### 待实现功能

- 根据环境变量加载配置文件
  - 通过配置文件控制中间件加载顺序等
- 插件的启动加载（orm）
- 丰富默认自带的 util
- 增加框架启动配置日志
- 增加框架默认自带的 logger 对象，并且统一输出格式
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
