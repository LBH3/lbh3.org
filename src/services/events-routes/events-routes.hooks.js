const { authenticate } = require('@feathersjs/authentication').hooks;
const authHook = require('../../hooks/auth');

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [authHook.restrictToSignedInHashers],
    get: [authHook.restrictToSignedInHashers],
    create: [authHook.restrictToSignedInHashers],
    update: [authHook.restrictTo()],
    patch: [authHook.restrictTo()],
    remove: [authHook.restrictToSignedInHashers],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
