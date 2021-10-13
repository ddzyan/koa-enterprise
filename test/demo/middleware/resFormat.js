const Stream = require('stream');

module.exports = () => async (ctx, next) => {
  try {
    await next();
    const {
      body, method, path, statusCode,
    } = ctx;
    if (body instanceof Buffer || body instanceof Stream) {
      return;
    }
    if (statusCode) {
      ctx.status = statusCode; // 设置http状态码
      ctx.body = {
        code: 200,
        msg: body,
        errorCode: 0,
        request: `${method} ${path}`,
      };
    } else {
      ctx.body = {
        code: 404,
        msg: '资源不存在',
        errorCode: 0,
        request: `${method} ${path}`,
      };
      ctx.status = 404; // 设置http状态码
    }
  } catch (error) {
    const msg = '服务器报错了';
    const code = 500; // 请求返回状态码
    const errorCode = 999; // 具体错误码，用以定位问题

    ctx.status = code; // 设置http状态码
    ctx.body = {
      msg: i18n.t(msg),
      errorCode,
      request: `${ctx.method} ${ctx.path}`,
    };
    throw error;
  }
};
