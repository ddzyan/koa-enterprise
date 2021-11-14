const Koa = require('koa');
const Router = require('koa-router');

const middleware = require('./middleware');
const ServiceLoader = require('./loader/mixin/service');
const ScheduleLoader = require('./loader/mixin/schedule');
const UtilLoader = require('./loader/util');
const Loader = require('./loader');

const ROUTER = Symbol('Core#router');

class AppCore extends Koa {
  constructor(options = {}) {
    super();
    options.baseDir = options.baseDir || process.cwd(); // 默认 app 路径

    this.console = options.logger || console;
    this.options = options;

    this.beforeStartArr = [];

    const loader = new Loader({
      baseDir: options.baseDir,
      app: this,
      logger: this.console,
    });

    // 先架子啊controller
    loader.loadController();
    loader.loadRouter();

    this.beforeStart();
    // this.initService();
    // this.initUtil();
    // this.initMiddleware();
    // this.initSchedule();
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
    const { middleWares = [], config = {} } = this.options;

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
  }

  // 初始化定时任务
  initSchedule() {
    this.schedule = new ScheduleLoader(this.rootSchedulePath);
  }

  get router() {
    if (this[ROUTER]) {
      return this[ROUTER];
    }

    this[ROUTER] = new Router();

    const router = this[ROUTER];

    this.beforeStartArr.push((_this) => {
      _this.use(router.routes());
      _this.use(router.allowedMethods());
    });

    return router;
  }

  beforeStart() {
    for (const item of this.beforeStartArr) {
      item(this);
    }
  }
}

module.exports = AppCore;
