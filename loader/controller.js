const { assert } = require('console');
const path = require('path');

const Loader = require('./loader');

class ControllerLoader extends Loader {
  constructor({ dirPath, app }) {
    super();
    if (!app) assert('app 对象不能为空');
    this.app = app;
    const target = (this.app.controller = {});

    this.loadDir(dirPath).forEach((filepath) => {
      const basename = path.basename(filepath);
      const extname = path.extname(filepath);

      const fileName = basename.substring(0, basename.indexOf(extname));

      const newClass = this.loadFile(filepath, this.app);
      target[fileName] = newClass;
    });
  }
}

module.exports = ControllerLoader;
