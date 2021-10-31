const glob = require('glob');
const _ = require('lodash');
const is = require('is-type-of');
const util = require('../util');

class Loader {
  loadDir(target) {
    const files = glob.sync(`${target}/**/*.js`);
    return files;
  }

  // 加载文件
  loadFile(filepath) {
    let ret = null;
    try {
      ret = util.loadFile(filepath);
    } catch (error) {
      error.message = `load file ${filepath} error: ${error.message}`;
      throw error;
    }

    const inject = Array.prototype.slice.call(arguments, 1);
    console.log('is.function(ret)', is.function(ret));
    if (is.function(ret) && !is.class(ret)) {
      return ret(...inject);
    }
    if (is.class(ret)) {
      return new ret(inject);
    }
  }

  // 获取服务环境变量
  getServerEnv() {
    let serverEnv = process.env.SERVER_ENV;

    if (!serverEnv) {
      serverEnv = 'local';
    } else {
      serverEnv = serverEnv.trim();
    }

    return serverEnv;
  }
}

module.exports = Loader;
