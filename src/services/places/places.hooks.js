const { authenticate } = require('@feathersjs/authentication').hooks;
const authHook = require('../../hooks/auth');
const makeRaw = require('../../utils/make-raw');

/*eslint no-console: ["error", { allow: ["info", "warn", "error"] }] */
module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      authenticate('jwt'),
      authHook.restrictTo(authHook.HASH_HISTORIANS, authHook.ON_DISK, authHook.TRAILMASTERS, authHook.WEBMASTERS)
    ],
    update: [
      authenticate('jwt'),
      authHook.restrictTo(authHook.HASH_HISTORIANS, authHook.ON_DISK, authHook.TRAILMASTERS, authHook.WEBMASTERS),
      makeRaw,
      function(hook) {
        return new Promise(function(resolve, reject) {
          console.info(`Looking for place: ${hook.id}`);
          hook.service.find({query: {id: hook.id}}).then(foundPlace => {
            if (foundPlace && foundPlace.total > 0) {
              const placeInDB = foundPlace.data[0];
              console.info('Found place:', placeInDB);
              if (placeInDB.createdAt) {
                hook.data.createdAt = placeInDB.createdAt;
              }
              resolve(hook);
            } else {
              console.info('Creating place:', hook.data);
              hook.service.create(hook.data).then(newPlace => {
                console.info('Created place:', newPlace);
                hook.data = newPlace;
                resolve(hook);
              }, reject);
            }
          }, reject);
        });
      }
    ],
    patch: [ authenticate('jwt'), authHook.restrictTo() ],
    remove: [ authenticate('jwt'), authHook.restrictTo() ]
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
