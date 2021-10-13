const Koa = require('koa');
const path = require('path');

const middleware = require('./middleware');
const utils = require('./util');
const ControllerLoader = require('./loader/controller');
const ServiceLoader = require('./loader/service');
const ScheduleLoader = require('./loader/schedule');

class App extends Koa {
  constructor(options = {}) {
    super();
    const {
      projectRoot = path.join(process.cwd(), process.env.baseDir || ''),
      rootControllerPath,
      rootSchedulePath,
      rootServicePath,
      rootViewPath,
    } = options;
    this.rootSchedulePath = rootSchedulePath || path.join(projectRoot, 'schedules');
    this.rootControllerPath = rootControllerPath || path.join(projectRoot, 'controllers');
    this.rootServicePath = rootServicePath || path.join(projectRoot, 'services');
    this.rootViewPath = rootViewPath || path.join(projectRoot, 'views');

    this.options = options;

    this.initController();
    this.initService();
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
    utils.forEach(util => util(context));
  }

  // 注入服务
  injectService(context) {
    const { serviceLoader } = this;

    Object.defineProperty(context, 'services', {
      get() {
        return serviceLoader.getServices(context);
      },
    });
  }

  // 初始化控制器
  initController() {
    this.controllerLoader = new ControllerLoader(this.rootControllerPath);
  }

  // 初始化服务
  initService() {
    this.serviceLoader = new ServiceLoader(this.rootServicePath);
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
