const { authenticate } = require('@feathersjs/authentication').hooks;
const authHook = require('../../hooks/auth');

const beforeHook = function(hook) {

  // Allow users to fetch their own paper ballots
  if (hook.params.query.hasherId && Number(hook.params.query.hasherId) === hook.params.user.hasherId) {
    return hook;
  }

  // Special exception
  if (hook.params.user.hasherId === 70) {
    return hook;
  }

  return authHook.restrictToWebmaster(hook);
};

const createHook = function(hook) {
  hook.data.addedById = hook.params.user.hasherId;
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ beforeHook ],
    get: [ authHook.restrictTo() ],
    create: [ beforeHook, createHook ],
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
