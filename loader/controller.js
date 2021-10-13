const path = require('path');

const Loader = require('./loader');

const controllerMap = new Map();
const controllerClass = new Map();
class ControllerLoader extends Loader {
  constructor(controllerPath) {
    super();
    this.loadFiles(controllerPath).forEach((filepath) => {
      const basename = path.basename(filepath);
      const extname = path.extname(filepath);

      const fileName = basename.substring(0, basename.indexOf(extname));

      if (controllerMap.has(fileName)) {
        throw new Error(`controller文件夹下有${fileName}文件同名!`);
      }
      controllerMap.set(fileName, filepath);
    });
  }

  getClass(name) {
    if (controllerMap.has(name)) {
      if (!controllerClass.has(name)) {
        const newClass = require(controllerMap.get(name));
        // 只有用到某个controller才require这个文件
        controllerClass.set(name, newClass);
      }
      // 有缓存则直接返回
      return controllerClass.get(name);
    }
    throw new Error(`controller文件夹下没有${name}文件`);
  }
}

module.exports = ControllerLoader;
