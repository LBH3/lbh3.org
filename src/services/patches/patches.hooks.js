const { authenticate } = require('feathers-authentication').hooks;
const authHook = require('../../hooks/auth');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ authHook.restrictTo(authHook.GRANDMASTERS, authHook.HASH_CASH, authHook.HASH_HISTORIANS, authHook.ON_DISK, authHook.ON_SEC, authHook.WEBMASTERS) ],
    get: [ authHook.restrictTo(authHook.GRANDMASTERS, authHook.HASH_CASH, authHook.HASH_HISTORIANS, authHook.ON_DISK, authHook.ON_SEC, authHook.WEBMASTERS) ],
    create: [ authHook.restrictTo(authHook.HASH_HISTORIANS, authHook.ON_DISK, authHook.WEBMASTERS) ],
    update: [ authHook.restrictTo() ],
    patch: [ authHook.restrictTo() ],
    remove: [ authHook.restrictTo(authHook.HASH_HISTORIANS, authHook.ON_DISK, authHook.WEBMASTERS) ]
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
