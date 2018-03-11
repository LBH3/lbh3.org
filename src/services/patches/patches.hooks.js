const { authenticate } = require('feathers-authentication').hooks;
const authHook = require('../../hooks/auth');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ authHook.restrictToSignedInHashers ],
    get: [ authHook.restrictToSignedInHashers ],
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
