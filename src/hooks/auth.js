const errors = require('feathers-errors');
const getBoredHasher = require('../utils/get-bored-hasher');

module.exports = {
  GRANDMASTERS: 2,
  HASH_CASH: 4,
  HASH_FLASH: 5,
  HASH_HISTORIANS: 6,
  ON_DISK: 14,
  ON_SEC: 15,
  TRAILMASTERS: 19,
  WEBMASTERS: 20,

  restrictTo: function(...boredPositions) {
    return function(hook) {
      if (hook.type !== 'before') {
        throw new Error('This hook should only be used as a “before” hook.');
      }

      // If it was an internal call then skip this hook
      if (!hook.params.provider) {
        return hook;
      }

      const user = hook.params.user;
      if (!user) {
        throw new errors.NotAuthenticated('You are not authenticated.');
      }

      const error = new errors.Forbidden('You do not have valid permissions to access this.');

      return new Promise(function(resolve, reject) {
        getBoredHasher(hook.app, user).then(boredHashers => {
          const found = boredHashers.data.find(boredHasher => {
            return boredPositions.includes(boredHasher.positionId);
          });
          if (found) {
            resolve(hook);
          } else {
            reject(error);
          }
        }, reject);
      });
    };
  }
};
