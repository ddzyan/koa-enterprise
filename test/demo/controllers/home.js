const { Controller } = require('../../../index');

class HomeController extends Controller {
  async index() {
    this.ctx.body = 'hello word';
  }

  async fetchList(ctx, next) {
    const data = await ctx.services.home.getList();
    ctx.body = data;
  }
}

module.exports = HomeController;
