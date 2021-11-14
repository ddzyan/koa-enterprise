const { Controller } = require('../../../index');

class HomeController extends Controller {
  async index() {
    this.ctx.body = {
      code: 0,
      data: 'hello word',
    };
  }

  async fetchList(ctx, next) {
    const data = await ctx.services.home.getList();
    ctx.body = {
      code: 0,
      data,
    };
  }

  async add(ctx, next) {
    const data = ctx.services.home.add(1, 2);
    ctx.body = {
      code: 0,
      data,
    };
  }
}

module.exports = HomeController;
