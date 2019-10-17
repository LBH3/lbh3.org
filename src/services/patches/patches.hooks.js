const { authenticate } = require('@feathersjs/authentication').hooks;
const authHook = require('../../hooks/auth');
const errors = require('@feathersjs/errors');

const boredPositions = [authHook.HASH_HISTORIANS, authHook.ON_DISK, authHook.ON_SEC, authHook.TRAILMASTERS, authHook.WEBMASTERS];
const restrictToBored = authHook.restrictToUserOrPositions(...boredPositions);

const restrictHook = function(hook) {

  // Skip this hook if it’s an internal call
  if (!hook.params.provider) {
    return hook;
  }

  // Check that the user is authenticated
  const user = hook.params.user;
  if (!user || !user.hasherId) {
    throw new errors.NotAuthenticated('You are not authenticated.');
  }

  // Check if the user is requesting their own info
  if (hook.params.query.hasherId == user.hasherId) {
    return hook;
  }

  // Check if the user is querying for a run they attended
  if (!hook.params.query.hasherId && hook.params.query.trailNumber) {
    return new Promise((resolve, reject) => {
      hook.app.service('api/events-hashers').find({
        query: {
          hasherId: user.hasherId,
          trailNumber: hook.params.query.trailNumber
        }
      }).then(result => {
        if (result.total === 1) {
          resolve(hook);
        } else {
          resolve(restrictToBored(hook));
        }
      }, reject);
    });
  }

  return restrictToBored(hook);
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ restrictHook ],
    get: [ restrictHook ],
    create: [ authHook.restrictTo(...boredPositions) ],
    update: [ authHook.restrictTo() ],
    patch: [ authHook.restrictTo() ],
    remove: [ authHook.restrictTo(...boredPositions) ]
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
