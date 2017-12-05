const { authenticate } = require('feathers-authentication').hooks;
const authHook = require('../../hooks/auth');
const errors = require('feathers-errors');
const makeRaw = require('../../utils/make-raw');
const searchHook = require('../../hooks/search');

const createAndUpdateFields = function(hook) {
  const googleProfile = hook.params.user.googleProfile || {};
  let displayName = googleProfile.displayName || '';
  if (!displayName && googleProfile.emails && googleProfile.emails[0]) {
    displayName = googleProfile.emails[0];
  }

  if (hook.method === 'create' && !hook.data.createdBy && !hook.data.createdByUserId) {
    hook.data.createdBy = displayName;
    hook.data.createdByUserId = hook.params.user.id || 0;
  }

  hook.data.updatedBy = displayName;
  hook.data.updatedByUserId = hook.params.user.id || 0;

  const namingTrailNumber = hook.data.namingTrailNumber;
  if (namingTrailNumber) {
    return new Promise(function(resolve, reject) {
      const findEvent = {query: {trailNumber: namingTrailNumber}};
      hook.app.service('api/events').find(findEvent).then(events => {
        if (events.data.length === 1) {
          hook.data.namingTrailDate = events.data[0].startDatetime;
          resolve(hook);
        } else {
          reject(new errors.NotFound(`Could not find trail #${namingTrailNumber}`));
        }
      }, reject);
    });
  } else if (hook.data.namingTrailDate) {// Reset namingTrailDate if namingTrailNumber is not set
    hook.data.namingTrailDate = null;
  }
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [
      authHook.restrictTo(authHook.HASH_CASH, authHook.HASH_HISTORIANS, authHook.ON_DISK, authHook.WEBMASTERS),
      searchHook({
        fields: ['familyName', 'givenName', 'hashName']
      })
    ],
    get: [ authHook.restrictTo(authHook.HASH_CASH, authHook.HASH_HISTORIANS, authHook.ON_DISK, authHook.WEBMASTERS) ],
    create: [ authHook.restrictTo(authHook.HASH_HISTORIANS, authHook.ON_DISK, authHook.WEBMASTERS), createAndUpdateFields ],
    update: [ authHook.restrictTo(authHook.HASH_CASH, authHook.HASH_HISTORIANS, authHook.ON_DISK, authHook.WEBMASTERS), createAndUpdateFields, makeRaw ],
    patch: [ authHook.restrictTo() ],
    remove: [ authHook.restrictTo(authHook.WEBMASTERS) ]
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
