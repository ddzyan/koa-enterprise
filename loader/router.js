const Router = require('koa-router');

const Loader = require('./loader');

class RouterLoader extends Loader {
  constructor({ dirPath, app }) {
    super();
    if (!app) assert('app 对象不能为空');
    this.app = app;

    this.loadDir(dirPath).forEach((filepath) => {
      this.loadFile(filepath, this.app);
    });
  }
}

module.exports = RouterLoader;
