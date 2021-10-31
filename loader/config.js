const path = require('path');

const Loader = require('./loader');

class ConfigLoader extends Loader {
  constructor(dirPath) {
    const target = {};

    const names = ['config.default.js', `config.${this.serverEnv}.js`];

    for (const fileName of names) {
      const config = this._loadConfig(dirPath, fileName);
      Object.assign(target, config);
    }

    return target;
  }

  _loadConfig(dirPath, fileName) {
    let filepath = path.join(dirPath, 'config', fileName);
    // 兼容没有 config.default.js 的情况
    if (fileName === 'config.default.js' && !fs.existsSync(filepath)) {
      filepath = path.join(dirPath, 'config/config.js');
    }

    const config = this.loadFile(filepath);
    if (!config) {
      return null;
    }

    return config;
  }
}

module.exports = ConfigLoader;
