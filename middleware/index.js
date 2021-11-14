const views = require('koa-views');
const bodyParser = require('koa-bodyparser');
const init = require('./init');
// const route = require('./route');
const healthpeak = require('./healthpeak');

module.exports = {
  init,
  // route,
  views,
  bodyParser,
  healthpeak,
};
