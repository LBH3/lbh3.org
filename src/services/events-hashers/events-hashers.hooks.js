const { authenticate } = require('feathers-authentication').hooks;
const authHook = require('../../hooks/auth');

const restrictToBored = [
  authenticate('jwt'),
  authHook.restrictToBored()
];

const getRequiredData = function(hook) {
  return new Promise(function(resolve, reject) {
    new Promise(function(resolve, reject) {
      if (hook.data.hasherId) {
        resolve(hook.data);
      } else {
        hook.service.get(hook.id).then(resolve, reject);
      }
    }).then(eventHasher => {
      hook.app.service('api/events').find({query: {trailNumber: eventHasher.trailNumber}}).then(events => {
        hook.app.service('api/hashers').get(eventHasher.hasherId).then(hasher => {
          resolve({
            event: events.data[0],
            hasher
          });
        }, reject);
      }, reject);
    }, reject);
  });
};

const createHook = function(hook) {
  return new Promise(function(resolve, reject) {
    getRequiredData(hook).then(({event, hasher}) => {
      const eventMiles = Number(event.miles);

      const hasherPatchData = {
        miles: Number(hasher.miles) + eventMiles,
        runCount: Number(hasher.runCount) + 1,
        runMileage: Number(hasher.runMileage) + eventMiles
      };
      hook.app.service('api/hashers').patch(hasher.id, hasherPatchData).then(() => {

        const eventPatchData = {
          hashersTotal: Number(event.hashersTotal) + 1
        };
        hook.app.service('api/events').patch(event.id, eventPatchData).then(() => {
          resolve(hook);
        }, reject);
      }, reject);
    }, reject);
  });
};

const removeHook = function(hook) {
  return new Promise(function(resolve, reject) {
    getRequiredData(hook).then(({event, hasher}) => {
      const eventMiles = Number(event.miles);

      const hasherPatchData = {
        miles: Number(hasher.miles) - eventMiles,
        runCount: Number(hasher.runCount) - 1,
        runMileage: Number(hasher.runMileage) - eventMiles
      };
      hook.app.service('api/hashers').patch(hasher.id, hasherPatchData).then(() => {

        const eventPatchData = {
          hashersTotal: Number(event.hashersTotal) - 1
        };
        hook.app.service('api/events').patch(event.id, eventPatchData).then(() => {
          resolve(hook);
        }, reject);
      }, reject);
    }, reject);
  });
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ ...restrictToBored, createHook ],
    update: [ ...restrictToBored ],
    patch: [ ...restrictToBored ],
    remove: [ ...restrictToBored, removeHook ]
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
