const path = require('path');

const Loader = require('./loader');

const utilMap = new Map();
const utilClass = new Map();
const utils = {};

class UtilLoader extends Loader {
  constructor(utilPath) {
    super();

    this.loadDir(utilPath).forEach((filepath) => {
      const basename = path.basename(filepath);
      const extname = path.extname(filepath);
      const fileName = basename.substring(0, basename.indexOf(extname));
      if (utilMap.has(fileName)) {
        throw new Error(`utils文件夹下有${fileName}文件同名!`);
      }

      utilMap.set(fileName, filepath);

      Object.defineProperty(utils, fileName, {
        get() {
          if (utilMap.has(fileName)) {
            if (!utilClass.has(fileName)) {
              const newClass = require(utilMap.get(fileName));
              utilClass.set(fileName, newClass);
            }
            const S = utilClass.get(fileName);
            return new S();
          }
        },
      });
    });
  }

  getUtils() {
    return utils;
  }
}

module.exports = UtilLoader;
