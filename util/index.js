const path = require('path');
const BuiltinModule = require('module');
const is = require('is-type-of');
const co = require('co');

// Guard against poorly mocked module constructors.
const Module = module.constructor.length > 1
  ? module.constructor
  : /* istanbul ignore next */
  BuiltinModule;
module.exports = {
  loadFile(filepath) {
    try {
      // if not js module, just return content buffer
      const extname = path.extname(filepath);
      if (extname && !Module._extensions[extname]) {
        return fs.readFileSync(filepath);
      }
      // require js module
      const obj = require(filepath);
      if (!obj) return obj;
      // it's es module
      if (obj.__esModule) return 'default' in obj ? obj.default : obj;
      return obj;
    } catch (err) {
      err.message = `load file: ${filepath}, error: ${err.message}`;
      throw err;
    }
  },

  async callFn(fn, args, ctx) {
    args = args || [];
    if (!is.function(fn)) return;
    if (is.generatorFunction(fn)) fn = co.wrap(fn);
    return ctx ? fn.call(ctx, ...args) : fn(...args);
  },
};
