const uuid = require('uuid');

module.exports = () => async (context, next) => {
  const id = uuid.v4().replace(/-/g, '');
  context.state.global = {
    __requestId: id,
  };
  await next();
};
