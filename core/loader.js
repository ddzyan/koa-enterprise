// 加载器
const path = require('path');
const fs = require('fs');
const walk = require('walk');

const CONTROLLER_PATH = '/controller/';

function rootPath() {
  return path.dirname(require.main.filename);
}

function LoadModule(moduleName) {
  return fs.existsSync(moduleName) ? require(moduleName) : false;
}

module.exports = (option) => {
  // 加载所有controller
  const controllerDir = path.join(rootPath(), CONTROLLER_PATH);
  const walker = walk.walk(controllerDir);
  walker.on('file', (root, fileStats, next) => {
    fs.readFile(fileStats.name, () => {
      const filePath = path.join(root, fileStats.name);

      LoadModule(filePath);
      console.log(filePath);
      next();
    });
  });

  walker.on('errors', (root, nodeStatsArray) => {
    console.error('controller loader error', nodeStatsArray);
  });

  walker.on('end', () => {
    console.log('all done');
  });

  return async function (ctx, next) {
    await next();
  };
};
