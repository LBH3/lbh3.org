const { authenticate } = require('@feathersjs/authentication').hooks;
const authHook = require('../../hooks/auth');

const beforeFindHook = function(hook) {

  // Allow users to fetch their own eligibility
  if (hook.params.query.hasherId && Number(hook.params.query.hasherId) === hook.params.user.hasherId) {
    return hook;
  }

  // Special exception
  if ([977, 3435, 5908].indexOf(hook.params.user.hasherId) > -1) {
    return hook;
  }

  return authHook.restrictToWebmaster(hook);
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ beforeFindHook ],
    get: [ authHook.restrictTo() ],
    create: [ authHook.restrictTo() ],
    update: [ authHook.restrictTo() ],
    patch: [ authHook.restrictTo() ],
    remove: [ authHook.restrictTo() ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
