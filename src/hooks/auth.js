const errors = require('feathers-errors');

module.exports = {
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

      if (!hook.params.user) {
        throw new errors.NotAuthenticated('You are not authenticated.');
      }

      const error = new errors.Forbidden('You do not have valid permissions to access this.');
      const user = hook.params.user;

      return new Promise(function(resolve, reject) {
        const now = new Date();
        const boredHashersQuery = {
          query: {
            endDate: {
              $gte: now
            },
            hasherId: user.hasherId,
            startDate: {
              $lte: now
            }
          }
        };
        hook.app.service('api/bored-hashers').find(boredHashersQuery).then(boredHashers => {
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
