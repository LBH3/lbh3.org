const { authenticate } = require('feathers-authentication').hooks;
const authHook = require('../../hooks/auth');
const errors = require('feathers-errors');
const getBoredHasher = require('../../utils/get-bored-hasher');
const jwtAuthentication = authenticate('jwt');
const makeRaw = require('../../utils/make-raw');
const searchHook = require('../../hooks/search');

const attachAuthInfo = function(hook) {
  return new Promise(function(resolve) {
    jwtAuthentication(hook).then(() => {
      resolve(hook);
    }, () => {
      resolve(hook);
    });
  });
};

const boredPositions = [authHook.HASH_CASH, authHook.HASH_HISTORIANS, authHook.ON_DISK, authHook.WEBMASTERS];

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

const filterData = function(data) {
  const allowedFields = ['hashName', 'id'];
  const filteredFields = {};
  allowedFields.forEach(field => {
    filteredFields[field] = data[field];
  });
  return filteredFields;
};

const filterFields = function(hook) {
  const user = hook.params.user;
  if (user) {
    return new Promise(function(resolve) {
      getBoredHasher(hook.app, user).then(boredHashers => {
        const found = boredHashers.data.find(boredHasher => {
          return boredPositions.includes(boredHasher.positionId);
        });
        if (!found) {
          hook.result = filterData(hook.result);
        }
        resolve(hook);
      }, () => {
        hook.result = filterData(hook.result);
        resolve(hook);
      });
    });
  } else {
    hook.result = filterData(hook.result);
  }
};

module.exports = {
  before: {
    all: [],
    find: [
      jwtAuthentication,
      authHook.restrictTo(...boredPositions),
      searchHook({
        contains: ['emailAddresses', 'emailAddressesPrivate'],
        fields: ['familyName', 'givenName', 'hashName']
      })
    ],
    get: [ attachAuthInfo ],
    create: [ jwtAuthentication, authHook.restrictTo(authHook.HASH_HISTORIANS, authHook.ON_DISK, authHook.WEBMASTERS), createAndUpdateFields ],
    update: [ jwtAuthentication, authHook.restrictTo(...boredPositions), createAndUpdateFields, makeRaw ],
    patch: [ jwtAuthentication, authHook.restrictTo() ],
    remove: [ jwtAuthentication, authHook.restrictTo(authHook.WEBMASTERS) ]
  },

  after: {
    all: [],
    find: [],
    get: [ filterFields ],
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
