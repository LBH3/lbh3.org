const { authenticate } = require('@feathersjs/authentication').hooks;
const authHook = require('../../hooks/auth');
const crypto = require('crypto');

const createHook = function(hook) {
  const hash = crypto.createHash('sha256');
  hash.update(hook.data.encryptedBallot);
  hook.data.hasherId = hook.params.user.hasherId;
  hook.data.sha256 = hash.digest('base64');
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ authHook.restrictToSignedInHashers ],
    get: [ authHook.restrictToSignedInHashers ],
    create: [ authHook.restrictToSignedInHashers, createHook ],
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
