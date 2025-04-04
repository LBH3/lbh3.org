const { authenticate } = require('@feathersjs/authentication').hooks;
const authHook = require('../../hooks/auth');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ authenticate('jwt'), authHook.restrictTo(authHook.WEBMASTERS) ],
    update: [ authenticate('jwt'), authHook.restrictTo() ],
    patch: [ authenticate('jwt'), authHook.restrictTo() ],
    remove: [ authenticate('jwt'), authHook.restrictTo(authHook.WEBMASTERS) ]
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
