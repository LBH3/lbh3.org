// From https://github.com/feathersjs/feathers-sequelize/pull/106#issuecomment-298775970
// Workaround for https://github.com/feathersjs/feathers-sequelize/issues/125
module.exports = (hook) => {
  if (!hook.params.sequelize) {
    hook.params.sequelize = {};
  }
  Object.assign(hook.params.sequelize, { raw: false });
  return hook;
};
