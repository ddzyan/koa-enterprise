const Koa = require('koa');
const path = require('path');
const assert = require('assert');
const fs = require('fs');
const Router = require('koa-router');

const middleware = require('./middleware');
const ControllerLoader = require('./loader/controller');
const ServiceLoader = require('./loader/service');
const ScheduleLoader = require('./loader/schedule');
const UtilLoader = require('./loader/util');
const RouterLoader = require('./loader/router');

const ROUTER = Symbol('Core#router');

class App extends Koa {
  constructor(options = {}) {
    super();
    const {
      projectRoot = __dirname,
      rootControllerPath,
      rootSchedulePath,
      rootServicePath,
      rootUtilPath,
      rootViewPath,
    } = options;
    this.logger = options.logger || console;
    assert(fs.existsSync(options.projectRoot), `${options.projectRoot} not exists`);

    this.rootSchedulePath = rootSchedulePath || path.join(projectRoot, 'schedules');
    this.rootControllerPath = rootControllerPath || path.join(projectRoot, 'controllers');
    this.rootServicePath = rootServicePath || path.join(projectRoot, 'services');
    this.rootRoutePath = rootServicePath || path.join(projectRoot, 'routes');
    this.rootUtilPath = rootUtilPath || path.join(projectRoot, 'utils');
    this.rootViewPath = rootViewPath || path.join(projectRoot, 'views');

    this.options = options;

    this.initController();
    this.initService();
    this.loadRouter();
    this.initUtil();
    this.initMiddleware();
    this.initSchedule();
  }

  // 创建上下文
  createContext(req, res) {
    const context = super.createContext(req, res);
    // 注入全局方法
    this.injectUtil(context);

    // 注入Services
    this.injectService(context);
    return context;
  }

  // 注入工具方法
  injectUtil(context) {
    const { utilLoader } = this;

    Object.defineProperty(context, 'utils', {
      get() {
        return utilLoader.getUtils();
      },
    });
  }

  // 注入服务
  injectService(context) {
    const { serviceLoader } = this;

    Object.defineProperty(context, 'services', {
      get() {
        return serviceLoader.getInstance(context);
      },
    });
  }

  // 初始化控制器
  initController() {
    this.controllerLoader = new ControllerLoader({ dirPath: this.rootControllerPath, app: this });
    this.logger.info('[loader] Controller loaded: %s', this.rootControllerPath);
  }

  // 初始化router
  loadRouter() {
    new RouterLoader({ dirPath: this.rootRoutePath, app: this });
    this.logger.info('[loader] Router loaded: %s', this.rootRoutePath);
  }

  get router() {
    if (this[ROUTER]) {
      return this[ROUTER];
    }
    const router = (this[ROUTER] = new Router());

    return router;
  }

  // 初始工具加载器
  initUtil() {
    this.utilLoader = new UtilLoader(this.rootUtilPath);
    this.logger.info('[loader] Util loaded: %s', this.rootUtilPath);
  }

  // 初始化服务
  initService() {
    this.serviceLoader = new ServiceLoader(this.rootServicePath);
    this.logger.info('[loader] Service loaded: %s', this.rootServicePath);
  }

  // 初始化中间件
  initMiddleware() {
    const { middleWares = [], routes = [], config = {} } = this.options;

    // 初始化中间件
    this.use(middleware.init());
    this.use(middleware.healthcheck());
    this.use(middleware.views(this.rootViewPath, { map: { html: 'ejs' } }));

    if (config && config.proxy) {
      // proxy中间件要放在bodyParser之前!
      this.use(middleware.proxy(config.proxy));
    }

    // 数据解析
    this.use(middleware.bodyParser());

    // 初始化业务中间件
    middleWares.forEach((m) => {
      if (typeof m === 'function') {
        this.use(m);
      } else {
        throw new Error('中间件必须是函数');
      }
    });

    // controller要最后注册
    this.use(middleware.route(routes, this.controllerLoader));
  }

  // 初始化定时任务
  initSchedule() {
    this.schedule = new ScheduleLoader(this.rootSchedulePath);
  }
}

module.exports = App;
